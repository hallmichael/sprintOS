<?php

namespace App\Modules\Ai\Domain\Data;

/** A tool call the model wants to make (Bedrock tool_use block). */
final readonly class ToolUse
{
    public function __construct(
        public string $id,
        public string $name,
        public array $input,
    ) {}
}
