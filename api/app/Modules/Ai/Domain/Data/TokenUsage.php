<?php

namespace App\Modules\Ai\Domain\Data;

/** Token counts returned by the model, used to meter the call. */
final readonly class TokenUsage
{
    public function __construct(
        public int $inputTokens,
        public int $outputTokens,
    ) {}
}
