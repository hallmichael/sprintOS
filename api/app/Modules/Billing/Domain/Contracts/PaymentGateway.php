<?php

namespace App\Modules\Billing\Domain\Contracts;

use App\Modules\Billing\Domain\Data\CardDetails;
use App\Modules\Billing\Domain\Data\ChargeResult;

/**
 * Payment processor abstraction (Stripe in production, a fake in tests).
 *
 * The card is tokenised client-side (Stripe.js) — the backend only ever sees a
 * payment_method id, never a PAN. PCI scope is contained to the processor.
 */
interface PaymentGateway
{
    /**
     * Attach a tokenised payment method to the customer (creating the customer if
     * needed) and return its non-sensitive details.
     */
    public function attachCard(?string $customerId, string $paymentMethodId, string $email): CardDetails;

    /**
     * Charge an amount (in major units, e.g. dollars) to the customer's card.
     */
    public function charge(string $customerId, string $paymentMethodId, float $amount, string $currency, string $description): ChargeResult;
}
