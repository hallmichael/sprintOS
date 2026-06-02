<?php

namespace App\Modules\Identity\Http\Controllers;

use App\Modules\Identity\Domain\Actions\HandleSsoCallbackAction;
use App\Modules\Identity\Domain\Models\SsoConfig;
use App\Modules\Tenancy\Domain\Models\Tenant;
use App\Shared\Http\Controller;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Laravel\Socialite\Facades\Socialite;
use SocialiteProviders\Manager\Config as SocialiteConfig;
use Symfony\Component\HttpKernel\Exception\NotFoundHttpException;

/**
 * SSO redirect + callback for OAuth2/OIDC providers.
 *
 * Flow:
 *   1. Frontend calls GET /api/auth/sso/{provider}/redirect?tenant={slug}
 *      → We look up the SsoConfig, configure Socialite dynamically from the DB,
 *        store the tenant slug in the OAuth state param, and redirect to the IdP.
 *
 *   2. IdP sends the user back to GET /api/auth/sso/{provider}/callback?state=...
 *      → We read the tenant slug back from the OAuth state, handle the user,
 *        and return a Sanctum token (JSON for SPAs, or redirect for native apps).
 *
 * NOTE: These endpoints run before the user is authenticated, so they bypass
 * the BelongsToTenant global scope intentionally via withoutGlobalScopes().
 */
final class SsoController extends Controller
{
    public function __construct(
        private readonly HandleSsoCallbackAction $handleCallback,
    ) {}

    /**
     * GET /api/auth/sso/{provider}/redirect?tenant={slug}
     * Validates the provider + tenant, configures Socialite, returns the IdP URL.
     */
    public function redirect(Request $request, string $provider): JsonResponse
    {
        $config = $this->resolveConfig($request->query('tenant', ''), $provider);

        $this->configureSocialite($config);

        // Embed the tenant slug inside the OAuth state so we can recover it in callback.
        $redirectUrl = Socialite::driver($config->socialiteDriver())
            ->with(['state' => $request->query('tenant', '').'|'.csrf_token()])
            ->scopes($config->allScopes())
            ->stateless()
            ->redirect()
            ->getTargetUrl();

        return response()->json(['redirect_url' => $redirectUrl]);
    }

    /**
     * GET /api/auth/sso/{provider}/callback?state=...&code=...
     * Handles the IdP response; returns a Sanctum token.
     */
    public function callback(Request $request, string $provider): JsonResponse
    {
        // Recover the tenant slug from the state param.
        $state = $request->query('state', '');
        $tenantSlug = explode('|', $state)[0];

        $config = $this->resolveConfig($tenantSlug, $provider);
        $this->configureSocialite($config);

        $oauthUser = Socialite::driver($config->socialiteDriver())
            ->stateless()
            ->user();

        $token = $this->handleCallback->execute($config->tenant_id, $provider, $oauthUser);

        return response()->json(['token' => $token]);
    }

    // ── Helpers ───────────────────────────────────────────────────────────

    private function resolveConfig(string $tenantSlug, string $provider): SsoConfig
    {
        abort_if(! in_array($provider, SsoConfig::PROVIDERS, true), 422, "Unknown SSO provider '{$provider}'.");

        $tenant = Tenant::withoutGlobalScopes()
            ->where('slug', $tenantSlug)
            ->where('is_active', true)
            ->first();

        abort_if($tenant === null, 404, "Tenant '{$tenantSlug}' not found.");

        $config = SsoConfig::withoutGlobalScopes()
            ->where('tenant_id', $tenant->id)
            ->where('provider', $provider)
            ->where('is_enabled', true)
            ->first();

        abort_if($config === null, 404, "SSO provider '{$provider}' is not configured for this tenant.");

        return $config;
    }

    /**
     * Configures Socialite with per-tenant credentials from the DB.
     * This overrides any static values in config/services.php for this request.
     */
    private function configureSocialite(SsoConfig $config): void
    {
        $callbackUrl = url("/api/auth/sso/{$config->provider}/callback");

        $extras = match ($config->provider) {
            'microsoft' => ['tenant' => $config->azure_tenant_id ?? 'common'],
            default     => [],
        };

        $socialiteConfig = new SocialiteConfig(
            $config->client_id,
            $config->client_secret,
            $callbackUrl,
            $extras,
        );

        Socialite::driver($config->socialiteDriver())->setConfig($socialiteConfig);
    }
}
