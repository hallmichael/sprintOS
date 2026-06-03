<?php

namespace App\Modules\Ai\Domain\Data;

/**
 * Embedding vectors for the requested texts, plus token usage for metering.
 *
 * @property array<int, array<int, float>> $vectors one vector per input
 */
final readonly class EmbedResponse
{
    public function __construct(
        public array $vectors,
        public int $inputTokens,
        public string $model,
    ) {}
}
