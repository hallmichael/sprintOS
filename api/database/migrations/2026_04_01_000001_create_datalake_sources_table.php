<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

/**
 * A data source: where documents come from (upload, OneDrive, Google Drive, API).
 * The ingestion worker polls or reacts to sources to keep the vector index current.
 */
return new class extends Migration
{
    public function up(): void
    {
        Schema::create('datalake_sources', function (Blueprint $table): void {
            $table->ulid('id')->primary();
            $table->string('tenant_id', 26);

            $table->string('name');
            // upload | onedrive | googledrive | api
            $table->string('type', 32)->default('upload');
            // encrypted connector config (OAuth tokens, API keys, folder paths)
            $table->text('config')->nullable();
            // pending | active | error
            $table->string('status', 16)->default('active');
            $table->timestamp('last_synced_at')->nullable();
            // cursor for incremental sync (delta token, page token, etc.)
            $table->text('cursor')->nullable();

            $table->timestamps();

            $table->foreign('tenant_id')->references('id')->on('tenants')->cascadeOnDelete();
            $table->index(['tenant_id', 'status']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('datalake_sources');
    }
};
