<?php

namespace App\Modules\Connectors;

use Illuminate\Support\ServiceProvider;

/** Registers the Connectors module: bind Service contracts here and load routes. */
class ConnectorsServiceProvider extends ServiceProvider
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
