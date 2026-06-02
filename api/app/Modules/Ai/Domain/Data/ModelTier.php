<?php

namespace App\Modules\Ai\Domain\Data;

/**
 * Workload tiers. Cheap/routine work → fast; complex agent reasoning → powerful.
 * Each tier maps to a Bedrock model id in config('sprintos.ai.tiers').
 */
enum ModelTier: string
{
    case Fast = 'fast';
    case Balanced = 'balanced';
    case Powerful = 'powerful';

    public function modelId(): string
    {
        return (string) config("sprintos.ai.tiers.{$this->value}");
    }

    public static function default(): self
    {
        return self::from(config('sprintos.ai.default_tier', 'balanced'));
    }
}
