<?php

namespace App\Modules\Ai;

use App\Modules\Ai\Domain\Contracts\ModelClient;
use App\Modules\Ai\Domain\Services\BedrockModelClient;
use App\Modules\Ai\Domain\Services\FakeModelClient;
use Illuminate\Support\Facades\Route;
use Illuminate\Support\ServiceProvider;

class AiServiceProvider extends ServiceProvider
{
    public function register(): void
    {
        // Single model driver per deployment. Fake by default (tests/local);
        // Bedrock when AI_DRIVER=bedrock. Singleton so the fake can be scripted.
        $this->app->singleton(ModelClient::class, function () {
            return config('sprintos.ai.driver') === 'bedrock'
                ? new BedrockModelClient
                : new FakeModelClient;
        });
    }

    public function boot(): void
    {
        Route::middleware('api')->prefix('api')->group(__DIR__.'/routes.php');
    }
}
