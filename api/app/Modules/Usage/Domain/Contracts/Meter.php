<?php

namespace App\Modules\Usage\Domain\Contracts;

use App\Modules\Usage\Domain\Data\MeterEvent;
use App\Modules\Usage\Domain\Models\UsageEvent;
use Illuminate\Support\Collection;

/**
 * The single entry point through which EVERY paid third-party call is metered.
 * Implemented by MeteringService. Other modules depend on this contract only.
 *
 * Hard rule (CLAUDE.md #3): no feature calls a paid external service without
 * routing the cost through here.
 */
interface Meter
{
    /**
     * Record the metered lines for one paid call (e.g. a Claude chat records an
     * input_tokens line and an output_tokens line). Computes raw + billable cost
     * and appends to the usage_events ledger.
     *
     * @return Collection<int, UsageEvent>
     */
    public function record(MeterEvent $event): Collection;
}
