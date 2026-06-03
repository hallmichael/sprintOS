<?php

/**
 * Phase 2.4/2.5 — billing:run-cycle generates (and charges) invoices per org.
 */

use App\Modules\Billing\Domain\Models\Invoice;
use App\Modules\Billing\Domain\Services\PaymentService;
use App\Modules\Tenancy\Domain\Models\Tenant;
use App\Modules\Usage\Domain\Contracts\Meter;
use App\Modules\Usage\Domain\Data\MeterEvent;
use App\Modules\Usage\Domain\Data\MeterLine;
use Database\Seeders\UsageRateSeeder;
use Illuminate\Foundation\Testing\RefreshDatabase;

uses(RefreshDatabase::class);

beforeEach(function (): void {
    $this->seed(UsageRateSeeder::class);
});

function meterUsage(string $tenantId): void
{
    app(Meter::class)->record(new MeterEvent(
        tenantId: $tenantId, service: 'bedrock', operation: 'chat',
        model: 'anthropic.claude-3-5-haiku-20241022-v1:0',
        lines: [new MeterLine('input_tokens', 10_000)],
    ));
}

it('generates invoices for orgs with unbilled usage', function (): void {
    $a = Tenant::create(['name' => 'A', 'slug' => 'a']);
    $b = Tenant::create(['name' => 'B', 'slug' => 'b']);
    Tenant::create(['name' => 'C-no-usage', 'slug' => 'c']);

    meterUsage($a->id);
    meterUsage($b->id);

    $this->artisan('billing:run-cycle')
        ->expectsOutputToContain('2 invoice(s) generated')
        ->assertSuccessful();

    expect(Invoice::withoutGlobalScopes()->count())->toBe(2);
});

it('charges generated invoices with --charge when a card is present', function (): void {
    $a = Tenant::create(['name' => 'A', 'slug' => 'a']);
    meterUsage($a->id);

    // Attach a working card.
    app(PaymentService::class)->addCard($a->id, 'pm_ok', 'a@a.com');

    $this->artisan('billing:run-cycle --charge')->assertSuccessful();

    expect(Invoice::withoutGlobalScopes()->where('tenant_id', $a->id)->first()->status)->toBe('paid');
});
