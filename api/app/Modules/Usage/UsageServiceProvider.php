<?php

namespace App\Modules\Usage;

use App\Modules\Usage\Domain\Contracts\MarkupResolver;
use App\Modules\Usage\Domain\Contracts\Meter;
use App\Modules\Usage\Domain\Services\ConfigMarkupResolver;
use App\Modules\Usage\Domain\Services\MeteringService;
use Illuminate\Support\Facades\Route;
use Illuminate\Support\ServiceProvider;

class UsageServiceProvider extends ServiceProvider
{
    public function register(): void
    {
        // Default markup resolver — Billing rebinds this to a tenant-aware one.
        $this->app->bindIf(MarkupResolver::class, ConfigMarkupResolver::class);

        // The single metering entry point.
        $this->app->singleton(Meter::class, MeteringService::class);
    }

    public function boot(): void
    {
        Route::middleware('api')->prefix('api')->group(__DIR__.'/routes.php');
    }
}
