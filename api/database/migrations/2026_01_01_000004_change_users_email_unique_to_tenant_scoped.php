<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

/**
 * A sprintOS deployment is multi-tenant.
 * The same email address may legitimately appear in two different organisations
 * (e.g. a consultant who belongs to multiple client orgs).
 * Replace the global email uniqueness constraint with a per-tenant one.
 */
return new class extends Migration
{
    public function up(): void
    {
        Schema::table('users', function (Blueprint $table): void {
            $table->dropUnique(['email']);
            $table->unique(['tenant_id', 'email']);
        });
    }

    public function down(): void
    {
        Schema::table('users', function (Blueprint $table): void {
            $table->dropUnique(['tenant_id', 'email']);
            $table->unique(['email']);
        });
    }
};
