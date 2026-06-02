<?php

namespace App\Modules\Ai\Domain\Contracts;

use App\Modules\Ai\Domain\Data\ChatRequest;
use App\Modules\Ai\Domain\Data\ChatResponse;

/**
 * The low-level driver to a model provider. Implemented by BedrockModelClient
 * (Claude via Amazon Bedrock) and FakeModelClient (tests/local).
 *
 * The interface is provider-shaped so a second provider could be added later,
 * but v1 has exactly one real driver. Callers do NOT use this directly — they go
 * through ModelGateway, which adds metering, tiering and spend-cap enforcement.
 */
interface ModelClient
{
    public function chat(ChatRequest $request): ChatResponse;
}
