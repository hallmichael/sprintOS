<?php

namespace App\Modules\Identity\Http\Controllers;

use App\Modules\Identity\Domain\Models\SsoConfig;
use App\Modules\Identity\Http\Requests\UpsertSsoConfigRequest;
use App\Modules\Identity\Http\Resources\SsoConfigResource;
use App\Shared\Http\Controller;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;

/**
 * Admin CRUD for per-tenant SSO provider configurations.
 * All routes are scoped to the authenticated user's tenant.
 */
final class SsoConfigController extends Controller
{
    /** GET /api/sso-configs */
    public function index(): AnonymousResourceCollection
    {
        return SsoConfigResource::collection(SsoConfig::all());
    }

    /** POST /api/sso-configs */
    public function store(UpsertSsoConfigRequest $request): JsonResponse
    {
        $config = SsoConfig::updateOrCreate(
            ['provider' => $request->validated('provider')],
            $request->validated(),
        );

        return response()->json(SsoConfigResource::make($config), 201);
    }

    /** GET /api/sso-configs/{id} */
    public function show(string $id): SsoConfigResource
    {
        return SsoConfigResource::make(SsoConfig::findOrFail($id));
    }

    /** PATCH /api/sso-configs/{id} */
    public function update(UpsertSsoConfigRequest $request, string $id): SsoConfigResource
    {
        $config = SsoConfig::findOrFail($id);
        $config->update($request->validated());

        return SsoConfigResource::make($config);
    }

    /** DELETE /api/sso-configs/{id} */
    public function destroy(string $id): JsonResponse
    {
        SsoConfig::findOrFail($id)->delete();

        return response()->json(null, 204);
    }
}
