<?php

namespace App\Modules\Usage\Domain\Services;

use App\Modules\Usage\Domain\Contracts\MarkupResolver;
use App\Modules\Usage\Domain\Contracts\Meter;
use App\Modules\Usage\Domain\Data\MeterEvent;
use App\Modules\Usage\Domain\Models\UsageEvent;
use Illuminate\Support\Collection;

/**
 * The metering service — the single path every paid call flows through.
 * For each unit line it resolves the raw provider cost, applies the tenant's
 * markup, and appends an immutable usage_events row.
 */
final class MeteringService implements Meter
{
    public function __construct(
        private readonly RateResolver $rates,
        private readonly MarkupResolver $markup,
    ) {}

    public function record(MeterEvent $event): Collection
    {
        $markupRate = $this->markup->rateFor($event->tenantId, $event->service);

        return collect($event->lines)->map(function ($line) use ($event, $markupRate): UsageEvent {
            $unitCost = $this->rates->rawUnitCost(
                $event->service, $event->operation, $event->model, $line->unit,
            );

            $rawCost = $line->quantity * $unitCost;
            $billable = $rawCost * (1 + $markupRate);

            return UsageEvent::create([
                'tenant_id' => $event->tenantId,
                'actor_type' => $event->actorType,
                'actor_id' => $event->actorId,
                'service' => $event->service,
                'provider' => $event->provider,
                'operation' => $event->operation,
                'model' => $event->model,
                'unit' => $line->unit,
                'quantity' => $line->quantity,
                'raw_cost' => $rawCost,
                'markup_rate' => $markupRate,
                'billable_cost' => $billable,
                'currency' => $event->currency,
                'correlation_id' => $event->correlationId,
                'metadata' => $event->metadata,
            ]);
        });
    }
}
