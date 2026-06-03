<?php

namespace Database\Seeders;

use App\Modules\Identity\Domain\Models\Membership;
use App\Modules\Identity\Domain\Models\User;
use App\Modules\Tenancy\Domain\Models\Tenant;
use Illuminate\Database\Seeder;

/**
 * Local demo data: one org + an admin you can log in as from the preview.
 *   email: admin@acme.com   password: Password1!
 * Run with: php artisan db:seed --class=DemoSeeder
 */
class DemoSeeder extends Seeder
{
    public function run(): void
    {
        $tenant = Tenant::firstOrCreate(['slug' => 'acme'], ['name' => 'Acme Plumbing']);

        $admin = User::firstOrCreate(
            ['email' => 'admin@acme.com'],
            ['name' => 'Demo Admin', 'password' => 'Password1!', 'email_verified_at' => now()],
        );
        Membership::firstOrCreate(
            ['tenant_id' => $tenant->id, 'user_id' => $admin->id],
            ['role' => 'admin'],
        );

        $member = User::firstOrCreate(
            ['email' => 'member@acme.com'],
            ['name' => 'Priya Nair', 'password' => 'Password1!', 'email_verified_at' => now()],
        );
        Membership::firstOrCreate(
            ['tenant_id' => $tenant->id, 'user_id' => $member->id],
            ['role' => 'member'],
        );
    }
}
