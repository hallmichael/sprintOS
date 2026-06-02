<?php

namespace App\Providers;

use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Http\Resources\Json\JsonResource;
use Illuminate\Support\ServiceProvider;

class AppServiceProvider extends ServiceProvider
{
    public function register(): void {}

    public function boot(): void
    {
        // sprintOS is a pure API — disable the default `data` wrapper on JSON resources
        // so the frontend receives flat objects, not nested `{ "data": {...} }` shapes.
        JsonResource::withoutWrapping();

        // Models live under app/Modules/**/Domain/Models but factories live flat in
        // database/factories. Map "...\Models\User" → "Database\Factories\UserFactory".
        Factory::guessFactoryNamesUsing(
            fn (string $model) => 'Database\\Factories\\'.class_basename($model).'Factory',
        );
    }
}
