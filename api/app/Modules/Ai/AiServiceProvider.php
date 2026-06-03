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
        // Single model driver per deployment. Bedrock is the production default;
        // the fake is a test/local double and is FORBIDDEN in production.
        $this->app->singleton(ModelClient::class, function ($app) {
            if (config('sprintos.ai.driver') === 'fake') {
                if ($app->environment('production')) {
                    throw new \RuntimeException('AI_DRIVER=fake is forbidden in production. Use Bedrock.');
                }

                return new FakeModelClient;
            }

            return new BedrockModelClient;
        });
    }

    public function boot(): void
    {
        Route::middleware('api')->prefix('api')->group(__DIR__.'/routes.php');
    }
}
