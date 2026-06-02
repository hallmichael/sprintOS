<?php
// Tools module routes. Registered by ToolsServiceProvider, prefixed under /api.
use Illuminate\Support\Facades\Route;

Route::middleware(['auth:sanctum', 'tenant'])->group(function () {
    // Route::get('/tools', ...);
});
