<?php

/**
 * Phase 1.6 — Tenant isolation test suite.
 *
 * Negative-authorization tests asserting that org A can never read or mutate
 * org B's data. All tests must PASS (meaning the isolation holds).
 *
 * Definition of Done for Phase 1.6: every test here is green.
 */

use App\Modules\Identity\Domain\Models\User;
use App\Modules\Tenancy\Domain\Models\Tenant;
use Illuminate\Foundation\Testing\RefreshDatabase;

uses(RefreshDatabase::class);

beforeEach(function (): void {
    // Two fully isolated tenants.
    $this->tenantA = Tenant::create(['name' => 'Org A', 'slug' => 'org-a']);
    $this->tenantB = Tenant::create(['name' => 'Org B', 'slug' => 'org-b']);

    // One user per tenant (bypass global scope on create to avoid needing context set).
    $this->userA = User::withoutGlobalScopes()->create([
        'tenant_id' => $this->tenantA->id,
        'name'      => 'Alice',
        'email'     => 'alice@orga.com',
        'password'  => 'Password1!',
    ]);
    $this->userB = User::withoutGlobalScopes()->create([
        'tenant_id' => $this->tenantB->id,
        'name'      => 'Bob',
        'email'     => 'bob@orgb.com',
        'password'  => 'Password1!',
    ]);
});

// ── User listing isolation ────────────────────────────────────────────────

it('users index for org A does not include org B users', function (): void {
    $response = $this->actingAs($this->userA)
        ->getJson('/api/users');

    $response->assertOk();

    // Org B's user must not appear.
    $ids = collect($response->json('data'))->pluck('id');
    expect($ids)->not->toContain($this->userB->id)
        ->and($ids)->toContain($this->userA->id);
});

// ── Direct record access ──────────────────────────────────────────────────

it('org A user gets 404 when directly fetching org B user', function (): void {
    // The BelongsToTenant global scope filters user B from org A's query,
    // so route model binding returns 404 instead of the record.
    $this->actingAs($this->userA)
        ->getJson("/api/users/{$this->userB->id}")
        ->assertNotFound();
});

// ── Mutation isolation ────────────────────────────────────────────────────

it('org A admin cannot assign roles to org B user', function (): void {
    $this->userA->assignRole('admin');

    $this->actingAs($this->userA)
        ->putJson("/api/users/{$this->userB->id}/roles", ['role' => 'admin'])
        ->assertNotFound();   // 404, not 403 — user B is invisible to org A
});

it('org A admin cannot delete org B user', function (): void {
    $this->userA->assignRole('admin');

    $this->actingAs($this->userA)
        ->deleteJson("/api/users/{$this->userB->id}")
        ->assertNotFound();
});

// ── Unauthenticated access ────────────────────────────────────────────────

it('unauthenticated request cannot list tenants', function (): void {
    $this->getJson('/api/tenants')
        ->assertUnauthorized();
});

// ── Me endpoint ───────────────────────────────────────────────────────────

it('me endpoint returns only the authenticated user', function (): void {
    $this->actingAs($this->userA)
        ->getJson('/api/auth/me')
        ->assertOk()
        ->assertJsonPath('tenant_id', $this->tenantA->id);
});

// ── BelongsToTenant global scope (unit-style) ────────────────────────────

it('BelongsToTenant scope hides org B records from org A queries', function (): void {
    app('tenant.context')->set($this->tenantA);

    $users = User::all();

    expect($users)->toHaveCount(1)
        ->and($users->first()->id)->toBe($this->userA->id);
});

it('BelongsToTenant scope auto-stamps tenant_id on create', function (): void {
    app('tenant.context')->set($this->tenantA);

    $user = User::create([
        'name'     => 'Carol',
        'email'    => 'carol@orga.com',
        'password' => 'Password1!',
    ]);

    expect($user->tenant_id)->toBe($this->tenantA->id);
});
