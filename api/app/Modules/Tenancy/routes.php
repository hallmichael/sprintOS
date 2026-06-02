<?php

use App\Modules\Tenancy\Http\Controllers\TenantController;
use Illuminate\Support\Facades\Route;

// ── Organisation (tenant) management ─────────────────────────────────────
// Tenant is not a tenant-scoped model, so each controller method authorises
// access explicitly (platform-admin → all orgs; regular user → own org only).
// String {id} params (not model binding) let foreign-org lookups 404 cleanly.
Route::middleware('auth:sanctum')->group(function (): void {
    Route::get('tenants', [TenantController::class, 'index'])->name('tenants.index');
    Route::post('tenants', [TenantController::class, 'store'])->name('tenants.store');
    Route::get('tenants/{id}', [TenantController::class, 'show'])->name('tenants.show');
    Route::patch('tenants/{id}', [TenantController::class, 'update'])->name('tenants.update');
});
