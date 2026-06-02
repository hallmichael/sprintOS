<?php

namespace App\Modules\Orchestration\Domain\Contracts;

/**
 * Implemented by the Ai module: Anthropic Claude via Amazon Bedrock
 * (Sprint's AWS account, IAM — no customer keys). Supports tool-use.
 * Every call MUST emit a usage event via the Usage module.
 */
interface ModelClient
{
    public function respond(ModelRequest $request): ModelResponse;
}
