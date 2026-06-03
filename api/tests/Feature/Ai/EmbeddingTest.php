<?php

/**
 * Phase 2.1 — Embeddings via the AI gateway (metered, cap-checked).
 */

use App\Modules\Ai\Domain\Data\EmbedRequest;
use App\Modules\Ai\Domain\Services\ModelGateway;
use App\Modules\Tenancy\Domain\Models\Tenant;
use App\Modules\Usage\Domain\Models\UsageEvent;
use Database\Seeders\UsageRateSeeder;
use Illuminate\Foundation\Testing\RefreshDatabase;

uses(RefreshDatabase::class);

beforeEach(function (): void {
    $this->seed(UsageRateSeeder::class);
    $this->tenant = Tenant::create(['name' => 'Acme', 'slug' => 'acme']);
});

it('embeds texts and meters the call', function (): void {
    $response = app(ModelGateway::class)->embed(new EmbedRequest(
        tenantId: $this->tenant->id,
        inputs: ['first chunk of text', 'second chunk of text'],
    ));

    expect($response->vectors)->toHaveCount(2)
        ->and($response->vectors[0])->toBeArray()
        ->and($response->inputTokens)->toBeGreaterThan(0);

    $events = UsageEvent::withoutGlobalScopes()->where('tenant_id', $this->tenant->id)->get();
    expect($events)->toHaveCount(1)
        ->and($events->first()->operation)->toBe('embed')
        ->and($events->first()->unit)->toBe('input_tokens')
        ->and((float) $events->first()->billable_cost)->toBeGreaterThan(0.0);
});

it('uses the configured embedding model by default', function (): void {
    $response = app(ModelGateway::class)->embed(new EmbedRequest(
        tenantId: $this->tenant->id,
        inputs: ['hello'],
    ));

    expect($response->model)->toBe(config('sprintos.ai.embedding_model'));
});
