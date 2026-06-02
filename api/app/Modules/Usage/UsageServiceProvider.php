<?php

namespace App\Modules\Usage;

use Illuminate\Support\ServiceProvider;

/** Registers the Usage module: bind Service contracts here and load routes. */
class UsageServiceProvider extends ServiceProvider
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
