<?php

/**
 * Phase 2.3 — Usage metering ledger.
 */

use App\Modules\Tenancy\Domain\Models\Tenant;
use App\Modules\Usage\Domain\Contracts\Meter;
use App\Modules\Usage\Domain\Data\MeterEvent;
use App\Modules\Usage\Domain\Data\MeterLine;
use App\Modules\Usage\Domain\Models\UsageEvent;
use App\Modules\Usage\Domain\Services\UsageLedger;
use Database\Seeders\UsageRateSeeder;
use Illuminate\Foundation\Testing\RefreshDatabase;

uses(RefreshDatabase::class);

beforeEach(function (): void {
    $this->seed(UsageRateSeeder::class);
    $this->tenant = Tenant::create(['name' => 'Acme', 'slug' => 'acme']);
});

it('records raw and marked-up cost for a metered Claude call', function (): void {
    $events = app(Meter::class)->record(new MeterEvent(
        tenantId: $this->tenant->id,
        service: 'bedrock',
        operation: 'chat',
        model: 'anthropic.claude-3-5-sonnet-20241022-v2:0',
        lines: [
            new MeterLine('input_tokens', 1000),
            new MeterLine('output_tokens', 500),
        ],
        correlationId: 'run-123',
    ));

    expect($events)->toHaveCount(2);

    // input: 1000 * 0.000003 = 0.003 raw; +30% = 0.0039 billable
    $input = $events->firstWhere('unit', 'input_tokens');
    expect((float) $input->raw_cost)->toBe(0.003)
        ->and((float) $input->markup_rate)->toBe(0.30)
        ->and(round((float) $input->billable_cost, 6))->toBe(0.0039);

    // output: 500 * 0.000015 = 0.0075 raw; +30% = 0.00975 billable
    $output = $events->firstWhere('unit', 'output_tokens');
    expect((float) $output->raw_cost)->toBe(0.0075)
        ->and(round((float) $output->billable_cost, 6))->toBe(0.00975);
});

it('records an event even when no rate is configured (zero cost, never lost)', function (): void {
    $events = app(Meter::class)->record(new MeterEvent(
        tenantId: $this->tenant->id,
        service: 'sms',
        operation: 'send',
        lines: [new MeterLine('message', 3)],
    ));

    expect($events)->toHaveCount(1)
        ->and((float) $events->first()->raw_cost)->toBe(0.0)
        ->and(UsageEvent::where('service', 'sms')->count())->toBe(1);
});

it('rolls up billable cost per service', function (): void {
    $meter = app(Meter::class);

    $meter->record(new MeterEvent(
        tenantId: $this->tenant->id, service: 'bedrock', operation: 'chat',
        model: 'anthropic.claude-3-5-haiku-20241022-v1:0',
        lines: [new MeterLine('input_tokens', 10_000)],
    ));

    $ledger = app(UsageLedger::class);
    $rollup = $ledger->rollupByService($this->tenant->id);

    // 10000 * 0.0000008 = 0.008 raw; billable 0.0104
    expect(round($rollup['bedrock']['billable'], 6))->toBe(0.0104);
    expect(round($ledger->billableTotal($this->tenant->id), 6))->toBe(0.0104);
});

it('isolates usage events by tenant', function (): void {
    $other = Tenant::create(['name' => 'Other', 'slug' => 'other']);
    $meter = app(Meter::class);

    $meter->record(new MeterEvent(
        tenantId: $this->tenant->id, service: 'bedrock', operation: 'chat',
        model: 'anthropic.claude-3-5-haiku-20241022-v1:0',
        lines: [new MeterLine('input_tokens', 1000)],
    ));
    $meter->record(new MeterEvent(
        tenantId: $other->id, service: 'bedrock', operation: 'chat',
        model: 'anthropic.claude-3-5-haiku-20241022-v1:0',
        lines: [new MeterLine('input_tokens', 1000)],
    ));

    app('tenant.context')->set($this->tenant);
    expect(UsageEvent::count())->toBe(1);
});
