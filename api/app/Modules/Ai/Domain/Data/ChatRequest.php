<?php

namespace App\Modules\Ai\Domain\Data;

/**
 * A chat/completion request to the AI gateway.
 *
 * @property array<int, array{role: string, content: mixed}> $messages
 * @property array<int, ToolDefinition> $tools
 */
final readonly class ChatRequest
{
    public function __construct(
        public string $tenantId,
        public array $messages,
        public ModelTier $tier = ModelTier::Balanced,
        public ?string $model = null,        // explicit model id overrides tier
        public ?string $system = null,
        public array $tools = [],
        public int $maxTokens = 1024,
        public string $actorType = 'user',
        public ?string $actorId = null,
        public ?string $correlationId = null,
    ) {}

    /** The resolved Bedrock model id (explicit model wins over tier). */
    public function modelId(): string
    {
        return $this->model ?? $this->tier->modelId();
    }

    public function withModel(string $model): self
    {
        return new self(
            $this->tenantId, $this->messages, $this->tier, $model, $this->system,
            $this->tools, $this->maxTokens, $this->actorType, $this->actorId, $this->correlationId,
        );
    }
}
