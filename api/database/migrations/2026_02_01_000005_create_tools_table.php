<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

/**
 * Registry of permissioned tools exposed to agents via Bedrock tool-use.
 * Each row binds a tool key + JSON schema to a registered handler.
 */
return new class extends Migration
{
    public function up(): void
    {
        Schema::create('tools', function (Blueprint $table): void {
            $table->ulid('id')->primary();
            $table->string('tenant_id', 26);

            $table->string('key', 64);            // unique per org; the model-facing name
            $table->string('name');
            $table->text('description');
            $table->json('input_schema');         // JSON Schema for the tool args
            $table->string('handler', 64);        // registered handler key
            $table->boolean('is_enabled')->default(true);
            $table->timestamps();

            $table->foreign('tenant_id')->references('id')->on('tenants')->cascadeOnDelete();
            $table->unique(['tenant_id', 'key']);
            $table->index(['tenant_id', 'is_enabled']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('tools');
    }
};
