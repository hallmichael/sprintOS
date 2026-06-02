<?php

/**
 * Phase 1.5 — Multi-org management authorisation (ADR 0005 identity model).
 *
 *   - regular users may only see/manage orgs they are a member of
 *   - platform-admins may list, create and manage EVERY org
 *   - a platform-admin may "act as" any org via the X-Tenant-ID header
 *   - a regular user cannot escape their orgs via the header
 */

use App\Modules\Tenancy\Domain\Models\Tenant;
use Illuminate\Foundation\Testing\RefreshDatabase;

uses(RefreshDatabase::class);

beforeEach(function (): void {
    $this->orgA = Tenant::create(['name' => 'Org A', 'slug' => 'org-a']);
    $this->orgB = Tenant::create(['name' => 'Org B', 'slug' => 'org-b']);

    $this->memberA       = makeUser($this->orgA->id, 'member', ['email' => 'alice@orga.com']);
    $this->platformAdmin = makePlatformAdmin(['email' => 'root@sprint.os']);
});

// ── Regular user: confined to their org(s) ────────────────────────────────

it('regular user only sees orgs they belong to', function (): void {
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

it('regular user gets 404 viewing an org they do not belong to', function (): void {
    $this->actingAs($this->memberA)
        ->getJson("/api/tenants/{$this->orgB->id}")
        ->assertNotFound();
});

it('regular user can view an org they belong to', function (): void {
    $this->actingAs($this->memberA)
        ->getJson("/api/tenants/{$this->orgA->id}")
        ->assertOk()
        ->assertJsonPath('id', $this->orgA->id);
});

it('regular user gets 404 updating an org they do not belong to', function (): void {
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

// ── "Act as" another org via header ───────────────────────────────────────

it('platform admin can act as another org via X-Tenant-ID', function (): void {
    makeUser($this->orgB->id, 'member', ['email' => 'bob@orgb.com']);

    $response = $this->actingAs($this->platformAdmin)
        ->withHeader('X-Tenant-ID', $this->orgB->id)
        ->getJson('/api/users');

    $response->assertOk();
    $emails = collect($response->json('data'))->pluck('email');

    expect($emails)->toContain('bob@orgb.com')
        ->and($emails)->not->toContain('alice@orga.com');
});

it('regular user cannot escape their org with X-Tenant-ID', function (): void {
    makeUser($this->orgB->id, 'member', ['email' => 'bob@orgb.com']);

    $response = $this->actingAs($this->memberA)
        ->withHeader('X-Tenant-ID', $this->orgB->id)
        ->getJson('/api/users');

    $response->assertOk();
    $emails = collect($response->json('data'))->pluck('email');

    // Header ignored (not a member of org B): stays scoped to org A.
    expect($emails)->not->toContain('bob@orgb.com')
        ->and($emails)->toContain('alice@orga.com');
});
