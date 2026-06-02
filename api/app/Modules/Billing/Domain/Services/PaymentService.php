<?php

namespace App\Modules\Billing\Domain\Services;

use App\Modules\Billing\Domain\Contracts\PaymentGateway;
use App\Modules\Billing\Domain\Models\BillingSetting;
use App\Modules\Billing\Domain\Models\Invoice;

/**
 * Card capture + invoice charging (Build Guide 2.5). Delegates the actual
 * processor calls to a PaymentGateway (Stripe in prod, fake in tests).
 */
final class PaymentService
{
    public function __construct(
        private readonly PaymentGateway $gateway,
        private readonly BillingConfigService $config,
    ) {}

    /**
     * Attach a tokenised card (payment_method id from Stripe.js) to the org.
     * Only non-sensitive metadata (brand, last4, ids) is persisted.
     */
    public function addCard(string $tenantId, string $paymentMethodId, string $email): BillingSetting
    {
        $setting = $this->config->forTenant($tenantId);

        $card = $this->gateway->attachCard($setting->stripe_customer_id, $paymentMethodId, $email);

        $setting->update([
            'stripe_customer_id' => $card->customerId,
            'stripe_payment_method_id' => $card->paymentMethodId,
            'card_brand' => $card->brand,
            'card_last4' => $card->last4,
        ]);

        return $setting;
    }

    /**
     * Charge an open invoice to the org's card and update its status.
     * Returns the updated invoice. Implements basic dunning (mark failed +
     * reason; caller/retry policy can re-attempt).
     */
    public function chargeInvoice(Invoice $invoice): Invoice
    {
        $setting = $this->config->forTenant($invoice->tenant_id);

        if (! $setting->hasCard()) {
            $invoice->update(['status' => Invoice::STATUS_FAILED, 'failure_reason' => 'no_payment_method']);

            return $invoice;
        }

        $result = $this->gateway->charge(
            $setting->stripe_customer_id,
            $setting->stripe_payment_method_id,
            (float) $invoice->total,
            $invoice->currency,
            "sprintOS invoice {$invoice->number}",
        );

        $invoice->update($result->success
            ? ['status' => Invoice::STATUS_PAID, 'paid_at' => now(), 'stripe_payment_intent_id' => $result->reference, 'failure_reason' => null]
            : ['status' => Invoice::STATUS_FAILED, 'failure_reason' => $result->failureReason],
        );

        return $invoice;
    }
}
