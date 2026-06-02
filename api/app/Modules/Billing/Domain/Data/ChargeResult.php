<?php

namespace App\Modules\Billing\Domain\Data;

/** Outcome of charging an invoice. */
final readonly class ChargeResult
{
    public function __construct(
        public bool $success,
        public ?string $reference = null,     // payment intent id
        public ?string $failureReason = null,
    ) {}
}
