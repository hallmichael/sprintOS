<?php

/**
 * Phase 2.1 — AI gateway (metered Claude completions via the fake driver).
 */

use App\Modules\Ai\Domain\Contracts\ModelClient;
use App\Modules\Ai\Domain\Data\ChatResponse;
use App\Modules\Ai\Domain\Data\TokenUsage;
use App\Modules\Ai\Domain\Data\ToolUse;
use App\Modules\Billing\Domain\Services\BillingConfigService;
use App\Modules\Tenancy\Domain\Models\Tenant;
use App\Modules\Usage\Domain\Contracts\Meter;
use App\Modules\Usage\Domain\Data\MeterEvent;
use App\Modules\Usage\Domain\Data\MeterLine;
use App\Modules\Usage\Domain\Models\UsageEvent;
use Database\Seeders\UsageRateSeeder;
use Illuminate\Foundation\Testing\RefreshDatabase;

uses(RefreshDatabase::class);

beforeEach(function (): void {
    $this->seed(UsageRateSeeder::class);
    $this->tenant = Tenant::create(['name' => 'Acme', 'slug' => 'acme']);
    $this->user = makeUser($this->tenant->id, 'member', ['email' => 'u@acme.com']);
});

it('returns a completion and meters the call', function (): void {
    $this->actingAs($this->user)
        ->postJson('/api/ai/complete', ['prompt' => 'Hello there, model.'])
        ->assertOk()
        ->assertJsonStructure(['text', 'model', 'usage' => ['input_tokens', 'output_tokens'], 'stop_reason']);

    // Two ledger rows (input + output tokens) for the bedrock service.
    $events = UsageEvent::withoutGlobalScopes()->where('tenant_id', $this->tenant->id)->get();
    expect($events)->toHaveCount(2)
        ->and($events->pluck('unit')->all())->toContain('input_tokens', 'output_tokens')
        ->and($events->every(fn ($e) => $e->service === 'bedrock'))->toBeTrue()
        ->and((float) $events->sum('billable_cost'))->toBeGreaterThan(0.0);
});

it('routes the chosen tier to the configured model', function (): void {
    $this->actingAs($this->user)
        ->postJson('/api/ai/complete', ['prompt' => 'hi', 'tier' => 'fast'])
        ->assertOk()
        ->assertJsonPath('model', config('sprintos.ai.tiers.fast'));
});

it('blocks completion when the org is over its spend cap', function (): void {
    // Pre-spend over a tiny cap.
    app(BillingConfigService::class)->update($this->tenant->id, ['spend_cap' => 0.0000001]);
    app(Meter::class)->record(new MeterEvent(
        tenantId: $this->tenant->id, service: 'bedrock', operation: 'chat',
        model: 'anthropic.claude-3-5-sonnet-20241022-v2:0',
        lines: [new MeterLine('input_tokens', 1000)],
    ));

    $this->actingAs($this->user)
        ->postJson('/api/ai/complete', ['prompt' => 'should be blocked'])
        ->assertStatus(402);
});

it('passes scripted tool-use responses through the gateway', function (): void {
    // Script the fake driver to ask for a tool.
    $fake = app(ModelClient::class);
    $fake->willReturn(new ChatResponse(
        text: null,
        toolUses: [new ToolUse('tu_1', 'calculator', ['a' => 2, 'b' => 3])],
        usage: new TokenUsage(10, 5),
        stopReason: 'tool_use',
        model: 'x',
    ));

    $this->actingAs($this->user)
        ->postJson('/api/ai/complete', ['prompt' => 'add 2 and 3'])
        ->assertOk()
        ->assertJsonPath('stop_reason', 'tool_use');

    // Still metered even when the model asked for a tool.
    expect(UsageEvent::withoutGlobalScopes()->where('tenant_id', $this->tenant->id)->count())->toBe(2);
});
