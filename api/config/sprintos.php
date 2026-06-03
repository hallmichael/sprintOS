<?php

/**
 * sprintOS deployment configuration.
 * Per-deployment, per-org overrides live in the DB (billing_settings, etc.);
 * this file holds the defaults and the static model/pricing wiring.
 */
return [

    // ── AI gateway (Claude via Amazon Bedrock) ────────────────────────────
    'ai' => [
        // 'bedrock' (production default) or 'fake' (deterministic — tests/local only;
        // forbidden in production by AiServiceProvider).
        'driver' => env('AI_DRIVER', 'bedrock'),

        'region' => env('AWS_BEDROCK_REGION', env('AWS_DEFAULT_REGION', 'ap-southeast-2')),

        // Model tiers → Bedrock model IDs. Route cheap work to 'fast', complex
        // agent reasoning to 'powerful'. Overridable per agent later.
        'tiers' => [
            'fast' => env('AI_MODEL_FAST', 'anthropic.claude-3-5-haiku-20241022-v1:0'),
            'balanced' => env('AI_MODEL_BALANCED', 'anthropic.claude-3-5-sonnet-20241022-v2:0'),
            'powerful' => env('AI_MODEL_POWERFUL', 'anthropic.claude-3-7-sonnet-20250219-v1:0'),
        ],

        'default_tier' => env('AI_DEFAULT_TIER', 'balanced'),

        'embedding_model' => env('AI_EMBED_MODEL', 'amazon.titan-embed-text-v2:0'),

        'max_tokens' => (int) env('AI_MAX_TOKENS', 4096),
    ],

    // ── Billing ───────────────────────────────────────────────────────────
    'billing' => [
        // Default markup applied to raw third-party cost (0.30 = 30%).
        'default_markup' => (float) env('BILLING_DEFAULT_MARKUP', 0.30),
        'currency' => env('BILLING_CURRENCY', 'AUD'),
        'cycle' => env('BILLING_CYCLE', 'monthly'),

        'payments' => [
            // 'stripe' (production default) or 'fake' (tests/local only; forbidden
            // in production by BillingServiceProvider).
            'driver' => env('PAYMENTS_DRIVER', 'stripe'),
            'stripe_key' => env('STRIPE_KEY'),
            'stripe_secret' => env('STRIPE_SECRET'),
            'webhook_secret' => env('STRIPE_WEBHOOK_SECRET'),
        ],
    ],
];
