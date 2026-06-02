<?php

namespace App\Modules\Identity\Http\Controllers;

use App\Modules\Identity\Domain\Models\User;
use App\Modules\Identity\Http\Requests\LoginRequest;
use App\Modules\Identity\Http\Requests\RegisterRequest;
use App\Modules\Identity\Http\Resources\UserResource;
use App\Shared\Http\Controller;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Validation\ValidationException;

final class AuthController extends Controller
{
    /** POST /api/auth/register */
    public function register(RegisterRequest $request): JsonResponse
    {
        $user = User::create([
            'tenant_id' => $request->validated('tenant_id'),
            'name'      => $request->validated('name'),
            'email'     => $request->validated('email'),
            'password'  => $request->validated('password'),
        ]);

        $user->assignRole('member');

        $token = $user->createToken('api')->plainTextToken;

        return response()->json([
            'token' => $token,
            'user'  => UserResource::make($user),
        ], 201);
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

        return response()->json([
            'token' => $token,
            'user'  => UserResource::make($user),
        ]);
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

    /** GET /api/auth/me */
    public function me(Request $request): UserResource
    {
        return UserResource::make($request->user());
    }
}
