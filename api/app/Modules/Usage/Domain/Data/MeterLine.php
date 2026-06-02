<?php

namespace App\Modules\Usage\Domain\Data;

/** One metered unit line, e.g. 1500 input_tokens. */
final readonly class MeterLine
{
    public function __construct(
        public string $unit,
        public float $quantity,
    ) {}
}
