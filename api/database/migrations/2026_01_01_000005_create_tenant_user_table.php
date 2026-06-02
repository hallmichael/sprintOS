<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

/**
 * Membership pivot: which users belong to which organisations, and their
 * org-level role. A user may belong to many orgs; an org has many users.
 * See ADR 0005.
 */
return new class extends Migration
{
    public function up(): void
    {
        Schema::create('tenant_user', function (Blueprint $table): void {
            $table->ulid('id')->primary();
            $table->string('tenant_id', 26);
            $table->string('user_id', 26);

            // Org-level role for this membership: admin | member | viewer
            $table->string('role', 32)->default('member');

            $table->timestamps();

            $table->foreign('tenant_id')->references('id')->on('tenants')->cascadeOnDelete();
            $table->foreign('user_id')->references('id')->on('users')->cascadeOnDelete();

            // A user has at most one membership row per org.
            $table->unique(['tenant_id', 'user_id']);
            $table->index('user_id');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('tenant_user');
    }
};
