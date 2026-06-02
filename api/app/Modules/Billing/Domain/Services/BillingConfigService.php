<?php

namespace App\Modules\Billing\Domain\Services;

use App\Modules\Billing\Domain\Models\BillingSetting;

/**
 * Read/write per-org billing configuration. The public surface other modules
 * use to obtain or mutate billing settings.
 */
final class BillingConfigService
{
    /** Get the org's billing settings, creating defaults on first access. */
    public function forTenant(string $tenantId): BillingSetting
    {
        return BillingSetting::withoutGlobalScopes()->firstOrCreate(
            ['tenant_id' => $tenantId],
            [
                'markup_rate' => config('sprintos.billing.default_markup', 0.30),
                'currency' => config('sprintos.billing.currency', 'AUD'),
                'billing_cycle' => config('sprintos.billing.cycle', 'monthly'),
            ],
        );
    }

    /** @param array<string, mixed> $attributes */
    public function update(string $tenantId, array $attributes): BillingSetting
    {
        $setting = $this->forTenant($tenantId);
        $setting->update($attributes);

        return $setting;
    }
}
