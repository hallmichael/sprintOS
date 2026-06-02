<?php

namespace App\Modules\Orchestration\Services;

use App\Modules\Orchestration\Domain\Contracts\Orchestrator;
use App\Modules\Orchestration\Domain\Contracts\StartRun;
use App\Modules\Orchestration\Domain\Contracts\ResumeInput;
use App\Modules\Orchestration\Domain\Run\OrchestrationRun;
use App\Modules\Orchestration\Jobs\RunAgentJob;

final class OrchestrationService implements Orchestrator
{
    public function start(StartRun $command): OrchestrationRun
    {
        $run = OrchestrationRun::create($command);   // persist as pending
        RunAgentJob::dispatch($run->id);             // queue (SQS + Horizon)
        return $run;
    }

    public function resume(string $runId, ResumeInput $input): OrchestrationRun { /* ... */ }
    public function cancel(string $runId): void { /* ... */ }
}
