<?php

namespace App\Modules\DataLake;

use Illuminate\Support\ServiceProvider;

/** Registers the DataLake module: bind Service contracts here and load routes. */
class DataLakeServiceProvider extends ServiceProvider
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
