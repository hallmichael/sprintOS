<?php

namespace App\Modules\Tools\Domain\Services;

use App\Modules\Ai\Domain\Data\ToolUse;
use App\Modules\Tools\Domain\Data\ToolResult;
use Throwable;

/**
 * Permission-checked dispatch of a model's tool_use to its handler.
 * Errors are returned as error ToolResults (fed back to the model) rather than
 * thrown, so an agent run can recover.
 */
final class ToolDispatcher
{
    public function __construct(private readonly ToolRegistry $registry) {}

    /**
     * @param  array<string, mixed>  $context  extra context passed to the handler
     *                                          (e.g. roles for role-filtered tools like rag_search)
     */
    public function dispatch(string $tenantId, ToolUse $call, ?string $correlationId = null, array $context = []): ToolResult
    {
        try {
            $handler = $this->registry->handlerFor($tenantId, $call->name);

            $content = $handler->handle($call->input, array_merge([
                'tenant_id'      => $tenantId,
                'correlation_id' => $correlationId,
                'roles'          => ['member'],   // default; overridden by Orchestration/HTTP callers
            ], $context));

            return new ToolResult($call->id, $content);
        } catch (Throwable $e) {
            return new ToolResult($call->id, ['error' => $e->getMessage()], isError: true);
        }
    }
}
