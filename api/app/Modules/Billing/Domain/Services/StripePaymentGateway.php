<?php

namespace App\Modules\Billing\Domain\Services;

use App\Modules\Billing\Domain\Contracts\PaymentGateway;
use App\Modules\Billing\Domain\Data\CardDetails;
use App\Modules\Billing\Domain\Data\ChargeResult;
use Stripe\Exception\ApiErrorException;
use Stripe\StripeClient;

/**
 * Stripe-backed payment gateway (PAYMENTS_DRIVER=stripe).
 *
 * The frontend tokenises the card with Stripe.js and sends only a
 * payment_method id; this adapter attaches it to a Stripe Customer and charges
 * via PaymentIntents with off-session confirmation. No PAN touches our servers.
 */
final class StripePaymentGateway implements PaymentGateway
{
    private StripeClient $stripe;

    public function __construct(?string $secret = null)
    {
        $this->stripe = new StripeClient($secret ?? (string) config('sprintos.billing.payments.stripe_secret'));
    }

    public function attachCard(?string $customerId, string $paymentMethodId, string $email): CardDetails
    {
        if ($customerId === null) {
            $customer = $this->stripe->customers->create(['email' => $email]);
            $customerId = $customer->id;
        }

        $this->stripe->paymentMethods->attach($paymentMethodId, ['customer' => $customerId]);
        $this->stripe->customers->update($customerId, [
            'invoice_settings' => ['default_payment_method' => $paymentMethodId],
        ]);

        $pm = $this->stripe->paymentMethods->retrieve($paymentMethodId);

        return new CardDetails(
            brand: $pm->card->brand ?? 'unknown',
            last4: $pm->card->last4 ?? '0000',
            customerId: $customerId,
            paymentMethodId: $paymentMethodId,
        );
    }

    public function charge(string $customerId, string $paymentMethodId, float $amount, string $currency, string $description): ChargeResult
    {
        try {
            $intent = $this->stripe->paymentIntents->create([
                'amount' => (int) round($amount * 100), // minor units
                'currency' => strtolower($currency),
                'customer' => $customerId,
                'payment_method' => $paymentMethodId,
                'off_session' => true,
                'confirm' => true,
                'description' => $description,
            ]);

            return new ChargeResult(
                success: $intent->status === 'succeeded',
                reference: $intent->id,
                failureReason: $intent->status === 'succeeded' ? null : $intent->status,
            );
        } catch (ApiErrorException $e) {
            return new ChargeResult(success: false, failureReason: $e->getMessage());
        }
    }
}
