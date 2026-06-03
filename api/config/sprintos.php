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

        // Model tiers → Bedrock inference-profile IDs. The `au.` prefix is the
        // Australia-regional cross-region inference profile (keeps inference in AU
        // regions, required for on-demand Claude in ap-southeast-2). Verified live.
        'tiers' => [
            'fast' => env('AI_MODEL_FAST', 'au.anthropic.claude-haiku-4-5-20251001-v1:0'),
            'balanced' => env('AI_MODEL_BALANCED', 'au.anthropic.claude-sonnet-4-5-20250929-v1:0'),
            'powerful' => env('AI_MODEL_POWERFUL', 'au.anthropic.claude-opus-4-8'),
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

    // ── Data lake ─────────────────────────────────────────────────────────
    'datalake' => [
        // 'fake' (local filesystem + in-memory vectors) or 's3' (AWS S3 + OpenSearch).
        'driver'              => env('DATALAKE_DRIVER', 'fake'),
        'region'              => env('AWS_DATALAKE_REGION', env('AWS_DEFAULT_REGION', 'ap-southeast-2')),
        's3_bucket'           => env('DATALAKE_S3_BUCKET'),
        'opensearch_endpoint' => env('DATALAKE_OPENSEARCH_ENDPOINT'),
        'opensearch_index'    => env('DATALAKE_OPENSEARCH_INDEX', 'sprintos-datalake'),

        // Chunking
        'chunk_max_chars'     => (int) env('DATALAKE_CHUNK_MAX_CHARS', 1500),
        'chunk_overlap_chars' => (int) env('DATALAKE_CHUNK_OVERLAP_CHARS', 200),
    ],
];
