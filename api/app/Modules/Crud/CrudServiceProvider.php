<?php

namespace App\Modules\Crud;

use Illuminate\Support\Facades\Route;
use Illuminate\Support\ServiceProvider;

class CrudServiceProvider extends ServiceProvider
{
    public function register(): void {}

    public function boot(): void
    {
        Route::middleware('api')->prefix('api')->group(__DIR__.'/routes.php');
    }
}
