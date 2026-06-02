<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

/**
 * Deployment-wide rate card for metered third-party services.
 * raw_unit_cost is the provider's cost per single unit (e.g. per token).
 * Rates are deployment-global (one customer per deployment), not tenant-scoped.
 */
return new class extends Migration
{
    public function up(): void
    {
        Schema::create('usage_rates', function (Blueprint $table): void {
            $table->ulid('id')->primary();
            $table->string('service', 64);            // bedrock | maps | sms | email | embeddings
            $table->string('operation', 64);          // chat | embed | geocode | send
            $table->string('model', 128)->nullable(); // bedrock model id, when applicable
            $table->string('unit', 32);               // input_tokens | output_tokens | request | message
            $table->decimal('raw_unit_cost', 16, 10); // provider cost per single unit
            $table->string('currency', 3)->default('USD');
            $table->timestamps();

            $table->unique(['service', 'operation', 'model', 'unit'], 'usage_rates_lookup_unique');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('usage_rates');
    }
};
