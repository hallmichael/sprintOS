<?php
// Ai module routes. Registered by AiServiceProvider, prefixed under /api.
use Illuminate\Support\Facades\Route;

Route::middleware(['auth:sanctum', 'tenant'])->group(function () {
    // Route::get('/llm', ...);
});
