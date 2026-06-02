<?php

use App\Modules\Ai\Http\Controllers\AiController;
use Illuminate\Support\Facades\Route;

Route::middleware(['auth:sanctum', 'tenant'])->group(function (): void {
    Route::get('ai/tiers', [AiController::class, 'tiers'])->name('ai.tiers');
    Route::post('ai/complete', [AiController::class, 'complete'])->name('ai.complete');
});
