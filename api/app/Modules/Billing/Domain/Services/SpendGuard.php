<?php

namespace App\Modules\Billing\Domain\Services;

use App\Modules\Billing\Domain\Exceptions\SpendCapExceeded;
use App\Modules\Usage\Domain\Services\UsageLedger;
use Carbon\CarbonImmutable;

/**
 * Enforces per-org spend caps (Build Guide 2.4 "caps/alerts"). The AI gateway
 * calls assertWithinCap() before each paid call so an org can't blow past its
 * configured cap; the dashboard reads alert state from here.
 */
final class SpendGuard
{
    public function __construct(
        private readonly BillingConfigService $config,
        private readonly UsageLedger $ledger,
    ) {}

    /** Throws if the org has already reached its spend cap for the current cycle. */
    public function assertWithinCap(string $tenantId): void
    {
        $cap = $this->config->forTenant($tenantId)->spend_cap;
        if ($cap === null) {
            return; // uncapped
        }

        if ($this->currentSpend($tenantId) >= (float) $cap) {
            throw new SpendCapExceeded($tenantId, (float) $cap);
        }
    }

    /** True once spend crosses the alert threshold (e.g. 80% of cap). */
    public function shouldAlert(string $tenantId): bool
    {
        $setting = $this->config->forTenant($tenantId);
        if ($setting->spend_cap === null || $setting->alert_threshold === null) {
            return false;
        }

        $trigger = (float) $setting->spend_cap * (float) $setting->alert_threshold;

        return $this->currentSpend($tenantId) >= $trigger;
    }

    /** Billable spend so far this billing cycle (calendar month). */
    public function currentSpend(string $tenantId): float
    {
        $start = CarbonImmutable::now()->startOfMonth();

        return $this->ledger->billableTotal($tenantId, $start);
    }
}
