<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

/**
 * Per-tenant SSO configuration.
 * Each org can enable one or more OAuth2/OIDC providers.
 * client_secret is stored encrypted (see SsoConfig model cast).
 */
return new class extends Migration
{
    public function up(): void
    {
        Schema::create('sso_configs', function (Blueprint $table): void {
            $table->ulid('id')->primary();
            $table->string('tenant_id', 26);
            $table->foreign('tenant_id')->references('id')->on('tenants')->cascadeOnDelete();

            // Provider slug: google | microsoft | github
            $table->string('provider', 32);

            // OAuth2 application credentials (secret encrypted at rest)
            $table->string('client_id');
            $table->text('client_secret');   // encrypted

            // Microsoft/Azure only: the Entra directory (tenant) ID
            $table->string('azure_tenant_id')->nullable();

            // Extra OAuth2 scopes beyond the provider default
            $table->json('extra_scopes')->nullable();

            $table->boolean('is_enabled')->default(true);
            $table->timestamps();

            // One config per provider per tenant
            $table->unique(['tenant_id', 'provider']);
            $table->index(['tenant_id', 'is_enabled']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('sso_configs');
    }
};
