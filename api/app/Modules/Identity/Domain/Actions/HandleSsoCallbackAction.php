<?php

namespace App\Modules\Identity\Domain\Actions;

use App\Modules\Identity\Domain\Models\User;
use Illuminate\Support\Str;
use Laravel\Socialite\Contracts\User as OAuthUser;

/**
 * Finds an existing user by email within the given tenant, or auto-provisions one.
 * Returns a Sanctum plain-text token ready to hand back to the frontend.
 *
 * Takes a $tenantId string (not a Tenant model) so this action has no cross-module
 * domain dependency — the controller owns the Tenant lookup.
 *
 * Auto-provisioned users receive the 'member' role.
 * Existing users retain their current roles.
 */
final class HandleSsoCallbackAction
{
    public function execute(string $tenantId, string $provider, OAuthUser $oauthUser): string
    {
        $user = User::withoutGlobalScopes()
            ->where('tenant_id', $tenantId)
            ->where('email', $oauthUser->getEmail())
            ->first();

        if ($user === null) {
            $user = User::withoutGlobalScopes()->create([
                'tenant_id'         => $tenantId,
                'name'              => $oauthUser->getName() ?? $oauthUser->getNickname() ?? 'SSO User',
                'email'             => $oauthUser->getEmail(),
                'email_verified_at' => now(),          // IdP already verified the email
                'password'          => Str::password(32), // unusable random password
            ]);

            $user->assignRole('member');
        }

        // Revoke old SSO tokens for this provider before issuing a fresh one.
        $user->tokens()->where('name', "sso:{$provider}")->delete();

        return $user->createToken("sso:{$provider}")->plainTextToken;
    }
}
