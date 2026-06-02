<?php

namespace App\Modules\Tenancy\Http\Controllers;

use App\Modules\Tenancy\Domain\Services\OrgSettings;
use App\Modules\Tenancy\Domain\Services\TenantContext;
use App\Modules\Tenancy\Http\Requests\UpdateOrgSettingsRequest;
use App\Shared\Http\Controller;
use Illuminate\Http\JsonResponse;

/**
 * Per-org settings for the setup wizard: branding, feature flags, AI tier
 * preference and completion flag (Build Guide 2.6).
 */
final class OrgSettingsController extends Controller
{
    public function __construct(
        private readonly TenantContext $context,
        private readonly OrgSettings $settings,
    ) {}

    /** GET /api/org/settings */
    public function show(): JsonResponse
    {
        $tenant = $this->context->require();

        return response()->json([
            'id' => $tenant->id,
            'name' => $tenant->name,
            'slug' => $tenant->slug,
            'settings' => $this->settings->view($tenant),
        ]);
    }

    /** PATCH /api/org/settings — admin only. */
    public function update(UpdateOrgSettingsRequest $request): JsonResponse
    {
        $tenant = $this->context->require();

        if ($request->filled('name')) {
            $tenant->update(['name' => $request->validated('name')]);
        }

        $settings = $this->settings->update($tenant, $request->safe()->except('name'));

        return response()->json([
            'id' => $tenant->id,
            'name' => $tenant->fresh()->name,
            'settings' => $settings,
        ]);
    }
}
