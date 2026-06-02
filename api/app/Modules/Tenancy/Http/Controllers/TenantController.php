<?php

namespace App\Modules\Tenancy\Http\Controllers;

use App\Modules\Tenancy\Domain\Models\Tenant;
use App\Modules\Tenancy\Http\Requests\UpsertTenantRequest;
use App\Modules\Tenancy\Http\Resources\TenantResource;
use App\Shared\Http\Controller;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;
use Illuminate\Support\Str;

/**
 * Manages organisations (tenants) within a deployment — Phase 1.5.
 *
 * Authorisation model:
 *   - platform-admin: may list, create and manage EVERY organisation.
 *   - any other user: may only ever see/manage their OWN organisation.
 *
 * Tenant is not a tenant-scoped model (it has no BelongsToTenant global scope),
 * so every method authorises access explicitly. We use string {id} params rather
 * than implicit model binding so a cross-org id returns 404 (not the record).
 */
final class TenantController extends Controller
{
    /** GET /api/tenants */
    public function index(Request $request): AnonymousResourceCollection
    {
        $user = $request->user();

        $query = Tenant::query()->withoutGlobalScopes();

        // Regular users see only the orgs they are a member of.
        if (! $user->isPlatformAdmin()) {
            $query->whereIn('id', $user->memberships()->pluck('tenant_id'));
        }

        return TenantResource::collection($query->paginate());
    }

    /** POST /api/tenants — platform-admin only. */
    public function store(UpsertTenantRequest $request): JsonResponse
    {
        abort_unless(
            $request->user()->isPlatformAdmin(),
            403,
            'Only a platform admin can create organisations.',
        );

        $tenant = Tenant::create([
            'name'     => $request->validated('name'),
            'slug'     => $request->validated('slug') ?? Str::slug($request->validated('name')),
            'settings' => $request->validated('settings', []),
        ]);

        return response()->json(TenantResource::make($tenant), 201);
    }

    /** GET /api/tenants/{id} */
    public function show(Request $request, string $id): TenantResource
    {
        return TenantResource::make($this->resolveAccessible($request, $id));
    }

    /** PATCH /api/tenants/{id} */
    public function update(UpsertTenantRequest $request, string $id): TenantResource
    {
        $tenant = $this->resolveAccessible($request, $id);
        $tenant->update($request->validated());

        return TenantResource::make($tenant);
    }

    /**
     * Loads a tenant the caller is allowed to access, or 404s.
     * A regular user may only touch an org they are a member of; a platform-admin
     * may touch any. We return 404 (not 403) for foreign orgs so existence isn't leaked.
     */
    private function resolveAccessible(Request $request, string $id): Tenant
    {
        $tenant = Tenant::withoutGlobalScopes()->findOrFail($id);
        $user = $request->user();

        abort_unless(
            $user->isPlatformAdmin() || $user->memberOf($tenant->id),
            404,
        );

        return $tenant;
    }
}
