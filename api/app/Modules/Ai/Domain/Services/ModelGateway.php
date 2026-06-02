<?php

namespace App\Modules\Ai\Domain\Services;

use App\Modules\Ai\Domain\Contracts\ModelClient;
use App\Modules\Ai\Domain\Data\ChatRequest;
use App\Modules\Ai\Domain\Data\ChatResponse;
use App\Modules\Billing\Domain\Services\SpendGuard;
use App\Modules\Usage\Domain\Contracts\Meter;
use App\Modules\Usage\Domain\Data\MeterEvent;
use App\Modules\Usage\Domain\Data\MeterLine;

/**
 * The single sanctioned path to Claude (CLAUDE.md #2). Every call:
 *   1. is checked against the org's spend cap (Billing),
 *   2. goes through the ModelClient driver (Bedrock/fake),
 *   3. is metered — input + output tokens written to the Usage ledger (#3).
 *
 * No feature talks to ModelClient directly; they depend on this gateway.
 */
final class ModelGateway
{
    public function __construct(
        private readonly ModelClient $client,
        private readonly Meter $meter,
        private readonly SpendGuard $guard,
    ) {}

    public function chat(ChatRequest $request): ChatResponse
    {
        // Block before spending if the org is at its cap.
        $this->guard->assertWithinCap($request->tenantId);

        $response = $this->client->chat($request);

        // Meter the call — raw + marked-up cost lands in the ledger.
        $this->meter->record(new MeterEvent(
            tenantId: $request->tenantId,
            service: 'bedrock',
            operation: 'chat',
            lines: [
                new MeterLine('input_tokens', $response->usage->inputTokens),
                new MeterLine('output_tokens', $response->usage->outputTokens),
            ],
            model: $response->model,
            provider: 'aws-bedrock',
            actorType: $request->actorType,
            actorId: $request->actorId,
            correlationId: $request->correlationId,
            metadata: ['stop_reason' => $response->stopReason],
        ));

        return $response;
    }
}
