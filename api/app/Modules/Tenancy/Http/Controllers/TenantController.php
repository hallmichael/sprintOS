<?php

namespace App\Modules\Tenancy\Http\Controllers;

use App\Modules\Tenancy\Domain\Models\Tenant;
use App\Modules\Tenancy\Http\Requests\CreateTenantRequest;
use App\Modules\Tenancy\Http\Resources\TenantResource;
use App\Shared\Http\Controller;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;
use Illuminate\Support\Str;

/**
 * Manages organisations (tenants) within a deployment.
 * Phase 1.5 — Multi-org management.
 */
final class TenantController extends Controller
{
    /** GET /api/tenants */
    public function index(): AnonymousResourceCollection
    {
        // Deployment-level admins can see all tenants; scoped users see only theirs.
        $tenants = Tenant::withoutGlobalScopes()->paginate();

        return TenantResource::collection($tenants);
    }

    /** POST /api/tenants */
    public function store(CreateTenantRequest $request): JsonResponse
    {
        $tenant = Tenant::create([
            'name' => $request->validated('name'),
            'slug' => $request->validated('slug', Str::slug($request->validated('name'))),
            'settings' => $request->validated('settings', []),
        ]);

        return response()->json(TenantResource::make($tenant), 201);
    }

    /** GET /api/tenants/{tenant} */
    public function show(Tenant $tenant): TenantResource
    {
        return TenantResource::make($tenant);
    }

    /** PATCH /api/tenants/{tenant} */
    public function update(CreateTenantRequest $request, Tenant $tenant): TenantResource
    {
        $tenant->update($request->validated());

        return TenantResource::make($tenant);
    }
}
