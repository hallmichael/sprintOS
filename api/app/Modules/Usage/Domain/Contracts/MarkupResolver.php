<?php

namespace App\Modules\Usage\Domain\Contracts;

/**
 * Resolves the billing markup rate to apply to a tenant's raw third-party cost.
 *
 * This is a PORT owned by Usage: metering needs a markup rate at write time.
 * Usage ships a default (config-based) adapter; the Billing module rebinds it to
 * a tenant-aware implementation. This inversion keeps Usage free of any Billing
 * dependency (Usage defines the need; Billing satisfies it).
 */
interface MarkupResolver
{
    /** Markup as a fraction (0.30 = 30%) for the given tenant + service. */
    public function rateFor(string $tenantId, string $service): float;
}
