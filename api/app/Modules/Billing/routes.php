<?php
// Billing module routes (payment method, invoices, usage). Registered by BillingServiceProvider.
use Illuminate\Support\Facades\Route;

Route::middleware(['auth:sanctum', 'tenant'])->group(function () {
    // Route::get('/billing/usage', ...);
    // Route::post('/billing/payment-method', ...);
});
