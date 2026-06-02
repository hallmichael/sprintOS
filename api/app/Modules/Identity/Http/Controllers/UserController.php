<?php

namespace App\Modules\Identity\Http\Controllers;

use App\Modules\Identity\Domain\Models\Membership;
use App\Modules\Identity\Domain\Models\User;
use App\Modules\Identity\Http\Resources\UserResource;
use App\Modules\Tenancy\Domain\Services\TenantContext;
use App\Shared\Http\Controller;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;

/**
 * Manages users WITHIN the active organisation (ADR 0005).
 *
 * "Users of an org" = users with a membership in the active tenant. Listing,
 * role changes and removal all operate on the membership, not the global user —
 * removing a user from one org never touches their membership of another.
 *
 * Admin-gating is enforced at the route layer via `tenant.role:admin`.
 */
final class UserController extends Controller
{
    public function __construct(private readonly TenantContext $context) {}

    /** GET /api/users — members of the active org. */
    public function index(): AnonymousResourceCollection
    {
        $tenantId = $this->context->require()->id;

        $users = User::whereHas('memberships', fn ($q) => $q->where('tenant_id', $tenantId))
            ->paginate();

        return UserResource::collection($users);
    }

    /** GET /api/users/{id} — only if the user is a member of the active org. */
    public function show(string $id): UserResource
    {
        return UserResource::make($this->memberOrFail($id));
    }

    /** PUT /api/users/{id}/roles — change a member's org-level role. */
    public function assignRole(Request $request, string $id): UserResource
    {
        $request->validate([
            'role' => ['required', 'string', 'in:'.implode(',', Membership::ROLES)],
        ]);

        $user = $this->memberOrFail($id);

        Membership::where('tenant_id', $this->context->id())
            ->where('user_id', $user->id)
            ->update(['role' => $request->input('role')]);

        return UserResource::make($user->fresh());
    }

    /** DELETE /api/users/{id} — remove the user from the active org (not globally). */
    public function destroy(string $id): JsonResponse
    {
        $user = $this->memberOrFail($id);

        Membership::where('tenant_id', $this->context->id())
            ->where('user_id', $user->id)
            ->delete();

        return response()->json(null, 204);
    }

    /**
     * Loads a user that is a member of the active org, or 404s.
     * Returns 404 (not 403) for non-members so existence isn't leaked.
     */
    private function memberOrFail(string $id): User
    {
        $tenantId = $this->context->require()->id;

        return User::whereKey($id)
            ->whereHas('memberships', fn ($q) => $q->where('tenant_id', $tenantId))
            ->firstOrFail();
    }
}
