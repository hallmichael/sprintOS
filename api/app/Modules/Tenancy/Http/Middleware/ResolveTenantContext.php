<?php

namespace App\Modules\Tenancy\Http\Middleware;

use App\Modules\Tenancy\Domain\Models\Tenant;
use App\Modules\Tenancy\Domain\Services\TenantContext;
use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

/**
 * Resolves the active organisation for the request and populates TenantContext.
 * See ADR 0005 for the identity/membership model.
 *
 * Active-org rules (security-sensitive):
 *   - Anonymous request → no context. X-Tenant-ID is never trusted from anon callers.
 *   - Platform-admin → may "act as" ANY org via X-Tenant-ID (support/management);
 *     otherwise no context (they have no home org).
 *   - Regular user → X-Tenant-ID is honoured ONLY if they are a member of that org;
 *     otherwise it is ignored and their default membership's org is used. A user can
 *     never select an org they don't belong to.
 *
 * The resolved org drives the BelongsToTenant global scope for all owned resources.
 */
final class ResolveTenantContext
{
    public function __construct(private readonly TenantContext $context) {}

    public function handle(Request $request, Closure $next): Response
    {
        $user = $request->user();
        $header = $request->header('X-Tenant-ID');

        $tenantId = match (true) {
            $user === null           => null,
            $user->isPlatformAdmin() => $header ?: null,
            default                  => $this->resolveForMember($user, $header),
        };

        if ($tenantId) {
            $tenant = Tenant::withoutGlobalScopes()->find($tenantId);
            if ($tenant && $tenant->is_active) {
                $this->context->set($tenant);
            }
        }

        return $next($request);
    }

    /**
     * A member may only activate an org they belong to. An unrecognised or
     * non-member header falls back to their default membership.
     */
    private function resolveForMember($user, ?string $header): ?string
    {
        if ($header !== null && $user->memberOf($header)) {
            return $header;
        }

        return $user->defaultMembership()?->tenant_id;
    }
}
