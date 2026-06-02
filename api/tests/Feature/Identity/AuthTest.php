<?php

/**
 * Phase 1.3 — Authentication tests.
 */

use App\Modules\Identity\Domain\Models\User;
use App\Modules\Tenancy\Domain\Models\Tenant;
use Illuminate\Foundation\Testing\RefreshDatabase;

uses(RefreshDatabase::class);

beforeEach(function (): void {
    $this->tenant = Tenant::create(['name' => 'Test Org', 'slug' => 'test-org']);
});

it('registers a new user and returns a token', function (): void {
    $response = $this->postJson('/api/auth/register', [
        'tenant_id'             => $this->tenant->id,
        'name'                  => 'Alice',
        'email'                 => 'alice@test.com',
        'password'              => 'Password1!',
        'password_confirmation' => 'Password1!',
    ]);

    $response->assertCreated()
        ->assertJsonStructure(['token', 'user' => ['id', 'email', 'roles']]);
});

it('logs in with valid credentials', function (): void {
    User::withoutGlobalScopes()->create([
        'tenant_id' => $this->tenant->id,
        'name'      => 'Alice',
        'email'     => 'alice@test.com',
        'password'  => 'Password1!',
    ]);

    $this->postJson('/api/auth/login', [
        'email'    => 'alice@test.com',
        'password' => 'Password1!',
    ])->assertOk()->assertJsonStructure(['token', 'user']);
});

it('rejects login with wrong password', function (): void {
    User::withoutGlobalScopes()->create([
        'tenant_id' => $this->tenant->id,
        'name'      => 'Alice',
        'email'     => 'alice@test.com',
        'password'  => 'Password1!',
    ]);

    $this->postJson('/api/auth/login', [
        'email'    => 'alice@test.com',
        'password' => 'wrong',
    ])->assertUnprocessable();
});

it('returns the authenticated user on /me', function (): void {
    $user = User::withoutGlobalScopes()->create([
        'tenant_id' => $this->tenant->id,
        'name'      => 'Alice',
        'email'     => 'alice@test.com',
        'password'  => 'Password1!',
    ]);

    $this->actingAs($user)
        ->getJson('/api/auth/me')
        ->assertOk()
        ->assertJsonPath('email', 'alice@test.com');
});

it('logs out and invalidates the token', function (): void {
    $user = User::withoutGlobalScopes()->create([
        'tenant_id' => $this->tenant->id,
        'name'      => 'Alice',
        'email'     => 'alice@test.com',
        'password'  => 'Password1!',
    ]);

    $this->actingAs($user)
        ->postJson('/api/auth/logout')
        ->assertOk();
});
