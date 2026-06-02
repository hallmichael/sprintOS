<?php

use App\Modules\Billing\Http\Controllers\BillingController;
use Illuminate\Support\Facades\Route;

Route::middleware(['auth:sanctum', 'tenant'])->group(function (): void {
    // Read access for any org member.
    Route::get('billing/settings', [BillingController::class, 'settings'])->name('billing.settings');
    Route::get('billing/invoices', [BillingController::class, 'invoices'])->name('billing.invoices');
    Route::get('billing/invoices/{id}', [BillingController::class, 'showInvoice'])->name('billing.invoices.show');

    // Management is org-admin only.
    Route::middleware('tenant.role:admin')->group(function (): void {
        Route::patch('billing/settings', [BillingController::class, 'updateSettings'])->name('billing.settings.update');
        Route::post('billing/card', [BillingController::class, 'addCard'])->name('billing.card');
        Route::post('billing/invoices/generate', [BillingController::class, 'generate'])->name('billing.invoices.generate');
        Route::post('billing/invoices/{id}/charge', [BillingController::class, 'charge'])->name('billing.invoices.charge');
    });
});
