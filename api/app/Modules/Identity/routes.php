<?php

use App\Modules\Identity\Http\Controllers\AuthController;
use App\Modules\Identity\Http\Controllers\UserController;
use Illuminate\Support\Facades\Route;

// ── Public auth endpoints ─────────────────────────────────────────────────
Route::prefix('auth')->name('auth.')->group(function (): void {
    Route::post('register', [AuthController::class, 'register'])->name('register');
    Route::post('login', [AuthController::class, 'login'])->name('login');

    Route::middleware('auth:sanctum')->group(function (): void {
        Route::post('logout', [AuthController::class, 'logout'])->name('logout');
        Route::get('me', [AuthController::class, 'me'])->name('me');
    });
});

// ── User management (authenticated + tenant-scoped) ───────────────────────
// We use string {id} params (not model binding) so tenant middleware runs first
// and the BelongsToTenant global scope is active when we query inside the controller.
Route::middleware(['auth:sanctum', 'tenant'])->group(function (): void {
    Route::get('users', [UserController::class, 'index'])->name('users.index');
    Route::get('users/{id}', [UserController::class, 'show'])->name('users.show');
    Route::put('users/{id}/roles', [UserController::class, 'assignRole'])->name('users.roles');
    Route::delete('users/{id}', [UserController::class, 'destroy'])->name('users.destroy');
});
