<?php

namespace Database\Seeders;

use App\Modules\Usage\Domain\Models\UsageRate;
use Illuminate\Database\Seeder;

/**
 * Default deployment rate card. Costs are USD per single token (Bedrock list
 * pricing ÷ 1,000,000). Reconcile against the AWS invoice; adjust as pricing moves.
 */
class UsageRateSeeder extends Seeder
{
    public function run(): void
    {
        $rates = [
            // service, operation, model, unit, raw_unit_cost (USD/unit)
            ['bedrock', 'chat', 'anthropic.claude-3-5-haiku-20241022-v1:0',    'input_tokens',  0.0000008],
            ['bedrock', 'chat', 'anthropic.claude-3-5-haiku-20241022-v1:0',    'output_tokens', 0.0000040],
            ['bedrock', 'chat', 'anthropic.claude-3-5-sonnet-20241022-v2:0',   'input_tokens',  0.0000030],
            ['bedrock', 'chat', 'anthropic.claude-3-5-sonnet-20241022-v2:0',   'output_tokens', 0.0000150],
            ['bedrock', 'chat', 'anthropic.claude-3-7-sonnet-20250219-v1:0',   'input_tokens',  0.0000030],
            ['bedrock', 'chat', 'anthropic.claude-3-7-sonnet-20250219-v1:0',   'output_tokens', 0.0000150],
            ['bedrock', 'embed', 'amazon.titan-embed-text-v2:0',               'input_tokens',  0.0000000200],
        ];

        foreach ($rates as [$service, $operation, $model, $unit, $cost]) {
            UsageRate::updateOrCreate(
                compact('service', 'operation', 'model', 'unit'),
                ['raw_unit_cost' => $cost, 'currency' => 'USD'],
            );
        }
    }
}
