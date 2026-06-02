<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Spatie\Permission\Models\Role;

/**
 * Seeds the default role set for every sprintOS deployment.
 *
 * Roles (in order of privilege):
 *   platform-admin — deployment-level super-admin; spans ALL organisations.
 *                    Can create/list/manage every org and "act as" any tenant.
 *                    This is the only role that legitimately crosses org boundaries.
 *   admin          — organisation admin; full access within their own org.
 *   member         — standard user; access to their org's features.
 *   viewer         — read-only access within their org.
 */
class RoleSeeder extends Seeder
{
    public function run(): void
    {
        $guard = 'web';

        foreach (['platform-admin', 'admin', 'member', 'viewer'] as $role) {
            Role::firstOrCreate(['name' => $role, 'guard_name' => $guard]);
        }
    }
}
