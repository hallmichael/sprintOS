<?php

namespace App\Modules\Usage\Domain\Data;

/**
 * Describes one paid third-party call to be metered. Carries one or more
 * MeterLines (units consumed) plus the context needed to cost and trace it.
 */
final readonly class MeterEvent
{
    /**
     * @param  array<int, MeterLine>  $lines
     */
    public function __construct(
        public string $tenantId,
        public string $service,
        public string $operation,
        public array $lines,
        public ?string $model = null,
        public ?string $provider = null,
        public string $actorType = 'system',
        public ?string $actorId = null,
        public ?string $correlationId = null,
        public array $metadata = [],
        public string $currency = 'USD',
    ) {}
}
