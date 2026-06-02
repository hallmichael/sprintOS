<?php

/**
 * SSO — OAuth2/OIDC login tests.
 *
 * We never hit real IdP URLs. Instead we use Laravel Socialite's built-in
 * AbstractUser fake and mock the driver via the Socialite facade.
 */

use App\Modules\Identity\Domain\Models\SsoConfig;
use App\Modules\Identity\Domain\Models\User;
use App\Modules\Tenancy\Domain\Models\Tenant;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Laravel\Socialite\Contracts\Factory as SocialiteFactory;
use Laravel\Socialite\Two\AbstractProvider;
use Laravel\Socialite\Two\User as SocialiteUser;
use Mockery\MockInterface;

uses(RefreshDatabase::class);

// ── Shared fixtures ───────────────────────────────────────────────────────

beforeEach(function (): void {
    $this->tenant = Tenant::create(['name' => 'Acme', 'slug' => 'acme']);

    $this->googleConfig = SsoConfig::withoutGlobalScopes()->create([
        'tenant_id'     => $this->tenant->id,
        'provider'      => 'google',
        'client_id'     => 'google-client-id',
        'client_secret' => 'google-secret',
        'is_enabled'    => true,
    ]);
});

// ── Helper: mock Socialite to return a fake OAuth user ────────────────────
function mockSocialiteUser(string $driver, string $email, string $name): void
{
    $fakeUser = (new SocialiteUser)->map([
        'id'       => 'oauth-uid-123',
        'email'    => $email,
        'name'     => $name,
        'nickname' => null,
        'avatar'   => null,
    ]);

    $mockProvider = Mockery::mock(AbstractProvider::class, function (MockInterface $mock) use ($fakeUser): void {
        $mock->shouldReceive('stateless')->andReturnSelf();
        $mock->shouldReceive('scopes')->andReturnSelf();
        $mock->shouldReceive('with')->andReturnSelf();
        $mock->shouldReceive('setConfig')->andReturnSelf();
        $mock->shouldReceive('redirect')->andReturnSelf();
        $mock->shouldReceive('getTargetUrl')->andReturn('https://accounts.google.com/o/oauth2/auth?mock=1');
        $mock->shouldReceive('user')->andReturn($fakeUser);
    });

    $mockSocialite = Mockery::mock(SocialiteFactory::class, function (MockInterface $mock) use ($driver, $mockProvider): void {
        $mock->shouldReceive('driver')->with($driver)->andReturn($mockProvider);
    });

    app()->instance(SocialiteFactory::class, $mockSocialite);
}

// ── Redirect endpoint ─────────────────────────────────────────────────────

it('returns an IdP redirect URL for a configured provider', function (): void {
    mockSocialiteUser('google', 'alice@acme.com', 'Alice');

    $response = $this->getJson('/api/auth/sso/google/redirect?tenant=acme');

    $response->assertOk()
        ->assertJsonStructure(['redirect_url'])
        ->assertJsonPath('redirect_url', fn ($url) => str_contains($url, 'google'));
});

it('returns 404 for an unknown tenant', function (): void {
    $this->getJson('/api/auth/sso/google/redirect?tenant=does-not-exist')
        ->assertNotFound();
});

it('returns 404 when SSO provider is not configured for the tenant', function (): void {
    // microsoft is not configured for this tenant
    $this->getJson('/api/auth/sso/microsoft/redirect?tenant=acme')
        ->assertNotFound();
});

it('returns 422 for an unsupported provider slug', function (): void {
    $this->getJson('/api/auth/sso/twitter/redirect?tenant=acme')
        ->assertUnprocessable();
});

it('returns 404 when SSO config is disabled', function (): void {
    $this->googleConfig->update(['is_enabled' => false]);

    $this->getJson('/api/auth/sso/google/redirect?tenant=acme')
        ->assertNotFound();
});

// ── Callback — auto-provisioning (ADR 0005) ───────────────────────────────

it('creates a global user + org membership on first SSO login', function (): void {
    mockSocialiteUser('google', 'alice@acme.com', 'Alice Smith');

    $this->getJson('/api/auth/sso/google/callback?state=acme|csrf-token&code=fake-code')
        ->assertOk()
        ->assertJsonStructure(['token']);

    $user = User::where('email', 'alice@acme.com')->first();

    expect($user)->not->toBeNull()
        ->and($user->email_verified_at)->not->toBeNull()
        ->and($user->memberOf($this->tenant->id))->toBeTrue()
        ->and($user->roleIn($this->tenant->id))->toBe('member');
});

it('reuses the existing identity and preserves their role', function (): void {
    $existing = makeUser($this->tenant->id, 'admin', ['email' => 'alice@acme.com']);

    mockSocialiteUser('google', 'alice@acme.com', 'Alice Smith');

    $this->getJson('/api/auth/sso/google/callback?state=acme|csrf-token&code=fake-code')
        ->assertOk();

    // Still exactly one global user; the pre-existing admin role is preserved.
    expect(User::where('email', 'alice@acme.com')->count())->toBe(1)
        ->and($existing->fresh()->roleIn($this->tenant->id))->toBe('admin');
});

// ── Shared identity across orgs ────────────────────────────────────────────

it('SSO into a second org adds a membership to the same identity', function (): void {
    $orgB = Tenant::create(['name' => 'Other Corp', 'slug' => 'other-corp']);

    // Bob already belongs to org B.
    $bob = makeUser($orgB->id, 'member', ['email' => 'bob@othercorp.com']);

    // Bob's Google account now SSOs into acme.
    mockSocialiteUser('google', 'bob@othercorp.com', 'Bob');

    $this->getJson('/api/auth/sso/google/callback?state=acme|csrf-token&code=fake-code')
        ->assertOk();

    // One identity, two memberships; org B membership untouched.
    expect(User::where('email', 'bob@othercorp.com')->count())->toBe(1)
        ->and($bob->fresh()->memberOf($this->tenant->id))->toBeTrue()
        ->and($bob->fresh()->memberOf($orgB->id))->toBeTrue();
});

// ── SSO Config admin CRUD (org-admin gated) ───────────────────────────────

it('org admin can list SSO configs for their org', function (): void {
    $admin = makeUser($this->tenant->id, 'admin', ['email' => 'admin@acme.com']);

    $this->actingAs($admin)
        ->getJson('/api/sso-configs')
        ->assertOk()
        ->assertJsonCount(1);
});

it('org admin can create an SSO config', function (): void {
    $admin = makeUser($this->tenant->id, 'admin', ['email' => 'admin@acme.com']);

    $this->actingAs($admin)
        ->postJson('/api/sso-configs', [
            'provider'      => 'github',
            'client_id'     => 'gh-client',
            'client_secret' => 'gh-secret',
        ])->assertCreated()
        ->assertJsonPath('provider', 'github')
        ->assertJsonMissing(['client_secret']);
});

it('org member cannot manage SSO configs', function (): void {
    $member = makeUser($this->tenant->id, 'member', ['email' => 'member@acme.com']);

    $this->actingAs($member)
        ->getJson('/api/sso-configs')
        ->assertForbidden();
});
