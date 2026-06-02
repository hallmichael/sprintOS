<?php

namespace App\Modules\Identity\Domain\Models;

use App\Modules\Tenancy\Domain\Models\Tenant;
use Illuminate\Database\Eloquent\Concerns\HasUlids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;
use Spatie\Permission\Traits\HasRoles;

/**
 * A global identity within the deployment (ADR 0005).
 *
 * A user is NOT tenant-owned — they belong to one or more orgs via the
 * `tenant_user` membership pivot, each with an org-level role. Deployment-level
 * roles (platform-admin) are held via spatie; org-level roles live on the membership.
 */
class User extends Authenticatable
{
    use HasApiTokens, HasFactory, HasRoles, HasUlids, Notifiable;

    protected $fillable = [
        'name',
        'email',
        'email_verified_at',
        'password',
    ];

    protected $hidden = [
        'password',
        'remember_token',
    ];

    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'password' => 'hashed',
        ];
    }

    // ── Org membership ────────────────────────────────────────────────────

    /** Memberships (one row per org this user belongs to). */
    public function memberships(): HasMany
    {
        return $this->hasMany(Membership::class, 'user_id');
    }

    /** Orgs this user belongs to. */
    public function tenants(): BelongsToMany
    {
        return $this->belongsToMany(Tenant::class, 'tenant_user', 'user_id', 'tenant_id')
            ->withPivot('role')
            ->withTimestamps();
    }

    /** True if the user belongs to the given org. */
    public function memberOf(string $tenantId): bool
    {
        return $this->memberships()->where('tenant_id', $tenantId)->exists();
    }

    /** The user's org-level role in the given org, or null if not a member. */
    public function roleIn(string $tenantId): ?string
    {
        return $this->memberships()->where('tenant_id', $tenantId)->value('role');
    }

    /** The user's default (first) membership — used when no org is selected. */
    public function defaultMembership(): ?Membership
    {
        /** @var Membership|null */
        return $this->memberships()->oldest()->first();
    }

    // ── Deployment-level role ─────────────────────────────────────────────

    /**
     * A deployment-level super-admin who can manage every org and "act as" any
     * tenant. The only role that crosses org boundaries (held via spatie).
     */
    public function isPlatformAdmin(): bool
    {
        return $this->hasRole('platform-admin');
    }
}
