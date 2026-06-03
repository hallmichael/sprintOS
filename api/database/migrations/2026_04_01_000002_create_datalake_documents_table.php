<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

/**
 * One ingested document (file, page, record) per row.
 * The actual text chunks live in the vector store (OpenSearch/fake);
 * this table is the system-of-record for provenance, roles and sync state.
 */
return new class extends Migration
{
    public function up(): void
    {
        Schema::create('datalake_documents', function (Blueprint $table): void {
            $table->ulid('id')->primary();
            $table->string('tenant_id', 26);
            $table->string('source_id', 26);

            $table->string('title');
            // Path in the storage driver (e.g. S3 key or local path)
            $table->string('storage_key')->nullable();
            $table->string('mime_type', 64)->nullable();
            $table->unsignedBigInteger('size_bytes')->default(0);

            // Role tags that restrict retrieval: admin | member | viewer | public
            // A user can only retrieve documents whose role_tags ⊆ their roles.
            $table->json('role_tags')->nullable();   // e.g. ["member","admin"]

            // pending | indexing | indexed | failed
            $table->string('status', 16)->default('pending');
            $table->text('error')->nullable();
            $table->unsignedInteger('chunk_count')->default(0);

            $table->json('metadata')->nullable();   // source-specific (drive file id, etag, etc.)
            $table->timestamps();
            $table->softDeletes();

            $table->foreign('tenant_id')->references('id')->on('tenants')->cascadeOnDelete();
            $table->foreign('source_id')->references('id')->on('datalake_sources')->cascadeOnDelete();

            $table->index(['tenant_id', 'status']);
            $table->index(['tenant_id', 'source_id']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('datalake_documents');
    }
};
