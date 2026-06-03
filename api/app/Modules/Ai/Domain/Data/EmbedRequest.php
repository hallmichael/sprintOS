<?php

namespace App\Modules\Ai\Domain\Data;

/**
 * A request to embed one or more texts (for RAG indexing/retrieval, Phase 4).
 *
 * @property array<int, string> $inputs
 */
final readonly class EmbedRequest
{
    public function __construct(
        public string $tenantId,
        public array $inputs,
        public ?string $model = null,
        public string $actorType = 'system',
        public ?string $actorId = null,
        public ?string $correlationId = null,
    ) {}

    public function modelId(): string
    {
        return $this->model ?? (string) config('sprintos.ai.embedding_model');
    }
}
