<?php

namespace App\Modules\Identity\Domain\Models;

use App\Modules\Tenancy\Domain\Models\Tenant;
use Illuminate\Database\Eloquent\Concerns\HasUlids;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

/**
 * A user's membership of one organisation, with their org-level role.
 *
 * NOT tenant-scoped (no BelongsToTenant): a membership must be queryable across
 * orgs for a given user (that's the whole point of the org switcher). All queries
 * scope tenant explicitly. Allow-listed in the architecture test. See ADR 0005.
 *
 * @property-read Tenant $tenant
 */
class Membership extends Model
{
    use HasUlids;

    protected $table = 'tenant_user';

    /** Valid org-level roles, most-privileged first. */
    public const ROLES = ['admin', 'member', 'viewer'];

    protected $fillable = [
        'tenant_id',
        'user_id',
        'role',
    ];

    public function tenant(): BelongsTo
    {
        return $this->belongsTo(Tenant::class, 'tenant_id');
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class, 'user_id');
    }
}
