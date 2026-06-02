<?php

/**
 * Phase 1.3 — Authentication tests (ADR 0005 identity model).
 */

use App\Modules\Identity\Domain\Models\User;
use App\Modules\Tenancy\Domain\Models\Tenant;
use Illuminate\Foundation\Testing\RefreshDatabase;

uses(RefreshDatabase::class);

beforeEach(function (): void {
    $this->tenant = Tenant::create(['name' => 'Test Org', 'slug' => 'test-org']);
});

it('registers a global user with an org membership and returns a token', function (): void {
    $response = $this->postJson('/api/auth/register', [
        'tenant_id'             => $this->tenant->id,
        'name'                  => 'Alice',
        'email'                 => 'alice@test.com',
        'password'              => 'Password1!',
        'password_confirmation' => 'Password1!',
    ]);

    $response->assertCreated()
        ->assertJsonStructure(['token', 'user' => ['id', 'email'], 'memberships'])
        ->assertJsonPath('memberships.0.tenant_id', $this->tenant->id)
        ->assertJsonPath('memberships.0.role', 'member');

    expect(User::where('email', 'alice@test.com')->exists())->toBeTrue();
});

it('rejects a duplicate email across the deployment', function (): void {
    User::factory()->create(['email' => 'alice@test.com']);

    $this->postJson('/api/auth/register', [
        'tenant_id'             => $this->tenant->id,
        'name'                  => 'Alice 2',
        'email'                 => 'alice@test.com',
        'password'              => 'Password1!',
        'password_confirmation' => 'Password1!',
    ])->assertUnprocessable();
});

it('logs in with valid credentials and returns memberships', function (): void {
    $user = makeUser($this->tenant->id, 'admin', [
        'email'    => 'alice@test.com',
        'password' => 'Password1!',
    ]);

    $this->postJson('/api/auth/login', [
        'email'    => 'alice@test.com',
        'password' => 'Password1!',
    ])->assertOk()
        ->assertJsonStructure(['token', 'user', 'memberships'])
        ->assertJsonPath('memberships.0.role', 'admin');
});

it('rejects login with wrong password', function (): void {
    makeUser($this->tenant->id, 'member', [
        'email'    => 'alice@test.com',
        'password' => 'Password1!',
    ]);

    $this->postJson('/api/auth/login', [
        'email'    => 'alice@test.com',
        'password' => 'wrong',
    ])->assertUnprocessable();
});

it('returns the authenticated user and memberships on /me', function (): void {
    $user = makeUser($this->tenant->id, 'member', ['email' => 'alice@test.com']);

    $this->actingAs($user)
        ->getJson('/api/auth/me')
        ->assertOk()
        ->assertJsonPath('user.email', 'alice@test.com')
        ->assertJsonPath('memberships.0.tenant_id', $this->tenant->id);
});

it('logs out and invalidates the token', function (): void {
    $user = makeUser($this->tenant->id, 'member', ['email' => 'alice@test.com']);

    $this->actingAs($user)
        ->postJson('/api/auth/logout')
        ->assertOk();
});

it('lets one identity belong to multiple orgs', function (): void {
    $orgB = Tenant::create(['name' => 'Org B', 'slug' => 'org-b']);

    $user = makeUser($this->tenant->id, 'admin', ['email' => 'multi@test.com']);
    // Second membership for the same global identity.
    \App\Modules\Identity\Domain\Models\Membership::create([
        'tenant_id' => $orgB->id,
        'user_id'   => $user->id,
        'role'      => 'viewer',
    ]);

    $response = $this->actingAs($user)->getJson('/api/auth/me');

    $response->assertOk();
    expect($response->json('memberships'))->toHaveCount(2);
});
