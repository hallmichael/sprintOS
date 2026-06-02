<?php

namespace App\Modules\Orchestration\Domain\Contracts;

use App\Modules\Orchestration\Domain\Run\OrchestrationRun;

/** Public entrypoint other modules/controllers use to run agents. */
interface Orchestrator
{
    public function start(StartRun $command): OrchestrationRun;

    public function resume(string $runId, ResumeInput $input): OrchestrationRun;

    public function cancel(string $runId): void;
}
