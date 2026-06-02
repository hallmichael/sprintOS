<?php

namespace App\Modules\Identity\Http\Controllers;

use App\Modules\Identity\Domain\Models\User;
use App\Modules\Identity\Http\Resources\UserResource;
use App\Shared\Http\Controller;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;

/**
 * NOTE: We deliberately avoid implicit route model binding for tenant-scoped models.
 * SubstituteBindings resolves model params before the 'tenant' middleware sets
 * TenantContext, so binding would bypass the global scope. Instead we query
 * explicitly inside controller methods where TenantContext is already active.
 */
final class UserController extends Controller
{
    /** GET /api/users — lists users in the active tenant (global scope applies). */
    public function index(): AnonymousResourceCollection
    {
        return UserResource::collection(User::paginate());
    }

    /** GET /api/users/{id} — returns 404 if {id} belongs to a different tenant. */
    public function show(string $id): UserResource
    {
        return UserResource::make(User::findOrFail($id));
    }

    /** PUT /api/users/{id}/roles — admin only; 404 if user is in a different tenant. */
    public function assignRole(Request $request, string $id): UserResource
    {
        abort_if(! $request->user()->hasRole('admin'), 403, 'Admin role required.');

        $request->validate([
            'role' => ['required', 'string', 'in:admin,member,viewer'],
        ]);

        $user = User::findOrFail($id);
        $user->syncRoles([$request->input('role')]);

        return UserResource::make($user->fresh());
    }

    /** DELETE /api/users/{id} — admin only; 404 if user is in a different tenant. */
    public function destroy(Request $request, string $id): JsonResponse
    {
        abort_if(! $request->user()->hasRole('admin'), 403, 'Admin role required.');

        User::findOrFail($id)->delete();

        return response()->json(null, 204);
    }
}
