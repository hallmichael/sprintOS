<?php

namespace App\Modules\Identity;

use App\Modules\Identity\Domain\Models\User;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Route;
use Illuminate\Support\ServiceProvider;

class IdentityServiceProvider extends ServiceProvider
{
    public function register(): void {}

    public function boot(): void
    {
        // Use our module's User model as the default auth model.
        Auth::provider('eloquent', fn ($app, $config) => new \Illuminate\Auth\EloquentUserProvider($app['hash'], User::class));

        Route::middleware('api')
            ->prefix('api')
            ->group(__DIR__.'/routes.php');
    }
}
