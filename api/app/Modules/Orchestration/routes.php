<?php
// Orchestration module routes. Registered by OrchestrationServiceProvider, prefixed under /api.
use Illuminate\Support\Facades\Route;

Route::middleware(['auth:sanctum', 'tenant'])->group(function () {
    // Route::get('/orchestration', ...);
});
