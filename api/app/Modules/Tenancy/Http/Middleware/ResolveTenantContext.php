<?php

namespace App\Modules\Tenancy\Http\Middleware;

use App\Modules\Tenancy\Domain\Models\Tenant;
use App\Modules\Tenancy\Domain\Services\TenantContext;
use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

/**
 * Resolves the active tenant for the current request and populates TenantContext.
 *
 * Resolution order:
 * 1. Authenticated user's tenant_id (primary — covers most API calls).
 * 2. X-Tenant-ID header (useful for system-level tokens or CLI-driven requests).
 *
 * If no tenant can be resolved the request continues with an empty context;
 * endpoints that require a tenant should use the RequiresTenant middleware or
 * call TenantContext::require() directly.
 */
final class ResolveTenantContext
{
    public function __construct(private readonly TenantContext $context) {}

    public function handle(Request $request, Closure $next): Response
    {
        $tenantId = $request->user()?->tenant_id
            ?? $request->header('X-Tenant-ID');

        if ($tenantId) {
            $tenant = Tenant::withoutGlobalScopes()->find($tenantId);
            if ($tenant && $tenant->is_active) {
                $this->context->set($tenant);
            }
        }

        return $next($request);
    }
}
