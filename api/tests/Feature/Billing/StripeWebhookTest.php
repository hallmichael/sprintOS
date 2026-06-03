<?php

/**
 * Phase 2.5 — Stripe webhook: async payment confirmation + dunning.
 */

use App\Modules\Billing\Domain\Models\Invoice;
use App\Modules\Billing\Domain\Services\StripeWebhookHandler;
use App\Modules\Tenancy\Domain\Models\Tenant;
use Illuminate\Foundation\Testing\RefreshDatabase;

uses(RefreshDatabase::class);

beforeEach(function (): void {
    $this->tenant = Tenant::create(['name' => 'Acme', 'slug' => 'acme']);
    $this->invoice = Invoice::withoutGlobalScopes()->create([
        'tenant_id' => $this->tenant->id, 'number' => 'INV-1', 'status' => Invoice::STATUS_OPEN,
        'period_start' => now()->startOfMonth(), 'period_end' => now()->endOfMonth(),
        'total' => 12.34, 'currency' => 'AUD', 'stripe_payment_intent_id' => 'pi_webhook_1',
    ]);
});

// ── Handler logic ──────────────────────────────────────────────────────────

it('marks an invoice paid on payment_intent.succeeded', function (): void {
    app(StripeWebhookHandler::class)->handle('payment_intent.succeeded', ['id' => 'pi_webhook_1']);

    expect($this->invoice->fresh()->status)->toBe('paid')
        ->and($this->invoice->fresh()->paid_at)->not->toBeNull();
});

it('marks an invoice failed on payment_intent.payment_failed (dunning)', function (): void {
    app(StripeWebhookHandler::class)->handle('payment_intent.payment_failed', [
        'id' => 'pi_webhook_1',
        'last_payment_error' => ['message' => 'Your card was declined.'],
    ]);

    expect($this->invoice->fresh()->status)->toBe('failed')
        ->and($this->invoice->fresh()->failure_reason)->toBe('Your card was declined.');
});

it('ignores events for unknown payment intents', function (): void {
    app(StripeWebhookHandler::class)->handle('payment_intent.succeeded', ['id' => 'pi_unknown']);

    expect($this->invoice->fresh()->status)->toBe('open');
});

// ── Endpoint signature verification ────────────────────────────────────────

it('rejects a webhook with an invalid signature', function (): void {
    config()->set('sprintos.billing.payments.webhook_secret', 'whsec_test');

    $this->postJson('/api/billing/webhook', ['type' => 'payment_intent.succeeded'], [
        'Stripe-Signature' => 't=1,v1=bogus',
    ])->assertStatus(400);
});

it('accepts a correctly signed webhook and updates the invoice', function (): void {
    $secret = 'whsec_test_secret';
    config()->set('sprintos.billing.payments.webhook_secret', $secret);

    $payload = json_encode([
        'id' => 'evt_1', 'object' => 'event', 'type' => 'payment_intent.succeeded',
        'data' => ['object' => ['id' => 'pi_webhook_1', 'object' => 'payment_intent']],
    ]);

    $timestamp = time();
    $signature = hash_hmac('sha256', "{$timestamp}.{$payload}", $secret);

    $this->call('POST', '/api/billing/webhook', [], [], [],
        ['HTTP_Stripe-Signature' => "t={$timestamp},v1={$signature}", 'CONTENT_TYPE' => 'application/json'],
        $payload,
    )->assertOk()->assertJsonPath('received', true);

    expect($this->invoice->fresh()->status)->toBe('paid');
});
