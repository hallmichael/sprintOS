<?php

namespace App\Modules\Identity;

use App\Modules\Identity\Domain\Models\User;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Event;
use Illuminate\Support\Facades\Route;
use Illuminate\Support\ServiceProvider;
use SocialiteProviders\Manager\SocialiteWasCalled;
use SocialiteProviders\Azure\Provider as AzureProvider;

class IdentityServiceProvider extends ServiceProvider
{
    public function register(): void {}

    public function boot(): void
    {
        // Use the module's User model as the default Eloquent auth provider.
        Auth::provider('eloquent', fn ($app, $config) => new \Illuminate\Auth\EloquentUserProvider($app['hash'], User::class));

        // Register the Microsoft Azure (Entra ID) Socialite provider.
        Event::listen(SocialiteWasCalled::class, function (SocialiteWasCalled $event): void {
            $event->extendSocialite('azure', AzureProvider::class);
        });

        Route::middleware('api')
            ->prefix('api')
            ->group(__DIR__.'/routes.php');
    }
}
