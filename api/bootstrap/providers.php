<?php

use App\Providers\AppServiceProvider;

return [
    AppServiceProvider::class,

    // ── Modules ──────────────────────────────────────────────────────────────
    App\Modules\Tenancy\TenancyServiceProvider::class,
    App\Modules\Identity\IdentityServiceProvider::class,
    App\Modules\Ai\AiServiceProvider::class,
    App\Modules\Orchestration\OrchestrationServiceProvider::class,
    App\Modules\Agents\AgentsServiceProvider::class,
    App\Modules\Tools\ToolsServiceProvider::class,
    App\Modules\Crud\CrudServiceProvider::class,
    App\Modules\DataLake\DataLakeServiceProvider::class,
    App\Modules\Usage\UsageServiceProvider::class,
    App\Modules\Billing\BillingServiceProvider::class,
    App\Modules\Connectors\ConnectorsServiceProvider::class,
];
