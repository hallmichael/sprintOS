<?php

use App\Modules\Identity\Http\Controllers\AuthController;
use App\Modules\Identity\Http\Controllers\SsoConfigController;
use App\Modules\Identity\Http\Controllers\SsoController;
use App\Modules\Identity\Http\Controllers\UserController;
use Illuminate\Support\Facades\Route;

// ── Standard auth (email + password) ─────────────────────────────────────
Route::prefix('auth')->name('auth.')->group(function (): void {
    Route::post('register', [AuthController::class, 'register'])->name('register');
    Route::post('login', [AuthController::class, 'login'])->name('login');

    Route::middleware('auth:sanctum')->group(function (): void {
        Route::post('logout', [AuthController::class, 'logout'])->name('logout');
        Route::get('me', [AuthController::class, 'me'])->name('me');
    });

    // ── SSO / OAuth2 (unauthenticated — user is logging in) ──────────────
    Route::prefix('sso/{provider}')->name('sso.')->group(function (): void {
        Route::get('redirect', [SsoController::class, 'redirect'])->name('redirect');
        Route::get('callback', [SsoController::class, 'callback'])->name('callback');
    });
});

// ── User management within the active org (authenticated + tenant-scoped) ──
Route::middleware(['auth:sanctum', 'tenant'])->group(function (): void {
    Route::get('users', [UserController::class, 'index'])->name('users.index');
    Route::get('users/{id}', [UserController::class, 'show'])->name('users.show');

    // Mutations require the org-level admin role.
    Route::middleware('tenant.role:admin')->group(function (): void {
        Route::put('users/{id}/roles', [UserController::class, 'assignRole'])->name('users.roles');
        Route::delete('users/{id}', [UserController::class, 'destroy'])->name('users.destroy');
    });
});

// ── SSO config management (org admin, tenant-scoped) ──────────────────────
Route::middleware(['auth:sanctum', 'tenant', 'tenant.role:admin'])->group(function (): void {
    Route::get('sso-configs', [SsoConfigController::class, 'index'])->name('sso-configs.index');
    Route::post('sso-configs', [SsoConfigController::class, 'store'])->name('sso-configs.store');
    Route::get('sso-configs/{id}', [SsoConfigController::class, 'show'])->name('sso-configs.show');
    Route::patch('sso-configs/{id}', [SsoConfigController::class, 'update'])->name('sso-configs.update');
    Route::delete('sso-configs/{id}', [SsoConfigController::class, 'destroy'])->name('sso-configs.destroy');
});
