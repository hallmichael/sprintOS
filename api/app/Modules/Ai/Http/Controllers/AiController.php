<?php

namespace App\Modules\Ai\Http\Controllers;

use App\Modules\Ai\Domain\Data\ChatRequest;
use App\Modules\Ai\Domain\Data\ModelTier;
use App\Modules\Ai\Domain\Services\ModelGateway;
use App\Modules\Ai\Http\Requests\CompleteRequest;
use App\Modules\Tenancy\Domain\Services\TenantContext;
use App\Shared\Http\Controller;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Str;

/**
 * Minimal AI completion endpoint (Build Guide 2.1 "a prompt returns a Claude
 * completion"). Every call is metered + cap-checked by the gateway.
 */
final class AiController extends Controller
{
    public function __construct(
        private readonly TenantContext $context,
        private readonly ModelGateway $gateway,
    ) {}

    /** GET /api/ai/tiers — available model tiers (setup wizard, read-only). */
    public function tiers(): JsonResponse
    {
        return response()->json([
            'default' => config('sprintos.ai.default_tier'),
            'tiers' => collect((array) config('sprintos.ai.tiers'))
                ->map(fn ($model, $tier) => ['tier' => $tier, 'model' => $model])
                ->values(),
        ]);
    }

    /** POST /api/ai/complete */
    public function complete(CompleteRequest $request): JsonResponse
    {
        $response = $this->gateway->chat(new ChatRequest(
            tenantId: $this->context->require()->id,
            messages: [['role' => 'user', 'content' => $request->validated('prompt')]],
            tier: ModelTier::from($request->validated('tier', ModelTier::default()->value)),
            system: $request->validated('system'),
            maxTokens: (int) $request->validated('max_tokens', config('sprintos.ai.max_tokens')),
            actorType: 'user',
            actorId: $request->user()->id,
            correlationId: (string) Str::ulid(),
        ));

        return response()->json([
            'text' => $response->text,
            'model' => $response->model,
            'usage' => [
                'input_tokens' => $response->usage->inputTokens,
                'output_tokens' => $response->usage->outputTokens,
            ],
            'stop_reason' => $response->stopReason,
        ]);
    }
}
