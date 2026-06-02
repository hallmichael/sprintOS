<?php

return [

    /*
    |--------------------------------------------------------------------------
    | Third Party Services
    |--------------------------------------------------------------------------
    |
    | This file is for storing the credentials for third party services such
    | as Mailgun, Postmark, AWS and more. This file provides the de facto
    | location for this type of information, allowing packages to have
    | a conventional file to locate the various service credentials.
    |
    */

    'postmark' => [
        'key' => env('POSTMARK_API_KEY'),
    ],

    'resend' => [
        'key' => env('RESEND_API_KEY'),
    ],

    'ses' => [
        'key' => env('AWS_ACCESS_KEY_ID'),
        'secret' => env('AWS_SECRET_ACCESS_KEY'),
        'region' => env('AWS_DEFAULT_REGION', 'us-east-1'),
    ],

    'slack' => [
        'notifications' => [
            'bot_user_oauth_token' => env('SLACK_BOT_USER_OAUTH_TOKEN'),
            'channel' => env('SLACK_BOT_USER_DEFAULT_CHANNEL'),
        ],
    ],

    /*
    |--------------------------------------------------------------------------
    | SSO / OAuth2 Providers (sprintOS)
    |--------------------------------------------------------------------------
    | Credentials are stored per-tenant in the sso_configs table and injected
    | into Socialite dynamically at request time. These stubs satisfy Socialite's
    | config-presence checks; they are never used for real requests.
    */

    'google' => [
        'client_id'     => env('SSO_GOOGLE_CLIENT_ID', 'placeholder'),
        'client_secret' => env('SSO_GOOGLE_CLIENT_SECRET', 'placeholder'),
        'redirect'      => '/api/auth/sso/google/callback',
    ],

    'github' => [
        'client_id'     => env('SSO_GITHUB_CLIENT_ID', 'placeholder'),
        'client_secret' => env('SSO_GITHUB_CLIENT_SECRET', 'placeholder'),
        'redirect'      => '/api/auth/sso/github/callback',
    ],

    'azure' => [
        'client_id'     => env('SSO_AZURE_CLIENT_ID', 'placeholder'),
        'client_secret' => env('SSO_AZURE_CLIENT_SECRET', 'placeholder'),
        'redirect'      => '/api/auth/sso/microsoft/callback',
        'tenant'        => env('SSO_AZURE_TENANT_ID', 'common'),
    ],

];
