<?php

namespace App\Modules\DataLake\Domain\Data;

/** A segment of a document ready to be embedded and indexed. */
final readonly class TextChunk
{
    public function __construct(
        public string $documentId,
        public int $index,        // position within the document (0-based)
        public string $text,
        /** @var array<string> $roleTags */
        public array $roleTags,
        public array $metadata,   // title, source, page, etc.
    ) {}

    public function vectorId(): string
    {
        return "{$this->documentId}_{$this->index}";
    }
}
