<?php

namespace App\Modules\Billing\Domain\Exceptions;

use RuntimeException;

/**
 * Thrown when an org has reached its spend cap and a further paid call is blocked.
 * Rendered as HTTP 402 Payment Required.
 */
final class SpendCapExceeded extends RuntimeException
{
    public function __construct(public readonly string $tenantId, public readonly float $cap)
    {
        parent::__construct("Spend cap of {$cap} reached for this organisation.");
    }

    public function status(): int
    {
        return 402;
    }
}
