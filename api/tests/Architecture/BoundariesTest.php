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
        // Not tenant-owned (see ADR 0005):
        'App\Modules\Tenancy\Domain\Models\Tenant',     // the org itself
        'App\Modules\Identity\Domain\Models\User',      // global identity, spans orgs
        'App\Modules\Identity\Domain\Models\Membership', // junction; queried across orgs
        'App\Modules\Usage\Domain\Models\UsageRate',     // deployment-wide rate card
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

// ── 2b. All AI calls go through the gateway ──────────────────────────────
// Modules may depend on ModelGateway (the sanctioned entry point) but must
// never call ModelClient directly — that bypasses metering and spend-caps.
arch('feature modules use ModelGateway, not ModelClient directly')
    ->expect('App\Modules\Ai\Domain\Contracts\ModelClient')
    ->toOnlyBeUsedIn([
        'App\Modules\Ai',  // the gateway + drivers live here
    ]);

// ── 3. Module boundaries ──────────────────────────────────────────────────
// Tenancy is the foundational module: its `Tenant` model, BelongsToTenant trait
// and TenantContext are the shared tenancy primitives that higher modules are
// designed to build on (every owned table has a tenant_id). So depending on
// Tenancy is allowed. The invariant that matters is the REVERSE — the foundation
// must never depend on a feature module. If Tenancy knew about Identity (users),
// the dependency graph would have a cycle and the foundation couldn't stand alone.
arch('the Tenancy foundation does not depend on the Identity module')
    ->expect('App\Modules\Tenancy')
    ->not->toUse('App\Modules\Identity');

// ── 4. Thin controllers ───────────────────────────────────────────────────
arch('controllers do not touch the DB directly')
    ->expect('App\Modules\*\Http\Controllers')
    ->not->toUse('Illuminate\Support\Facades\DB');

// ── 5. No raw RN primitives in frontend (PHP-side: ensure backend stays clean)
arch('actions are final classes with single public method convention')
    ->expect('App\Modules\*\Domain\Actions')
    ->classes()
    ->toBeFinal();
