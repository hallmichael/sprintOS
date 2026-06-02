<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

/**
 * Append-only ledger of every paid third-party call. Source of truth for both
 * billing and reconciliation against provider invoices. One row per metered unit
 * line (e.g. a Claude call writes an input_tokens row and an output_tokens row).
 */
return new class extends Migration
{
    public function up(): void
    {
        Schema::create('usage_events', function (Blueprint $table): void {
            $table->ulid('id')->primary();
            $table->string('tenant_id', 26);

            // Who/what incurred the cost.
            $table->string('actor_type', 32)->default('system'); // user | agent | system
            $table->string('actor_id', 26)->nullable();

            // What was consumed.
            $table->string('service', 64);     // bedrock | maps | sms | email
            $table->string('provider', 64)->nullable();
            $table->string('operation', 64);   // chat | embed | geocode
            $table->string('model', 128)->nullable();
            $table->string('unit', 32);        // input_tokens | output_tokens | request
            $table->decimal('quantity', 18, 4);

            // Costing (raw provider cost + marked-up billable cost).
            $table->decimal('raw_cost', 16, 8)->default(0);
            $table->decimal('markup_rate', 6, 4)->default(0);   // snapshot at write time
            $table->decimal('billable_cost', 16, 8)->default(0);
            $table->string('currency', 3)->default('USD');

            // Traceability: links back to the originating request / agent run.
            $table->string('correlation_id', 64)->nullable();
            $table->json('metadata')->nullable();

            // Set once rolled into an invoice (null = unbilled).
            $table->string('invoice_id', 26)->nullable();

            $table->timestamp('created_at')->nullable();

            $table->foreign('tenant_id')->references('id')->on('tenants')->cascadeOnDelete();
            $table->index(['tenant_id', 'created_at']);
            $table->index(['tenant_id', 'service']);
            $table->index(['tenant_id', 'invoice_id']);
            $table->index('correlation_id');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('usage_events');
    }
};
