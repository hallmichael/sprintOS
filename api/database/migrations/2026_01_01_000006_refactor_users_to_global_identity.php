<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

/**
 * Shared global identity (ADR 0005): a user is no longer pinned to one org.
 * Drop users.tenant_id (org membership now lives in tenant_user) and restore
 * a deployment-wide unique email.
 */
return new class extends Migration
{
    public function up(): void
    {
        Schema::table('users', function (Blueprint $table): void {
            // Was unique(['tenant_id','email']) and index(['tenant_id','email']).
            $table->dropUnique(['tenant_id', 'email']);
            $table->dropIndex(['tenant_id', 'email']);
            $table->dropForeign(['tenant_id']);
            $table->dropColumn('tenant_id');

            // Email is globally unique within the deployment.
            $table->unique('email');
        });
    }

    public function down(): void
    {
        Schema::table('users', function (Blueprint $table): void {
            $table->dropUnique(['email']);
            $table->string('tenant_id', 26)->nullable()->after('id');
            $table->foreign('tenant_id')->references('id')->on('tenants')->nullOnDelete();
            $table->index(['tenant_id', 'email']);
            $table->unique(['tenant_id', 'email']);
        });
    }
};
