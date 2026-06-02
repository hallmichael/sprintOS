<?php

/**
 * Phase 2.6 — Setup wizard backend (the config surface the Indi stepper drives).
 * The wizard composes per-module endpoints: org settings (Tenancy), AI tiers
 * (Ai), billing/card (Billing), orgs/users (existing).
 */

use App\Modules\Tenancy\Domain\Models\Tenant;
use Illuminate\Foundation\Testing\RefreshDatabase;

uses(RefreshDatabase::class);

beforeEach(function (): void {
    $this->tenant = Tenant::create(['name' => 'Acme', 'slug' => 'acme']);
    $this->admin = makeUser($this->tenant->id, 'admin', ['email' => 'admin@acme.com']);
    $this->member = makeUser($this->tenant->id, 'member', ['email' => 'member@acme.com']);
});

it('exposes org settings with sensible defaults', function (): void {
    $this->actingAs($this->admin)
        ->getJson('/api/org/settings')
        ->assertOk()
        ->assertJsonPath('settings.branding.display_name', 'Acme')
        ->assertJsonPath('settings.features.agents', false)
        ->assertJsonPath('settings.ai_default_tier', config('sprintos.ai.default_tier'))
        ->assertJsonPath('settings.setup_completed', false);
});

it('lets an admin configure branding, features and tier through the wizard', function (): void {
    $this->actingAs($this->admin)
        ->patchJson('/api/org/settings', [
            'name' => 'Acme Corp',
            'branding' => ['primary_color' => '#0055FF'],
            'features' => ['agents' => true, 'rag' => true],
            'ai_default_tier' => 'powerful',
            'setup_completed' => true,
        ])
        ->assertOk()
        ->assertJsonPath('name', 'Acme Corp')
        ->assertJsonPath('settings.branding.primary_color', '#0055FF')
        ->assertJsonPath('settings.features.agents', true)
        ->assertJsonPath('settings.features.crud_builder', false)
        ->assertJsonPath('settings.ai_default_tier', 'powerful')
        ->assertJsonPath('settings.setup_completed', true);
});

it('forbids a member from changing org settings', function (): void {
    $this->actingAs($this->member)
        ->patchJson('/api/org/settings', ['setup_completed' => true])
        ->assertForbidden();
});

it('lists available AI model tiers for the wizard', function (): void {
    $this->actingAs($this->admin)
        ->getJson('/api/ai/tiers')
        ->assertOk()
        ->assertJsonPath('default', config('sprintos.ai.default_tier'))
        ->assertJsonCount(3, 'tiers');
});

it('partial updates do not clobber other settings', function (): void {
    $this->actingAs($this->admin)->patchJson('/api/org/settings', ['features' => ['agents' => true]]);
    $this->actingAs($this->admin)->patchJson('/api/org/settings', ['ai_default_tier' => 'fast']);

    $this->actingAs($this->admin)
        ->getJson('/api/org/settings')
        ->assertJsonPath('settings.features.agents', true)   // preserved
        ->assertJsonPath('settings.ai_default_tier', 'fast');
});
