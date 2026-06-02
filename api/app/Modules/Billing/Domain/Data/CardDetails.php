<?php

namespace App\Modules\Billing\Domain\Data;

/** Non-sensitive card metadata returned after tokenised capture. */
final readonly class CardDetails
{
    public function __construct(
        public string $brand,
        public string $last4,
        public string $customerId,
        public string $paymentMethodId,
    ) {}
}
