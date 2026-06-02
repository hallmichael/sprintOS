<?php

namespace App\Modules\Orchestration\Domain\Run;

/** Persisted state machine for one agent run. Steps form the audit trace. */
class OrchestrationRun
{
    public function __construct(
        public readonly string $id,
        public readonly string $tenantId,
        public readonly string $agentId,
        public RunStatus $status = RunStatus::Pending,
        /** @var RunStep[] */
        public array $steps = [],
        public int $tokenCost = 0,
    ) {}
}

enum RunStatus: string
{
    case Pending = 'pending';
    case Running = 'running';
    case AwaitingApproval = 'awaiting_approval';
    case Completed = 'completed';
    case Failed = 'failed';
    case Cancelled = 'cancelled';
}
