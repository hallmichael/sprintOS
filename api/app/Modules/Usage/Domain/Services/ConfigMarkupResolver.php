<?php

namespace App\Modules\Usage\Domain\Services;

use App\Modules\Usage\Domain\Contracts\MarkupResolver;

/**
 * Default markup resolver: returns the deployment-wide default from config.
 * The Billing module rebinds MarkupResolver to a tenant-aware implementation.
 */
final class ConfigMarkupResolver implements MarkupResolver
{
    public function rateFor(string $tenantId, string $service): float
    {
        return (float) config('sprintos.billing.default_markup', 0.30);
    }
}
