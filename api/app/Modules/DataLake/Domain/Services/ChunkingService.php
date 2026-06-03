<?php

namespace App\Modules\DataLake\Domain\Services;

use App\Modules\DataLake\Domain\Data\TextChunk;

/**
 * Splits a document's extracted text into overlapping token windows.
 *
 * Strategy: split on sentence boundaries, then group into chunks of
 * ≤ $maxChars with a $overlapChars overlap so context isn't lost at splits.
 * This is a practical heuristic — a more sophisticated approach (tiktoken)
 * is a Phase 6 hardening item.
 */
final class ChunkingService
{
    public function __construct(
        private readonly int $maxChars    = 1500,
        private readonly int $overlapChars = 200,
    ) {}

    /**
     * @param  array<string>  $roleTags
     * @return array<int, TextChunk>
     */
    public function chunk(
        string $documentId,
        string $text,
        array $roleTags,
        array $metadata,
    ): array {
        // Normalise whitespace.
        $text = preg_replace('/\s+/', ' ', trim($text)) ?? $text;

        if (strlen($text) === 0) {
            return [];
        }

        // Split on sentence-ending punctuation followed by whitespace.
        $sentences = preg_split('/(?<=[.?!])\s+/', $text) ?: [$text];

        $chunks = [];
        $buffer = '';
        $idx    = 0;

        foreach ($sentences as $sentence) {
            if (strlen($buffer) + strlen($sentence) > $this->maxChars && $buffer !== '') {
                $chunks[] = new TextChunk(
                    documentId: $documentId,
                    index:      $idx++,
                    text:       trim($buffer),
                    roleTags:   $roleTags,
                    metadata:   $metadata,
                );
                // Keep tail overlap for context continuity.
                $buffer = substr($buffer, -$this->overlapChars);
            }
            $buffer .= ($buffer !== '' ? ' ' : '').$sentence;
        }

        // Flush remainder.
        if (trim($buffer) !== '') {
            $chunks[] = new TextChunk(
                documentId: $documentId,
                index:      $idx,
                text:       trim($buffer),
                roleTags:   $roleTags,
                metadata:   $metadata,
            );
        }

        return $chunks;
    }

    /**
     * Best-effort text extraction. Handles plain text, basic HTML stripping,
     * and JSON. PDF/DOCX extraction is a Phase 6 enhancement (would use a
     * dedicated parser or Lambda function).
     */
    public function extractText(string $content, string $mimeType): string
    {
        return match (true) {
            str_contains($mimeType, 'html')  => strip_tags(
                preg_replace('/<(script|style)[^>]*>.*?<\/\1>/si', '', $content) ?? $content
            ),
            str_contains($mimeType, 'json')  => $this->jsonToText($content),
            default                          => $content,   // plain text, markdown, etc.
        };
    }

    private function jsonToText(string $json): string
    {
        try {
            $decoded = json_decode($json, true, 512, JSON_THROW_ON_ERROR);

            return $this->flattenToText($decoded);
        } catch (\Throwable) {
            return $json;
        }
    }

    private function flattenToText(mixed $value, int $depth = 0): string
    {
        if (is_string($value)) {
            return $value;
        }
        if (is_numeric($value)) {
            return (string) $value;
        }
        if (is_array($value)) {
            $parts = [];
            foreach ($value as $k => $v) {
                $text = $this->flattenToText($v, $depth + 1);
                if ($text !== '') {
                    $parts[] = (is_string($k) ? "{$k}: " : '').$text;
                }
            }

            return implode('. ', $parts);
        }

        return '';
    }
}
