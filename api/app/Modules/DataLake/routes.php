<?php
// DataLake module routes. Registered by DataLakeServiceProvider, prefixed under /api.
use Illuminate\Support\Facades\Route;

Route::middleware(['auth:sanctum', 'tenant'])->group(function () {
    // Route::get('/datalake', ...);
});
