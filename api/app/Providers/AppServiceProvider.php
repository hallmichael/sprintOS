<?php

namespace App\Providers;

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
    }
}
