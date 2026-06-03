<?php

namespace App\Modules\DataLake\Domain\Services;

use App\Modules\DataLake\Domain\Contracts\VectorStore;
use App\Modules\DataLake\Domain\Data\RetrievalResult;
use App\Modules\DataLake\Domain\Data\TextChunk;

/**
 * File-backed vector store for tests and local dev.
 * Persists the index to storage/app/datalake/vector_index.json so vectors
 * survive across HTTP requests on the dev server. In APP_ENV=testing we skip
 * the file write so tests stay in-memory and RefreshDatabase works cleanly.
 */
final class FakeVectorStore implements VectorStore
{
    private string $path;
    /** @var array<string, array{vector: array<float>, tenantId: string, chunk: array}> */
    private array $store = [];

    public function __construct()
    {
        $dir = storage_path('app/datalake');
        if (!is_dir($dir)) {
            mkdir($dir, 0755, true);
        }
        $this->path = $dir.'/vector_index.json';
        if (!app()->environment('testing') && file_exists($this->path)) {
            $this->store = json_decode((string) file_get_contents($this->path), true) ?? [];
        }
    }

    public function index(string $tenantId, TextChunk $chunk, array $vector): void
    {
        $key = "{$tenantId}:{$chunk->vectorId()}";
        $this->store[$key] = [
            'vector'   => $vector,
            'tenantId' => $tenantId,
            'chunk'    => [
                'documentId' => $chunk->documentId,
                'index'      => $chunk->index,
                'text'       => $chunk->text,
                'roleTags'   => $chunk->roleTags,
                'metadata'   => $chunk->metadata,
            ],
        ];
        if (!app()->environment('testing')) {
            file_put_contents($this->path, json_encode($this->store));
        }
    }

    public function search(string $tenantId, array $queryVector, array $roles, int $topK = 5): array
    {
        $results = [];
        foreach ($this->store as $entry) {
            if ($entry['tenantId'] !== $tenantId) {
                continue;
            }
            $chunk = $entry['chunk'];
            $tags  = $chunk['roleTags'] ?? [];
            if (!empty($tags) && empty(array_intersect($tags, $roles))) {
                continue;
            }
            $results[] = new RetrievalResult(
                chunkId:    "{$chunk['documentId']}_{$chunk['index']}",
                documentId: $chunk['documentId'],
                text:       $chunk['text'],
                score:      $this->cosine($queryVector, $entry['vector']),
                metadata:   $chunk['metadata'],
            );
        }
        usort($results, fn ($a, $b) => $b->score <=> $a->score);
        return array_slice($results, 0, $topK);
    }

    public function deleteDocument(string $tenantId, string $documentId): void
    {
        foreach (array_keys($this->store) as $key) {
            if (str_starts_with($key, "{$tenantId}:{$documentId}_")) {
                unset($this->store[$key]);
            }
        }
        if (!app()->environment('testing')) {
            file_put_contents($this->path, json_encode($this->store));
        }
    }

    /** @param array<float> $a @param array<float> $b */
    private function cosine(array $a, array $b): float
    {
        $len = min(count($a), count($b));
        if ($len === 0) return 0.0;
        $dot = $normA = $normB = 0.0;
        for ($i = 0; $i < $len; $i++) {
            $dot   += $a[$i] * $b[$i];
            $normA += $a[$i] ** 2;
            $normB += $b[$i] ** 2;
        }
        $denom = sqrt($normA) * sqrt($normB);
        return $denom > 0 ? $dot / $denom : 0.0;
    }
}
