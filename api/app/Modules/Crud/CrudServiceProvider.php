<?php

namespace App\Modules\Crud;

use Illuminate\Support\ServiceProvider;

/** Registers the Crud module: bind Service contracts here and load routes. */
class CrudServiceProvider extends ServiceProvider
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
