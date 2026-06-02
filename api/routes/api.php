<?php

/**
 * Thin API entrypoint.
 * Each module registers its own routes via its ServiceProvider (routes.php).
 * Do not add feature routes here — keep this file minimal.
 */

use Illuminate\Support\Facades\Route;

// ── Health ────────────────────────────────────────────────────────────────
Route::get('/ping', fn () => response()->json(['status' => 'ok']))->name('ping');
