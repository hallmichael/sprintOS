<?php

use App\Modules\Identity\Domain\Models\Membership;
use App\Modules\Identity\Domain\Models\User;
use Database\Seeders\RoleSeeder;
use Illuminate\Foundation\Testing\RefreshDatabase;

/*
|--------------------------------------------------------------------------
| Test Case
|--------------------------------------------------------------------------
*/

pest()->extend(Tests\TestCase::class)
    ->use(RefreshDatabase::class)
    ->beforeEach(function (): void {
        // Seed deployment-level roles (platform-admin) for every feature test.
        $this->seed(RoleSeeder::class);
    })
    ->in('Feature');

/*
|--------------------------------------------------------------------------
| Architecture Test Group
|--------------------------------------------------------------------------
*/

pest()->extend(Tests\TestCase::class)
    ->in('Architecture')
    ->group('architecture');

/*
|--------------------------------------------------------------------------
| Helpers (ADR 0005 identity model)
|--------------------------------------------------------------------------
*/

/** Create a global user with a membership in the given org. */
function makeUser(string $tenantId, string $role = 'member', array $attrs = []): User
{
    $user = User::factory()->create($attrs);

    Membership::create([
        'tenant_id' => $tenantId,
        'user_id'   => $user->id,
        'role'      => $role,
    ]);

    return $user;
}

/** Create a deployment-level platform-admin (optionally with org memberships). */
function makePlatformAdmin(array $attrs = []): User
{
    $user = User::factory()->create($attrs);
    $user->assignRole('platform-admin');

    return $user;
}

/*
|--------------------------------------------------------------------------
| Expectations
|--------------------------------------------------------------------------
*/

expect()->extend('toBeOne', fn () => $this->toBe(1));
