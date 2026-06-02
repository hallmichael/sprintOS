<?php

/**
 * Phase 1.5 — Multi-org management authorisation.
 *
 * Verifies the platform-admin vs regular-user boundary for org management:
 *   - regular users may only ever see/manage their OWN organisation
 *   - platform-admins may list, create and manage EVERY organisation
 *   - a platform-admin may "act as" another org via the X-Tenant-ID header
 */

use App\Modules\Identity\Domain\Models\User;
use App\Modules\Tenancy\Domain\Models\Tenant;
use Illuminate\Foundation\Testing\RefreshDatabase;

uses(RefreshDatabase::class);

beforeEach(function (): void {
    $this->orgA = Tenant::create(['name' => 'Org A', 'slug' => 'org-a']);
    $this->orgB = Tenant::create(['name' => 'Org B', 'slug' => 'org-b']);

    $this->memberA = User::withoutGlobalScopes()->create([
        'tenant_id' => $this->orgA->id,
        'name'      => 'Alice',
        'email'     => 'alice@orga.com',
        'password'  => 'Password1!',
    ]);
    $this->memberA->assignRole('member');

    $this->platformAdmin = User::withoutGlobalScopes()->create([
        'tenant_id' => $this->orgA->id,
        'name'      => 'Root',
        'email'     => 'root@sprint.os',
        'password'  => 'Password1!',
    ]);
    $this->platformAdmin->assignRole('platform-admin');
});

// ── Regular user: confined to their own org ───────────────────────────────

it('regular user only sees their own organisation in the list', function (): void {
    $response = $this->actingAs($this->memberA)->getJson('/api/tenants');

    $response->assertOk();
    $ids = collect($response->json('data'))->pluck('id');

    expect($ids)->toContain($this->orgA->id)
        ->and($ids)->not->toContain($this->orgB->id)
        ->and($ids)->toHaveCount(1);
});

it('regular user cannot create an organisation', function (): void {
    $this->actingAs($this->memberA)
        ->postJson('/api/tenants', ['name' => 'Sneaky Org'])
        ->assertForbidden();
});

it('regular user gets 404 viewing another org', function (): void {
    $this->actingAs($this->memberA)
        ->getJson("/api/tenants/{$this->orgB->id}")
        ->assertNotFound();
});

it('regular user can view their own org', function (): void {
    $this->actingAs($this->memberA)
        ->getJson("/api/tenants/{$this->orgA->id}")
        ->assertOk()
        ->assertJsonPath('id', $this->orgA->id);
});

it('regular user gets 404 updating another org', function (): void {
    $this->actingAs($this->memberA)
        ->patchJson("/api/tenants/{$this->orgB->id}", ['name' => 'Hijacked'])
        ->assertNotFound();

    expect($this->orgB->fresh()->name)->toBe('Org B');
});

// ── Platform admin: spans all orgs ────────────────────────────────────────

it('platform admin sees every organisation', function (): void {
    $response = $this->actingAs($this->platformAdmin)->getJson('/api/tenants');

    $response->assertOk();
    $ids = collect($response->json('data'))->pluck('id');

    expect($ids)->toContain($this->orgA->id)
        ->and($ids)->toContain($this->orgB->id);
});

it('platform admin can create an organisation', function (): void {
    $this->actingAs($this->platformAdmin)
        ->postJson('/api/tenants', ['name' => 'New Client'])
        ->assertCreated()
        ->assertJsonPath('name', 'New Client');

    expect(Tenant::withoutGlobalScopes()->where('slug', 'new-client')->exists())->toBeTrue();
});

it('platform admin can update any organisation', function (): void {
    $this->actingAs($this->platformAdmin)
        ->patchJson("/api/tenants/{$this->orgB->id}", ['name' => 'Org B Renamed'])
        ->assertOk()
        ->assertJsonPath('name', 'Org B Renamed');
});

// ── Platform admin: "act as" another org via header ───────────────────────

it('platform admin can act as another org via X-Tenant-ID header', function (): void {
    // A user that lives in org B
    $bobInB = User::withoutGlobalScopes()->create([
        'tenant_id' => $this->orgB->id,
        'name'      => 'Bob',
        'email'     => 'bob@orgb.com',
        'password'  => 'Password1!',
    ]);
    $bobInB->assignRole('member');

    // Platform admin queries /api/users while acting as org B → sees org B's users only
    $response = $this->actingAs($this->platformAdmin)
        ->withHeader('X-Tenant-ID', $this->orgB->id)
        ->getJson('/api/users');

    $response->assertOk();
    $emails = collect($response->json('data'))->pluck('email');

    expect($emails)->toContain('bob@orgb.com')
        ->and($emails)->not->toContain('alice@orga.com');
});

it('regular user cannot escape their org with X-Tenant-ID header', function (): void {
    // memberA tries to spoof org B context — must be ignored, stays in org A
    User::withoutGlobalScopes()->create([
        'tenant_id' => $this->orgB->id,
        'name'      => 'Bob',
        'email'     => 'bob@orgb.com',
        'password'  => 'Password1!',
    ]);

    $response = $this->actingAs($this->memberA)
        ->withHeader('X-Tenant-ID', $this->orgB->id)
        ->getJson('/api/users');

    $response->assertOk();
    $emails = collect($response->json('data'))->pluck('email');

    // Header ignored: still scoped to org A
    expect($emails)->not->toContain('bob@orgb.com');
});
