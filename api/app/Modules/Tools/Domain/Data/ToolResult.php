<?php

namespace App\Modules\Tools\Domain\Data;

/** The outcome of invoking a tool, fed back to the model as a tool_result. */
final readonly class ToolResult
{
    public function __construct(
        public string $toolUseId,
        public array $content,
        public bool $isError = false,
    ) {}
}
