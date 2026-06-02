<?php

namespace App\Modules\Orchestration\Domain\Contracts;

use App\Modules\Orchestration\Domain\Run\RunContext;

/**
 * Implemented by the Tools module. Permission-checked dispatch of a single
 * tool call (CRUD, external DB/API, RAG, sub-agent, utility) within a run.
 */
interface ToolInvoker
{
    public function invoke(ToolCall $call, RunContext $context): ToolResult;
}
