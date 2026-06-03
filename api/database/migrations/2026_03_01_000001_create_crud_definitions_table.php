<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

/**
 * Entity definitions stored as METADATA (not generated code) — fields, types,
 * validation, version. The dynamic CRUD engine reads these at request time.
 */
return new class extends Migration
{
    public function up(): void
    {
        Schema::create('crud_definitions', function (Blueprint $table): void {
            $table->ulid('id')->primary();
            $table->string('tenant_id', 26);

            $table->string('key', 64);            // url-safe entity slug, unique per org
            $table->string('name');               // singular, e.g. "Customer"
            $table->string('name_plural');        // e.g. "Customers"
            $table->json('fields');               // [{ key, label, type, required, options? }]
            $table->boolean('is_published')->default(true);
            $table->unsignedInteger('version')->default(1);
            $table->timestamps();

            $table->foreign('tenant_id')->references('id')->on('tenants')->cascadeOnDelete();
            $table->unique(['tenant_id', 'key']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('crud_definitions');
    }
};
