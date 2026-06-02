<?php

namespace App\Modules\Tenancy;

use Illuminate\Support\ServiceProvider;

/** Registers the Tenancy module: bind Service contracts here and load routes. */
class TenancyServiceProvider extends ServiceProvider
{
    public function register(): void
    {
        // $this->app->bind(Contract::class, Concrete::class);
    }

    public function boot(): void
    {
        $this->loadRoutesFrom(__DIR__ . '/routes.php');
    }
}
