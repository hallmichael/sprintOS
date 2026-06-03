<?php

namespace App\Modules\Billing\Http\Controllers;

use App\Modules\Billing\Domain\Services\StripeWebhookHandler;
use App\Shared\Http\Controller;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Stripe\Exception\SignatureVerificationException;
use Stripe\Webhook;

/**
 * Stripe webhook receiver (public, signature-verified). Keeps invoice status in
 * sync with the processor for async/off-session charges.
 */
final class WebhookController extends Controller
{
    public function __construct(private readonly StripeWebhookHandler $handler) {}

    /** POST /api/billing/webhook */
    public function handle(Request $request): JsonResponse
    {
        $secret = (string) config('sprintos.billing.payments.webhook_secret');

        try {
            $event = Webhook::constructEvent(
                $request->getContent(),
                $request->header('Stripe-Signature', ''),
                $secret,
            );
        } catch (SignatureVerificationException|\UnexpectedValueException $e) {
            return response()->json(['message' => 'Invalid signature.'], 400);
        }

        $this->handler->handle($event->type, $event->data->object->toArray());

        return response()->json(['received' => true]);
    }
}
