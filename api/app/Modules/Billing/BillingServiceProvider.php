<?php

namespace App\Modules\Billing;

use App\Modules\Billing\Console\RunBillingCycleCommand;
use App\Modules\Billing\Domain\Contracts\PaymentGateway;
use App\Modules\Billing\Domain\Services\FakePaymentGateway;
use App\Modules\Billing\Domain\Services\StripePaymentGateway;
use App\Modules\Billing\Domain\Services\TenantMarkupResolver;
use App\Modules\Usage\Domain\Contracts\MarkupResolver;
use Illuminate\Support\Facades\Route;
use Illuminate\Support\ServiceProvider;

/** Billing: markup engine, payment (Stripe), invoices, caps. Reads from the Usage ledger. */
class BillingServiceProvider extends ServiceProvider
{
    public function register(): void
    {
        // Rebind the Usage markup port to the tenant-aware resolver (Billing owns
        // the markup rate). This hard bind overrides Usage's bindIf default.
        $this->app->bind(MarkupResolver::class, TenantMarkupResolver::class);

        // Payment processor: Stripe is the production default; the fake is a
        // test/local double and is FORBIDDEN in production.
        $this->app->bind(PaymentGateway::class, function ($app) {
            if (config('sprintos.billing.payments.driver') === 'fake') {
                if ($app->environment('production')) {
                    throw new \RuntimeException('PAYMENTS_DRIVER=fake is forbidden in production. Use Stripe.');
                }

                return new FakePaymentGateway;
            }

            return new StripePaymentGateway;
        });
    }

    public function boot(): void
    {
        Route::middleware('api')->prefix('api')->group(__DIR__.'/routes.php');

        if ($this->app->runningInConsole()) {
            $this->commands([RunBillingCycleCommand::class]);
        }
    }
}
