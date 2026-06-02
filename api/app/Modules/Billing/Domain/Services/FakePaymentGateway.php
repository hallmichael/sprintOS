<?php

namespace App\Modules\Billing\Domain\Services;

use App\Modules\Billing\Domain\Contracts\PaymentGateway;
use App\Modules\Billing\Domain\Data\CardDetails;
use App\Modules\Billing\Domain\Data\ChargeResult;
use Illuminate\Support\Str;

/**
 * Deterministic in-memory gateway for tests and local dev (PAYMENTS_DRIVER=fake).
 * A payment method id of 'pm_fail' simulates a declined card.
 */
final class FakePaymentGateway implements PaymentGateway
{
    public function attachCard(?string $customerId, string $paymentMethodId, string $email): CardDetails
    {
        return new CardDetails(
            brand: 'visa',
            last4: '4242',
            customerId: $customerId ?? 'cus_fake_'.Str::random(8),
            paymentMethodId: $paymentMethodId,
        );
    }

    public function charge(string $customerId, string $paymentMethodId, float $amount, string $currency, string $description): ChargeResult
    {
        if ($paymentMethodId === 'pm_fail') {
            return new ChargeResult(success: false, failureReason: 'card_declined');
        }

        return new ChargeResult(success: true, reference: 'pi_fake_'.Str::random(10));
    }
}
