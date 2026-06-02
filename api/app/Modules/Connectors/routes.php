<?php
// Connectors module routes. Registered by ConnectorsServiceProvider, prefixed under /api.
use Illuminate\Support\Facades\Route;

Route::middleware(['auth:sanctum', 'tenant'])->group(function () {
    // Route::get('/connectors', ...);
});
