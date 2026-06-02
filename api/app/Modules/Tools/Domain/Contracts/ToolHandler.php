<?php

namespace App\Modules\Tools\Domain\Contracts;

/**
 * A concrete tool implementation. Handlers are registered by key and bound to a
 * Tool row. Paid handlers must meter their cost via the Usage Meter.
 */
interface ToolHandler
{
    /**
     * @param  array<string, mixed>  $input  validated tool arguments
     * @param  array{tenant_id: string, correlation_id?: string|null}  $context
     * @return array<string, mixed> result content
     */
    public function handle(array $input, array $context): array;
}
