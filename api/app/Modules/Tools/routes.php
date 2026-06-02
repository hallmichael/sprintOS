<?php

use App\Modules\Tools\Http\Controllers\ToolController;
use Illuminate\Support\Facades\Route;

Route::middleware(['auth:sanctum', 'tenant'])->group(function (): void {
    Route::get('tools', [ToolController::class, 'index'])->name('tools.index');

    Route::middleware('tenant.role:admin')->group(function (): void {
        Route::post('tools', [ToolController::class, 'store'])->name('tools.store');
        Route::post('tools/{key}/invoke', [ToolController::class, 'invoke'])->name('tools.invoke');
    });
});
