<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Spatie\Permission\Models\Role;

/**
 * Seeds deployment-level (global) roles. See ADR 0005.
 *
 * Only `platform-admin` lives in spatie now — the cross-org super-admin.
 * Org-level roles (admin / member / viewer) are NOT spatie roles; they are
 * stored per-membership on tenant_user.role (see Membership::ROLES).
 */
class RoleSeeder extends Seeder
{
    public function run(): void
    {
        Role::firstOrCreate(['name' => 'platform-admin', 'guard_name' => 'web']);
    }
}
