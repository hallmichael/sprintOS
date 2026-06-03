<?php

namespace App\Modules\DataLake\Domain\Contracts;

use App\Modules\DataLake\Domain\Data\RetrievalResult;
use App\Modules\DataLake\Domain\Data\TextChunk;

/**
 * Abstracts the vector index. OpenSearch Serverless in production;
 * an in-memory fake for dev/tests. All queries are tenant-scoped.
 */
interface VectorStore
{
    /**
     * Index one chunk — stores the vector and its metadata.
     *
     * @param array<int, float> $vector embedding produced by ModelGateway::embed
     */
    public function index(string $tenantId, TextChunk $chunk, array $vector): void;

    /**
     * Find the top-k most similar chunks in the tenant's corpus,
     * filtered by the caller's roles (users only see docs accessible to them).
     *
     * @param  array<int, float>  $queryVector
     * @param  array<string>      $roles         the authenticated user's roles
     * @return array<RetrievalResult>
     */
    public function search(string $tenantId, array $queryVector, array $roles, int $topK = 5): array;

    /** Remove all chunks belonging to a document (when the doc is deleted). */
    public function deleteDocument(string $tenantId, string $documentId): void;
}
