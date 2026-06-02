<?php

namespace App\Modules\Ai\Domain\Data;

/**
 * A tool exposed to the model via Bedrock's tool-use API.
 * inputSchema is a JSON Schema object describing the tool's arguments.
 */
final readonly class ToolDefinition
{
    public function __construct(
        public string $name,
        public string $description,
        public array $inputSchema,
    ) {}

    public function toBedrockSpec(): array
    {
        return [
            'toolSpec' => [
                'name' => $this->name,
                'description' => $this->description,
                'inputSchema' => ['json' => $this->inputSchema],
            ],
        ];
    }
}
