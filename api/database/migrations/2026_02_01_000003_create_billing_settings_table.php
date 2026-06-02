<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

/**
 * Per-org billing configuration: markup, currency, cycle, spend cap and the
 * tokenised Stripe payment method (no PAN ever stored — only Stripe ids + last4).
 */
return new class extends Migration
{
    public function up(): void
    {
        Schema::create('billing_settings', function (Blueprint $table): void {
            $table->ulid('id')->primary();
            $table->string('tenant_id', 26);

            $table->decimal('markup_rate', 6, 4)->default(0.30);
            $table->string('currency', 3)->default('AUD');
            $table->string('billing_cycle', 16)->default('monthly');

            // Optional hard spend cap (billable) per cycle; null = uncapped.
            $table->decimal('spend_cap', 14, 2)->nullable();
            $table->decimal('alert_threshold', 5, 4)->nullable(); // e.g. 0.80 = alert at 80%

            // Tokenised card (Stripe) — no card number is ever stored.
            $table->string('stripe_customer_id')->nullable();
            $table->string('stripe_payment_method_id')->nullable();
            $table->string('card_brand', 32)->nullable();
            $table->string('card_last4', 4)->nullable();

            $table->timestamps();

            $table->foreign('tenant_id')->references('id')->on('tenants')->cascadeOnDelete();
            $table->unique('tenant_id');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('billing_settings');
    }
};
