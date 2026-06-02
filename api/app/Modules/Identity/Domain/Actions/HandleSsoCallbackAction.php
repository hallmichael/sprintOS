<?php

namespace App\Modules\Identity\Domain\Actions;

use App\Modules\Identity\Domain\Models\User;
use Illuminate\Support\Str;
use Laravel\Socialite\Contracts\User as OAuthUser;

/**
 * Resolves an SSO login to a Sanctum token (ADR 0005).
 *
 * Find-or-create the GLOBAL user by email, then ensure they have a membership
 * in the org that initiated the SSO flow. The same email signing in to two orgs
 * is one identity with two memberships.
 *
 * Newly created users are email-verified (the IdP vouched for the address).
 * New memberships default to the 'member' role; existing ones are untouched.
 */
final class HandleSsoCallbackAction
{
    public function __construct(
        private readonly ProvisionMembershipAction $provisionMembership,
    ) {}

    public function execute(string $tenantId, string $provider, OAuthUser $oauthUser): string
    {
        $user = User::where('email', $oauthUser->getEmail())->first();

        if ($user === null) {
            $user = User::create([
                'name'              => $oauthUser->getName() ?? $oauthUser->getNickname() ?? 'SSO User',
                'email'             => $oauthUser->getEmail(),
                'email_verified_at' => now(),
                'password'          => Str::password(32), // unusable random password
            ]);
        }

        // Ensure org membership (idempotent — preserves an existing role).
        $this->provisionMembership->execute($user->id, $tenantId);

        // Rotate this provider's SSO tokens before issuing a fresh one.
        $user->tokens()->where('name', "sso:{$provider}")->delete();

        return $user->createToken("sso:{$provider}")->plainTextToken;
    }
}
