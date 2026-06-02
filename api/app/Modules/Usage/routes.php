<?php

use App\Modules\Usage\Http\Controllers\UsageController;
use Illuminate\Support\Facades\Route;

// Usage reporting (authenticated + tenant-scoped).
Route::middleware(['auth:sanctum', 'tenant'])->group(function (): void {
    Route::get('usage/events', [UsageController::class, 'index'])->name('usage.events');
    Route::get('usage/summary', [UsageController::class, 'summary'])->name('usage.summary');
});
