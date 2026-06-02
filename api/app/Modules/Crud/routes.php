<?php
// Crud module routes. Registered by CrudServiceProvider, prefixed under /api.
use Illuminate\Support\Facades\Route;

Route::middleware(['auth:sanctum', 'tenant'])->group(function () {
    // Route::get('/crud', ...);
});
