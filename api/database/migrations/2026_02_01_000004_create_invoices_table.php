<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('invoices', function (Blueprint $table): void {
            $table->ulid('id')->primary();
            $table->string('tenant_id', 26);
            $table->string('number');                 // human-friendly, unique per tenant

            $table->date('period_start');
            $table->date('period_end');

            // draft → open → paid | failed | void
            $table->string('status', 16)->default('draft');

            $table->decimal('subtotal_raw', 14, 4)->default(0);  // sum of raw provider cost
            $table->decimal('markup_total', 14, 4)->default(0);  // billable - raw
            $table->decimal('total', 14, 4)->default(0);         // billable (what's charged)
            $table->string('currency', 3)->default('AUD');

            $table->string('stripe_invoice_id')->nullable();
            $table->string('stripe_payment_intent_id')->nullable();
            $table->string('failure_reason')->nullable();
            $table->timestamp('paid_at')->nullable();

            $table->timestamps();

            $table->foreign('tenant_id')->references('id')->on('tenants')->cascadeOnDelete();
            $table->unique(['tenant_id', 'number']);
            $table->index(['tenant_id', 'status']);
        });

        Schema::create('invoice_lines', function (Blueprint $table): void {
            $table->ulid('id')->primary();
            $table->string('tenant_id', 26);
            $table->string('invoice_id', 26);

            $table->string('service', 64);
            $table->string('description');
            $table->decimal('quantity', 18, 4)->default(0);
            $table->string('unit', 32)->nullable();
            $table->decimal('raw_cost', 14, 6)->default(0);
            $table->decimal('billable_cost', 14, 6)->default(0);

            $table->timestamps();

            $table->foreign('tenant_id')->references('id')->on('tenants')->cascadeOnDelete();
            $table->foreign('invoice_id')->references('id')->on('invoices')->cascadeOnDelete();
            $table->index(['tenant_id', 'invoice_id']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('invoice_lines');
        Schema::dropIfExists('invoices');
    }
};
