<?php

namespace App\Modules\DataLake\Domain\Services;

use App\Modules\Ai\Domain\Data\EmbedRequest;
use App\Modules\Ai\Domain\Services\ModelGateway;
use App\Modules\DataLake\Domain\Contracts\VectorStore;
use App\Modules\DataLake\Domain\Data\RetrievalResult;

/**
 * Retrieval-augmented search (Build Guide 4.6).
 *
 * The caller's tenant_id + roles are ALWAYS injected — a user cannot retrieve
 * content that their roles don't permit. This is the single entry point for
 * any RAG query (HTTP endpoint + the rag_search agent tool).
 */
final class RetrievalService
{
    public function __construct(
        private readonly VectorStore  $vectors,
        private readonly ModelGateway $gateway,
    ) {}

    /**
     * Embed the query and return the top-k most relevant chunks the caller
     * is permitted to read.
     *
     * @param  array<string>  $roles  the authenticated user's org-level roles
     * @return array<RetrievalResult>
     */
    public function search(
        string $tenantId,
        string $query,
        array $roles,
        int $topK = 5,
        ?string $correlationId = null,
    ): array {
        $embedRes = $this->gateway->embed(new EmbedRequest(
            tenantId:      $tenantId,
            inputs:        [$query],
            actorType:     'user',
            correlationId: $correlationId ?? "rag-{$tenantId}",
        ));

        $queryVector = $embedRes->vectors[0] ?? [];

        return $this->vectors->search($tenantId, $queryVector, $roles, $topK);
    }

    /**
     * Build a context string for injection into a prompt (the standard RAG
     * "stuff documents" pattern). Callers can use this directly or pass the
     * individual results to the model as structured context.
     *
     * @param  array<RetrievalResult>  $results
     */
    public function buildContext(array $results): string
    {
        if (empty($results)) {
            return '';
        }

        $parts = array_map(fn (RetrievalResult $r, int $i) => sprintf(
            "[%d] (score: %.2f) %s\n%s",
            $i + 1,
            $r->score,
            $r->metadata['title'] ?? 'Document',
            $r->text,
        ), $results, array_keys($results));

        return implode("\n\n---\n\n", $parts);
    }
}
