<?php

namespace App\Modules\Billing\Domain\Services;

use App\Modules\Billing\Domain\Models\BillingSetting;
use App\Modules\Usage\Domain\Contracts\MarkupResolver;

/**
 * Tenant-aware markup resolver — reads the per-org markup_rate from billing
 * settings, falling back to the deployment default. Rebinds the Usage module's
 * MarkupResolver port (see UsageServiceProvider / BillingServiceProvider).
 */
final class TenantMarkupResolver implements MarkupResolver
{
    public function rateFor(string $tenantId, string $service): float
    {
        $rate = BillingSetting::withoutGlobalScopes()
            ->where('tenant_id', $tenantId)
            ->value('markup_rate');

        return $rate !== null
            ? (float) $rate
            : (float) config('sprintos.billing.default_markup', 0.30);
    }
}
