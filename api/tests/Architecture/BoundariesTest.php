<?php

/**
 * Architecture tests — machine-checkable guardrails for AI development.
 * Run with: composer test:arch
 *
 * These are the automated backstop for the rules in CLAUDE.md.
 */

// ── 1. Tenant scoping ─────────────────────────────────────────────────────
// Every Eloquent model inside a module must use BelongsToTenant OR be in the
// explicit allow-list below (models that are not tenant-owned, e.g. Tenant itself).
arch('every tenant-owned model uses BelongsToTenant')
    ->expect('App\Modules')
    ->classes()
    ->extending('Illuminate\Database\Eloquent\Model')
    ->toUseTrait('App\Modules\Tenancy\Domain\Concerns\BelongsToTenant')
    ->ignoring([
        'App\Modules\Tenancy\Domain\Models\Tenant', // Tenant itself is not tenant-scoped
    ]);

// ── 2. External service gateway ──────────────────────────────────────────
// Only Ai, Connectors and Usage are allowed to use HTTP clients or external SDKs.
arch('only Ai, Connectors, Usage may call external services directly')
    ->expect(['GuzzleHttp\Client', 'Illuminate\Support\Facades\Http'])
    ->toOnlyBeUsedIn([
        'App\Modules\Ai',
        'App\Modules\Connectors',
        'App\Modules\Usage',
    ]);

// ── 3. Module boundaries ──────────────────────────────────────────────────
// Modules interact only through their Services contracts, never direct Domain imports.
arch('modules must not reach into another module Domain internals')
    ->expect('App\Modules\Identity')
    ->not->toUse('App\Modules\Tenancy\Domain\Models');

arch('modules must not reach into another module Domain internals (reverse)')
    ->expect('App\Modules\Tenancy')
    ->not->toUse('App\Modules\Identity\Domain\Models');

// ── 4. Thin controllers ───────────────────────────────────────────────────
arch('controllers do not touch the DB directly')
    ->expect('App\Modules\*\Http\Controllers')
    ->not->toUse('Illuminate\Support\Facades\DB');

// ── 5. No raw RN primitives in frontend (PHP-side: ensure backend stays clean)
arch('actions are final classes with single public method convention')
    ->expect('App\Modules\*\Domain\Actions')
    ->classes()
    ->toBeFinal();
