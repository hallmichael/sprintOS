<?php

namespace App\Modules\Tenancy\Domain\Services;

use App\Modules\Tenancy\Domain\Models\Tenant;
use RuntimeException;

/**
 * Request-scoped singleton holding the active tenant for the current request.
 * Resolved once by ResolveTenantContext middleware and then available via:
 *   app('tenant.context') or app(TenantContext::class)
 */
final class TenantContext
{
    private ?Tenant $tenant = null;

    public function set(Tenant $tenant): void
    {
        $this->tenant = $tenant;
    }

    /** Returns the active tenant, or null outside a tenant-scoped request. */
    public function get(): ?Tenant
    {
        return $this->tenant;
    }

    /** Returns the active tenant's ID, or null if no tenant is resolved. */
    public function id(): ?string
    {
        return $this->tenant?->id;
    }

    /**
     * Returns the active tenant or throws — use in contexts where a tenant
     * is always expected (e.g. any authenticated API endpoint).
     */
    public function require(): Tenant
    {
        return $this->tenant ?? throw new RuntimeException('No tenant context resolved for this request.');
    }

    /** True when a tenant has been resolved for this request. */
    public function resolved(): bool
    {
        return $this->tenant !== null;
    }

    /**
     * Run a callback in a temporary tenant context (useful in tests and jobs).
     */
    public function forTenant(Tenant $tenant, callable $callback): mixed
    {
        $previous = $this->tenant;
        $this->tenant = $tenant;

        try {
            return $callback();
        } finally {
            $this->tenant = $previous;
        }
    }
}
