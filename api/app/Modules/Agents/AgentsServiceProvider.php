<?php

namespace App\Modules\Agents;

use Illuminate\Support\ServiceProvider;

/** Registers the Agents module: bind Service contracts here and load routes. */
class AgentsServiceProvider extends ServiceProvider
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
