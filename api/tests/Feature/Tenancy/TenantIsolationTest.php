<?php

/**
 * Phase 1.6 — Tenant isolation suite (ADR 0005 identity model).
 *
 * Negative-authorization tests asserting org A can never read or mutate org B's
 * data. All tests must PASS (isolation holds).
 */

use App\Modules\Identity\Domain\Models\SsoConfig;
use App\Modules\Tenancy\Domain\Models\Tenant;
use Illuminate\Foundation\Testing\RefreshDatabase;

uses(RefreshDatabase::class);

beforeEach(function (): void {
    $this->orgA = Tenant::create(['name' => 'Org A', 'slug' => 'org-a']);
    $this->orgB = Tenant::create(['name' => 'Org B', 'slug' => 'org-b']);

    $this->adminA  = makeUser($this->orgA->id, 'admin', ['email' => 'admin@orga.com']);
    $this->memberA = makeUser($this->orgA->id, 'member', ['email' => 'alice@orga.com']);
    $this->memberB = makeUser($this->orgB->id, 'member', ['email' => 'bob@orgb.com']);
});

// ── User listing isolation ────────────────────────────────────────────────

it('users index for org A excludes org B members', function (): void {
    $response = $this->actingAs($this->memberA)->getJson('/api/users');

    $response->assertOk();
    $emails = collect($response->json('data'))->pluck('email');

    expect($emails)->toContain('alice@orga.com')
        ->and($emails)->not->toContain('bob@orgb.com');
});

// ── Direct record access ──────────────────────────────────────────────────

it('org A user gets 404 fetching an org B member', function (): void {
    $this->actingAs($this->memberA)
        ->getJson("/api/users/{$this->memberB->id}")
        ->assertNotFound();
});

// ── Mutation isolation ────────────────────────────────────────────────────

it('org A admin cannot assign a role to an org B member', function (): void {
    $this->actingAs($this->adminA)
        ->putJson("/api/users/{$this->memberB->id}/roles", ['role' => 'admin'])
        ->assertNotFound();   // member B is invisible to org A
});

it('org A admin cannot remove an org B member', function (): void {
    $this->actingAs($this->adminA)
        ->deleteJson("/api/users/{$this->memberB->id}")
        ->assertNotFound();
});

it('a plain member cannot assign roles (not an org admin)', function (): void {
    $other = makeUser($this->orgA->id, 'member', ['email' => 'carol@orga.com']);

    $this->actingAs($this->memberA)
        ->putJson("/api/users/{$other->id}/roles", ['role' => 'admin'])
        ->assertForbidden();   // tenant.role:admin gate
});

// ── Unauthenticated ────────────────────────────────────────────────────────

it('unauthenticated request cannot list tenants', function (): void {
    $this->getJson('/api/tenants')->assertUnauthorized();
});

// ── BelongsToTenant global scope (on an owned model: SsoConfig) ────────────

it('BelongsToTenant scope hides org B owned-records from org A queries', function (): void {
    SsoConfig::withoutGlobalScopes()->create([
        'tenant_id' => $this->orgA->id, 'provider' => 'google',
        'client_id' => 'a', 'client_secret' => 's',
    ]);
    SsoConfig::withoutGlobalScopes()->create([
        'tenant_id' => $this->orgB->id, 'provider' => 'google',
        'client_id' => 'b', 'client_secret' => 's',
    ]);

    app('tenant.context')->set($this->orgA);

    $configs = SsoConfig::all();

    expect($configs)->toHaveCount(1)
        ->and($configs->first()->tenant_id)->toBe($this->orgA->id);
});

it('BelongsToTenant auto-stamps tenant_id on create from context', function (): void {
    app('tenant.context')->set($this->orgA);

    $config = SsoConfig::create([
        'provider' => 'github', 'client_id' => 'x', 'client_secret' => 'y',
    ]);

    expect($config->tenant_id)->toBe($this->orgA->id);
});
