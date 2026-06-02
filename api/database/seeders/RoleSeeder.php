<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Spatie\Permission\Models\Role;

/**
 * Seeds the default role set for every sprintOS deployment.
 *
 * Roles (in order of privilege):
 *   admin   — deployment/org admin; full access within their org.
 *   member  — standard user; access to their org's features.
 *   viewer  — read-only access.
 */
class RoleSeeder extends Seeder
{
    public function run(): void
    {
        $guard = 'web';

        foreach (['admin', 'member', 'viewer'] as $role) {
            Role::firstOrCreate(['name' => $role, 'guard_name' => $guard]);
        }
    }
}
