<?php

return [
    // Allow the SPA (and the local preview harness) to call the API cross-origin.
    'paths' => ['api/*'],
    'allowed_methods' => ['*'],
    'allowed_origins' => ['*'],            // token (Bearer) auth — no cookies, so * is safe
    'allowed_origins_patterns' => [],
    'allowed_headers' => ['*'],
    'exposed_headers' => [],
    'max_age' => 0,
    'supports_credentials' => false,
];
