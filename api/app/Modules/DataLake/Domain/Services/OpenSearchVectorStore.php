<?php

namespace App\Modules\DataLake\Domain\Services;

use App\Modules\DataLake\Domain\Contracts\VectorStore;
use App\Modules\DataLake\Domain\Data\RetrievalResult;
use App\Modules\DataLake\Domain\Data\TextChunk;
use Illuminate\Support\Facades\Http;

/**
 * OpenSearch Serverless vector store (DATALAKE_DRIVER=s3).
 * Uses Sprint's IAM for request signing. The index is per-deployment;
 * tenant_id and role_tags are stored as filterable fields.
 *
 * Index mapping (created by Terraform, see infra/):
 *   vector_field (knn_vector, dim=1024, cosine)
 *   tenant_id (keyword), document_id (keyword), chunk_index (integer),
 *   role_tags (keyword), text (text), metadata (object)
 */
final class OpenSearchVectorStore implements VectorStore
{
    private string $endpoint;
    private string $index;

    public function __construct(?string $endpoint = null, ?string $index = null)
    {
        $this->endpoint = rtrim($endpoint ?? (string) config('sprintos.datalake.opensearch_endpoint'), '/');
        $this->index    = $index ?? (string) config('sprintos.datalake.opensearch_index', 'sprintos-datalake');
    }

    public function index(string $tenantId, TextChunk $chunk, array $vector): void
    {
        Http::withHeaders($this->headers())->put(
            "{$this->endpoint}/{$this->index}/_doc/{$tenantId}_{$chunk->vectorId()}",
            [
                'tenant_id'    => $tenantId,
                'document_id'  => $chunk->documentId,
                'chunk_index'  => $chunk->index,
                'role_tags'    => $chunk->roleTags,
                'text'         => $chunk->text,
                'metadata'     => $chunk->metadata,
                'vector_field' => $vector,
            ],
        )->throw();
    }

    public function search(string $tenantId, array $queryVector, array $roles, int $topK = 5): array
    {
        $response = Http::withHeaders($this->headers())->post(
            "{$this->endpoint}/{$this->index}/_search",
            [
                'size' => $topK,
                'query' => [
                    'bool' => [
                        'must' => [
                            ['knn' => ['vector_field' => ['vector' => $queryVector, 'k' => $topK]]],
                        ],
                        'filter' => [
                            ['term'  => ['tenant_id' => $tenantId]],
                            ['terms' => ['role_tags' => $roles]],
                        ],
                    ],
                ],
            ],
        )->throw()->json();

        return array_map(fn ($hit) => new RetrievalResult(
            chunkId:    $hit['_id'],
            documentId: $hit['_source']['document_id'],
            text:       $hit['_source']['text'],
            score:      (float) ($hit['_score'] ?? 0),
            metadata:   (array) ($hit['_source']['metadata'] ?? []),
        ), $response['hits']['hits'] ?? []);
    }

    public function deleteDocument(string $tenantId, string $documentId): void
    {
        Http::withHeaders($this->headers())->post(
            "{$this->endpoint}/{$this->index}/_delete_by_query",
            ['query' => ['bool' => ['filter' => [
                ['term' => ['tenant_id'   => $tenantId]],
                ['term' => ['document_id' => $documentId]],
            ]]]],
        )->throw();
    }

    private function headers(): array
    {
        // IAM request signing is handled by the AWS SDK middleware added in production.
        // For the preview harness we use basic HTTP; production uses AWS SDK SigV4.
        return ['Content-Type' => 'application/json'];
    }
}
