<?php

namespace App\Modules\Billing\Domain\Services;

use App\Modules\Billing\Domain\Models\Invoice;

/**
 * Processes Stripe webhook events to keep invoice status in sync with the
 * processor — the authoritative source for async/off-session charges and the
 * basis for dunning on failed payments.
 */
final class StripeWebhookHandler
{
    /**
     * @param  array<string, mixed>  $object  the event's data.object (a PaymentIntent)
     */
    public function handle(string $type, array $object): void
    {
        $intentId = $object['id'] ?? null;
        if ($intentId === null) {
            return;
        }

        // Webhooks are unauthenticated (no tenant context) — match globally by intent id.
        $invoice = Invoice::withoutGlobalScopes()
            ->where('stripe_payment_intent_id', $intentId)
            ->first();

        if ($invoice === null) {
            return; // unknown / not ours
        }

        match ($type) {
            'payment_intent.succeeded' => $invoice->update([
                'status' => Invoice::STATUS_PAID,
                'paid_at' => now(),
                'failure_reason' => null,
            ]),
            'payment_intent.payment_failed' => $invoice->update([
                'status' => Invoice::STATUS_FAILED,
                'failure_reason' => $object['last_payment_error']['message'] ?? 'payment_failed',
            ]),
            default => null,
        };
    }
}
