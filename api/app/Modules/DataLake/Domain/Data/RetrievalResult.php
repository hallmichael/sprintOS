<?php

namespace App\Modules\DataLake\Domain\Data;

/** A scored chunk returned by the vector store, with provenance. */
final readonly class RetrievalResult
{
    public function __construct(
        public string $chunkId,
        public string $documentId,
        public string $text,
        public float $score,
        public array $metadata,
    ) {}
}
