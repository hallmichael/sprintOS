<?php

/**
 * Phase 2.4 + 2.5 — Markup engine, invoicing, payments, spend caps.
 */

use App\Modules\Billing\Domain\Exceptions\SpendCapExceeded;
use App\Modules\Billing\Domain\Models\BillingSetting;
use App\Modules\Billing\Domain\Models\Invoice;
use App\Modules\Billing\Domain\Services\BillingConfigService;
use App\Modules\Billing\Domain\Services\InvoiceService;
use App\Modules\Billing\Domain\Services\SpendGuard;
use App\Modules\Tenancy\Domain\Models\Tenant;
use App\Modules\Usage\Domain\Contracts\Meter;
use App\Modules\Usage\Domain\Data\MeterEvent;
use App\Modules\Usage\Domain\Data\MeterLine;
use App\Modules\Usage\Domain\Models\UsageEvent;
use Carbon\CarbonImmutable;
use Database\Seeders\UsageRateSeeder;
use Illuminate\Foundation\Testing\RefreshDatabase;

uses(RefreshDatabase::class);

beforeEach(function (): void {
    $this->seed(UsageRateSeeder::class);
    $this->tenant = Tenant::create(['name' => 'Acme', 'slug' => 'acme']);
});

function meterHaiku(string $tenantId, int $tokens = 10_000): void
{
    app(Meter::class)->record(new MeterEvent(
        tenantId: $tenantId, service: 'bedrock', operation: 'chat',
        model: 'anthropic.claude-3-5-haiku-20241022-v1:0',
        lines: [new MeterLine('input_tokens', $tokens)],
    ));
}

// ── Markup engine ──────────────────────────────────────────────────────────

it('applies the per-org markup rate from billing settings', function (): void {
    // Override markup to 50% for this org.
    app(BillingConfigService::class)->update($this->tenant->id, ['markup_rate' => 0.50]);

    meterHaiku($this->tenant->id); // 10000 * 0.0000008 = 0.008 raw

    $event = UsageEvent::withoutGlobalScopes()
        ->where('tenant_id', $this->tenant->id)->first();

    expect((float) $event->markup_rate)->toBe(0.50)
        ->and(round((float) $event->billable_cost, 6))->toBe(0.012); // 0.008 * 1.5
});

it('defaults to the deployment markup of 30 percent when unset', function (): void {
    meterHaiku($this->tenant->id);

    $event = UsageEvent::withoutGlobalScopes()
        ->where('tenant_id', $this->tenant->id)->first();

    expect((float) $event->markup_rate)->toBe(0.30);
});

// ── Invoicing ──────────────────────────────────────────────────────────────

it('rolls unbilled usage into an invoice with markup applied', function (): void {
    meterHaiku($this->tenant->id); // raw 0.008, billable 0.0104

    $invoice = app(InvoiceService::class)->generateForPeriod(
        $this->tenant->id,
        CarbonImmutable::now()->startOfMonth(),
        CarbonImmutable::now()->endOfMonth(),
    );

    expect($invoice)->not->toBeNull()
        ->and(round((float) $invoice->subtotal_raw, 6))->toBe(0.008)
        ->and(round((float) $invoice->total, 6))->toBe(0.0104)
        ->and(round((float) $invoice->markup_total, 6))->toBe(0.0024)
        ->and($invoice->status)->toBe(Invoice::STATUS_OPEN)
        ->and($invoice->lines)->toHaveCount(1);

    // Events are now marked billed and won't be invoiced twice.
    $second = app(InvoiceService::class)->generateForPeriod(
        $this->tenant->id,
        CarbonImmutable::now()->startOfMonth(),
        CarbonImmutable::now()->endOfMonth(),
    );
    expect($second)->toBeNull();
});

// ── Payments ───────────────────────────────────────────────────────────────

it('attaches a tokenised card (fake gateway)', function (): void {
    $admin = makeUser($this->tenant->id, 'admin', ['email' => 'admin@acme.com']);

    $this->actingAs($admin)
        ->postJson('/api/billing/card', ['payment_method_id' => 'pm_test_123'])
        ->assertOk()
        ->assertJsonPath('card.last4', '4242');

    $setting = BillingSetting::withoutGlobalScopes()->where('tenant_id', $this->tenant->id)->first();
    expect($setting->hasCard())->toBeTrue();
});

it('charges an open invoice successfully', function (): void {
    $admin = makeUser($this->tenant->id, 'admin', ['email' => 'admin@acme.com']);
    meterHaiku($this->tenant->id);

    $this->actingAs($admin)->postJson('/api/billing/card', ['payment_method_id' => 'pm_ok']);
    $this->actingAs($admin)->postJson('/api/billing/invoices/generate')->assertCreated();

    $invoice = Invoice::withoutGlobalScopes()->where('tenant_id', $this->tenant->id)->first();

    $this->actingAs($admin)
        ->postJson("/api/billing/invoices/{$invoice->id}/charge")
        ->assertOk()
        ->assertJsonPath('status', 'paid');
});

it('marks an invoice failed when the card is declined', function (): void {
    $admin = makeUser($this->tenant->id, 'admin', ['email' => 'admin@acme.com']);
    meterHaiku($this->tenant->id);

    $this->actingAs($admin)->postJson('/api/billing/card', ['payment_method_id' => 'pm_fail']);
    $this->actingAs($admin)->postJson('/api/billing/invoices/generate');

    $invoice = Invoice::withoutGlobalScopes()->where('tenant_id', $this->tenant->id)->first();

    $this->actingAs($admin)
        ->postJson("/api/billing/invoices/{$invoice->id}/charge")
        ->assertOk()
        ->assertJsonPath('status', 'failed')
        ->assertJsonPath('failure_reason', 'card_declined');
});

// ── Spend cap ────────────────────────────────────────────────────────────

it('blocks paid calls once the spend cap is reached', function (): void {
    app(BillingConfigService::class)->update($this->tenant->id, ['spend_cap' => 0.001]);

    meterHaiku($this->tenant->id); // billable 0.0104 > 0.001 cap

    expect(fn () => app(SpendGuard::class)->assertWithinCap($this->tenant->id))
        ->toThrow(SpendCapExceeded::class);
});

it('does not block when under the cap', function (): void {
    app(BillingConfigService::class)->update($this->tenant->id, ['spend_cap' => 100]);
    meterHaiku($this->tenant->id);

    app(SpendGuard::class)->assertWithinCap($this->tenant->id);
    expect(true)->toBeTrue(); // no exception
});

// ── Authorisation ────────────────────────────────────────────────────────

it('lets a member read billing settings but not update them', function (): void {
    $member = makeUser($this->tenant->id, 'member', ['email' => 'member@acme.com']);

    $this->actingAs($member)->getJson('/api/billing/settings')->assertOk();
    $this->actingAs($member)->patchJson('/api/billing/settings', ['markup_rate' => 0.9])->assertForbidden();
    $this->actingAs($member)->postJson('/api/billing/card', ['payment_method_id' => 'pm_x'])->assertForbidden();
});
