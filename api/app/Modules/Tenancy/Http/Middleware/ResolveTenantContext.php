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
 * Resolution rules (security-sensitive — read carefully):
 *   - Authenticated regular user → ALWAYS pinned to their own tenant_id.
 *     The X-Tenant-ID header is ignored; a user cannot escape their org.
 *   - Authenticated platform-admin → may "act as" any org via X-Tenant-ID
 *     (for support/management); falls back to their own tenant_id otherwise.
 *   - Unauthenticated request → no tenant context. The X-Tenant-ID header is
 *     NOT trusted from anonymous callers (would otherwise allow scope spoofing).
 *
 * If no tenant resolves, the request continues with an empty context; endpoints
 * that require one should call TenantContext::require().
 */
final class ResolveTenantContext
{
    public function __construct(private readonly TenantContext $context) {}

    public function handle(Request $request, Closure $next): Response
    {
        $user = $request->user();

        $tenantId = match (true) {
            $user === null              => null,                  // anonymous: never trust the header
            $user->isPlatformAdmin()    => $request->header('X-Tenant-ID') ?: $user->tenant_id,
            default                     => $user->tenant_id,      // regular user: pinned to own org
        };

        if ($tenantId) {
            $tenant = Tenant::withoutGlobalScopes()->find($tenantId);
            if ($tenant && $tenant->is_active) {
                $this->context->set($tenant);
            }
        }

        return $next($request);
    }
}
