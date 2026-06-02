<?php

namespace App\Modules\Tools\Domain\Services;

use App\Modules\Ai\Domain\Data\ToolDefinition;
use App\Modules\Tools\Domain\Contracts\ToolHandler;
use App\Modules\Tools\Domain\Models\Tool;
use RuntimeException;

/**
 * The tool registry: lists an org's enabled tools, produces the model-facing
 * tool definitions (for Bedrock tool-use), and resolves a tool key to its
 * handler instance.
 *
 * @param  array<string, class-string<ToolHandler>>  $handlers  handler-key → class
 */
final class ToolRegistry
{
    public function __construct(private readonly array $handlers) {}

    /**
     * Tool definitions to expose to the model for the active org.
     *
     * @return array<int, ToolDefinition>
     */
    public function definitionsFor(string $tenantId): array
    {
        return Tool::query()
            ->where('tenant_id', $tenantId)
            ->where('is_enabled', true)
            ->get()
            ->map(fn (Tool $t) => new ToolDefinition($t->key, $t->description, (array) $t->input_schema))
            ->all();
    }

    /** Resolve the handler for an enabled tool, or fail. */
    public function handlerFor(string $tenantId, string $toolKey): ToolHandler
    {
        $tool = Tool::query()
            ->where('tenant_id', $tenantId)
            ->where('key', $toolKey)
            ->where('is_enabled', true)
            ->first();

        if ($tool === null) {
            throw new RuntimeException("Tool '{$toolKey}' is not registered or not enabled for this org.");
        }

        $class = $this->handlers[$tool->handler] ?? null;
        if ($class === null) {
            throw new RuntimeException("No handler bound for '{$tool->handler}'.");
        }

        return app($class);
    }

    /** Whether a handler key is known to the registry. */
    public function hasHandler(string $handlerKey): bool
    {
        return isset($this->handlers[$handlerKey]);
    }
}
