<?php

namespace App\Modules\Identity;

use Illuminate\Support\ServiceProvider;

/** Registers the Identity module: bind Service contracts here and load routes. */
class IdentityServiceProvider extends ServiceProvider
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
