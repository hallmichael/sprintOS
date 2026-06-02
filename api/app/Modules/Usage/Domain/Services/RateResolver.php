<?php

namespace App\Modules\Usage\Domain\Services;

use App\Modules\Usage\Domain\Models\UsageRate;

/**
 * Resolves the raw provider unit cost from the deployment rate card.
 * Falls back from a model-specific rate to a model-agnostic one; returns 0 when
 * no rate is configured (the event is still recorded so usage is never lost).
 */
final class RateResolver
{
    /** @var array<string, float> in-request memoisation */
    private array $cache = [];

    public function rawUnitCost(string $service, string $operation, ?string $model, string $unit): float
    {
        $key = implode('|', [$service, $operation, $model ?? '', $unit]);

        return $this->cache[$key] ??= $this->lookup($service, $operation, $model, $unit);
    }

    private function lookup(string $service, string $operation, ?string $model, string $unit): float
    {
        $rate = UsageRate::query()
            ->where('service', $service)
            ->where('operation', $operation)
            ->where('unit', $unit)
            ->where(fn ($q) => $q->where('model', $model)->orWhereNull('model'))
            ->orderByRaw('model is null') // prefer the model-specific row
            ->first();

        return $rate ? (float) $rate->raw_unit_cost : 0.0;
    }
}
