<?php

namespace App\Modules\Tools;

use App\Modules\DataLake\Domain\Tools\RagSearchTool;
use App\Modules\Tools\Domain\Handlers\CalculatorHandler;
use App\Modules\Tools\Domain\Services\ToolRegistry;
use Illuminate\Support\Facades\Route;
use Illuminate\Support\ServiceProvider;

class ToolsServiceProvider extends ServiceProvider
{
    /**
     * Built-in tool handlers: handler-key → implementation.
     * The Crud, DataLake and Orchestration modules register more here later.
     */
    private const HANDLERS = [
        'calculator' => CalculatorHandler::class,
        'rag_search' => RagSearchTool::class,    // Phase 4 — data lake retrieval
    ];

    public function register(): void
    {
        $this->app->singleton(ToolRegistry::class, fn () => new ToolRegistry(self::HANDLERS));
    }

    public function boot(): void
    {
        Route::middleware('api')->prefix('api')->group(__DIR__.'/routes.php');
    }
}
