<?php

use App\Modules\Tenancy\Http\Controllers\TenantController;
use Illuminate\Support\Facades\Route;

// ── Organisation (tenant) management ─────────────────────────────────────
// Creating tenants is a deployment-admin action (no tenant scope required).
Route::middleware('auth:sanctum')->group(function (): void {
    Route::get('tenants', [TenantController::class, 'index'])->name('tenants.index');
    Route::post('tenants', [TenantController::class, 'store'])->name('tenants.store');
    Route::get('tenants/{tenant}', [TenantController::class, 'show'])->name('tenants.show');
    Route::patch('tenants/{tenant}', [TenantController::class, 'update'])->name('tenants.update');
});
