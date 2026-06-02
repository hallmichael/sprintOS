<?php

namespace App\Modules\Tenancy\Http\Middleware;

use App\Modules\Tenancy\Domain\Services\TenantContext;
use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

/**
 * Gates a route on the caller's ORG-LEVEL role within the active organisation.
 * Usage: ->middleware('tenant.role:admin')
 *
 * A platform-admin always passes (they manage every org). Otherwise the user's
 * membership role in the active tenant must match one of the required roles.
 *
 * Must run AFTER ResolveTenantContext (the 'tenant' middleware) so the active
 * org is known.
 */
final class EnsureTenantRole
{
    public function __construct(private readonly TenantContext $context) {}

    public function handle(Request $request, Closure $next, string ...$roles): Response
    {
        $user = $request->user();
        abort_if($user === null, 401);

        // Platform-admins bypass org-level role checks.
        if ($user->isPlatformAdmin()) {
            return $next($request);
        }

        $tenantId = $this->context->id();
        abort_if($tenantId === null, 403, 'No active organisation.');

        $role = $user->roleIn($tenantId);
        abort_unless(in_array($role, $roles, true), 403, 'Insufficient organisation role.');

        return $next($request);
    }
}
