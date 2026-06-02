<?php

namespace App\Modules\Usage\Http\Controllers;

use App\Modules\Tenancy\Domain\Services\TenantContext;
use App\Modules\Usage\Domain\Models\UsageEvent;
use App\Modules\Usage\Domain\Services\UsageLedger;
use App\Modules\Usage\Http\Resources\UsageEventResource;
use App\Shared\Http\Controller;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;

/**
 * Read-only usage reporting for the active org (the billing dashboard's data).
 * The BelongsToTenant scope keeps every query within the active org.
 */
final class UsageController extends Controller
{
    public function __construct(
        private readonly TenantContext $context,
        private readonly UsageLedger $ledger,
    ) {}

    /** GET /api/usage/events — recent metered events. */
    public function index(): AnonymousResourceCollection
    {
        return UsageEventResource::collection(
            UsageEvent::query()->latest('created_at')->paginate(),
        );
    }

    /** GET /api/usage/summary — per-service rollup for the active org. */
    public function summary(): JsonResponse
    {
        $tenantId = $this->context->require()->id;

        return response()->json([
            'currency' => config('sprintos.billing.currency'),
            'billable' => $this->ledger->billableTotal($tenantId),
            'unbilled' => $this->ledger->billableTotal($tenantId, unbilledOnly: true),
            'by_service' => $this->ledger->rollupByService($tenantId),
        ]);
    }
}
