<?php

namespace App\Modules\Tenancy;

use App\Modules\Tenancy\Domain\Services\TenantContext;
use Illuminate\Support\Facades\Route;
use Illuminate\Support\ServiceProvider;

class TenancyServiceProvider extends ServiceProvider
{
    public function register(): void
    {
        // One scoped instance per request, accessible by either key.
        $this->app->scoped(TenantContext::class);
        $this->app->alias(TenantContext::class, 'tenant.context');
    }

    public function boot(): void
    {
        Route::middleware('api')
            ->prefix('api')
            ->group(__DIR__.'/routes.php');
    }
}
