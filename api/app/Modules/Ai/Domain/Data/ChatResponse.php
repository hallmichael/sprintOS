<?php

namespace App\Modules\Ai\Domain\Data;

/**
 * Result of a chat call. Either yields text, or one or more tool_use blocks the
 * caller must execute and feed back (the agentic loop, Phase 5).
 *
 * @property array<int, ToolUse> $toolUses
 */
final readonly class ChatResponse
{
    public function __construct(
        public ?string $text,
        public array $toolUses,
        public TokenUsage $usage,
        public string $stopReason,   // end_turn | tool_use | max_tokens
        public string $model,
    ) {}

    public function wantsTool(): bool
    {
        return $this->toolUses !== [];
    }
}
