<?php

namespace App\Modules\Billing;

use Illuminate\Support\ServiceProvider;

/** Billing: markup engine, payment (Stripe), invoices, caps. Reads from the Usage ledger. */
class BillingServiceProvider extends ServiceProvider
{
    public function register(): void {}
    public function boot(): void { $this->loadRoutesFrom(__DIR__ . '/routes.php'); }
}
