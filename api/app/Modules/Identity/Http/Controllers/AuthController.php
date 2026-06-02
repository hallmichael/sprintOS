<?php

namespace App\Modules\Identity\Http\Controllers;

use App\Modules\Identity\Domain\Actions\ProvisionMembershipAction;
use App\Modules\Identity\Domain\Models\User;
use App\Modules\Identity\Http\Requests\LoginRequest;
use App\Modules\Identity\Http\Requests\RegisterRequest;
use App\Modules\Identity\Http\Resources\MembershipResource;
use App\Modules\Identity\Http\Resources\UserResource;
use App\Shared\Http\Controller;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Validation\ValidationException;

final class AuthController extends Controller
{
    public function __construct(
        private readonly ProvisionMembershipAction $provisionMembership,
    ) {}

    /**
     * POST /api/auth/register
     * Creates the global identity and a membership in the given org.
     */
    public function register(RegisterRequest $request): JsonResponse
    {
        $user = User::create([
            'name'     => $request->validated('name'),
            'email'    => $request->validated('email'),
            'password' => $request->validated('password'),
        ]);

        // Membership role defaults to 'member'; callers may request another.
        $role = $request->validated('role', 'member');
        $this->provisionMembership->execute($user->id, $request->validated('tenant_id'), $role);

        $token = $user->createToken('api')->plainTextToken;

        return response()->json($this->authPayload($user, $token), 201);
    }

    /** POST /api/auth/login */
    public function login(LoginRequest $request): JsonResponse
    {
        if (! Auth::attempt($request->only('email', 'password'))) {
            throw ValidationException::withMessages([
                'email' => ['The provided credentials are incorrect.'],
            ]);
        }

        /** @var User $user */
        $user = Auth::user();
        $token = $user->createToken('api')->plainTextToken;

        return response()->json($this->authPayload($user, $token));
    }

    /** POST /api/auth/logout */
    public function logout(Request $request): JsonResponse
    {
        // TransientToken (actingAs in tests) has no delete(); guard against it.
        $token = $request->user()->currentAccessToken();
        if ($token instanceof \Laravel\Sanctum\PersonalAccessToken) {
            $token->delete();
        }

        return response()->json(['message' => 'Logged out.']);
    }

    /** GET /api/auth/me — returns the user plus their org memberships. */
    public function me(Request $request): JsonResponse
    {
        $user = $request->user();

        return response()->json([
            'user'        => UserResource::make($user),
            'memberships' => MembershipResource::collection($user->memberships()->with('tenant')->get()),
        ]);
    }

    /** Shared login/register response shape. */
    private function authPayload(User $user, string $token): array
    {
        return [
            'token'       => $token,
            'user'        => UserResource::make($user),
            'memberships' => MembershipResource::collection($user->memberships()->with('tenant')->get()),
        ];
    }
}
