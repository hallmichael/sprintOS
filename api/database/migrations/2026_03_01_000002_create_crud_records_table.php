<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

/**
 * Stores all dynamic entity rows as JSON. This gives us zero-downtime schema
 * evolution (no ALTER TABLE), instant rollback, and full isolation per tenant.
 * For Phase 3 this is the primary storage; a dedicated-table path (for high-
 * volume entities) is a Phase 6 hardening item.
 */
return new class extends Migration
{
    public function up(): void
    {
        Schema::create('crud_records', function (Blueprint $table): void {
            $table->ulid('id')->primary();
            $table->string('tenant_id', 26);
            $table->string('definition_id', 26);

            $table->json('data');             // the field values

            $table->string('created_by', 26)->nullable();
            $table->timestamps();
            $table->softDeletes();

            $table->foreign('tenant_id')->references('id')->on('tenants')->cascadeOnDelete();
            $table->foreign('definition_id')->references('id')->on('crud_definitions')->cascadeOnDelete();

            $table->index(['tenant_id', 'definition_id']);
            $table->index(['tenant_id', 'definition_id', 'created_at']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('crud_records');
    }
};
