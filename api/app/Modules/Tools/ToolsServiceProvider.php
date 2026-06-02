<?php

namespace App\Modules\Tools;

use Illuminate\Support\ServiceProvider;

/** Registers the Tools module: bind Service contracts here and load routes. */
class ToolsServiceProvider extends ServiceProvider
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
