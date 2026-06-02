<?php

namespace App\Modules\Identity\Domain\Models;

use App\Modules\Tenancy\Domain\Concerns\BelongsToTenant;
use Illuminate\Database\Eloquent\Concerns\HasUlids;
use Illuminate\Database\Eloquent\Model;

/**
 * Per-tenant SSO / OAuth2 provider configuration.
 *
 * The global BelongsToTenant scope is active for authenticated admin routes.
 * The SSO redirect/callback controller bypasses it with withoutGlobalScopes()
 * because the user is not yet authenticated at that point.
 */
class SsoConfig extends Model
{
    use BelongsToTenant, HasUlids;

    /** Supported provider slugs. */
    public const PROVIDERS = ['google', 'microsoft', 'github'];

    protected $fillable = [
        'tenant_id',
        'provider',
        'client_id',
        'client_secret',
        'azure_tenant_id',
        'extra_scopes',
        'is_enabled',
    ];

    protected function casts(): array
    {
        return [
            'client_secret' => 'encrypted',   // encrypted at rest via APP_KEY
            'extra_scopes'  => 'array',
            'is_enabled'    => 'boolean',
        ];
    }

    // tenant() relationship provided by BelongsToTenant trait.

    /** Returns the Socialite driver name for this config. */
    public function socialiteDriver(): string
    {
        return match ($this->provider) {
            'microsoft' => 'azure',   // socialiteproviders/microsoft-azure driver slug
            default     => $this->provider,
        };
    }

    /** All OAuth2 scopes to request (provider defaults + any extras). */
    public function allScopes(): array
    {
        $defaults = match ($this->provider) {
            'google'    => ['openid', 'email', 'profile'],
            'microsoft' => ['openid', 'email', 'profile', 'User.Read'],
            'github'    => ['user:email'],
            default     => [],
        };

        return array_unique(array_merge($defaults, $this->extra_scopes ?? []));
    }
}
