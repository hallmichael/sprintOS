<?php

namespace App\Modules\Orchestration\Domain\Loop;

use App\Modules\Orchestration\Domain\Contracts\ModelClient;
use App\Modules\Orchestration\Domain\Contracts\ToolInvoker;
use App\Modules\Orchestration\Domain\Run\OrchestrationRun;
use App\Modules\Orchestration\Domain\Run\RunContext;
use App\Modules\Orchestration\Domain\Run\RunStatus;

/**
 * The core agentic loop: plan -> act -> observe -> re-plan, bounded by guards.
 * Provider/tool/storage agnostic — depends only on the three contracts.
 */
final class ReasonActLoop
{
    public function __construct(
        private readonly ModelClient $model,
        private readonly ToolInvoker $tools,
        private readonly GuardChain $guards, // budget, step limit, approval, allow-list
    ) {}

    public function run(OrchestrationRun $run, RunContext $ctx): OrchestrationRun
    {
        $run->status = RunStatus::Running;

        while ($this->guards->mayContinue($run)) {
            $response = $this->model->respond($ctx->buildRequest($run)); // 1 usage event
            $run->steps[] = $ctx->recordReasoning($response);

            if (! $response->hasToolCalls()) {
                $run->status = RunStatus::Completed;
                break;
            }

            foreach ($response->toolCalls() as $call) {
                $decision = $this->guards->screen($call, $run, $ctx);
                if ($decision->requiresApproval()) {
                    $run->status = RunStatus::AwaitingApproval;
                    return $run; // resumable via ResumeRunJob
                }
                if ($decision->denied()) {
                    continue;
                }
                $result = $this->tools->invoke($call, $ctx); // may emit more usage events
                $run->steps[] = $ctx->recordToolResult($call, $result);
            }
        }

        return $ctx->finalise($run); // roll totals into Usage
    }
}
