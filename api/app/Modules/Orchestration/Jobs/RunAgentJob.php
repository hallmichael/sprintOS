<?php

namespace App\Modules\Orchestration\Jobs;

use App\Modules\Orchestration\Domain\Loop\ReasonActLoop;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;

/** Queued entrypoint for an agent run. Isolated per tenant. */
final class RunAgentJob implements ShouldQueue
{
    use Dispatchable, Queueable;

    public function __construct(public readonly string $runId) {}

    public function handle(ReasonActLoop $loop /*, repositories... */): void
    {
        // load run + context (tenant scope applied), then $loop->run($run, $ctx)
    }
}
