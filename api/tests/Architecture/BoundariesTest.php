<?php
// Pest architecture tests — the machine-checkable guardrails for AI development.
// Run with: composer arch

arch('every tenant-owned model is tenant scoped')
    ->expect('App\Modules')
    ->classes()
    ->extending('Illuminate\Database\Eloquent\Model')
    ->toUseTrait('App\Modules\Tenancy\Domain\Concerns\BelongsToTenant');
    // (allow-list genuinely global models explicitly)

arch('only Ai, Connectors and Usage may call external services directly')
    ->expect(['GuzzleHttp', 'Illuminate\Support\Facades\Http'])
    ->toOnlyBeUsedIn([
        'App\Modules\Ai',
        'App\Modules\Connectors',
        'App\Modules\Usage',
    ]);

arch('modules talk only via Services contracts')
    ->expect('App\Modules')
    ->toNotUse('App\Modules\*\Domain\Models'); // cross-module model access banned

arch('controllers stay thin')
    ->expect('App\Modules\*\Http\Controllers')
    ->toNotUse('Illuminate\Support\Facades\DB');
