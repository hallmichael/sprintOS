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

// ── Callback — new user auto-provisioning ─────────────────────────────────

it('creates a new user and returns a token on first SSO login', function (): void {
    mockSocialiteUser('google', 'alice@acme.com', 'Alice Smith');

    $response = $this->getJson('/api/auth/sso/google/callback?state=acme|csrf-token&code=fake-code');

    $response->assertOk()
        ->assertJsonStructure(['token']);

    // User was created in the correct tenant
    $user = User::withoutGlobalScopes()
        ->where('email', 'alice@acme.com')
        ->where('tenant_id', $this->tenant->id)
        ->first();

    expect($user)->not->toBeNull()
        ->and($user->email_verified_at)->not->toBeNull()
        ->and($user->hasRole('member'))->toBeTrue();
});

it('returns a token for an existing user without duplicating them', function (): void {
    // Pre-create the user in org A
    $existing = User::withoutGlobalScopes()->create([
        'tenant_id' => $this->tenant->id,
        'name'      => 'Alice',
        'email'     => 'alice@acme.com',
        'password'  => 'irrelevant',
    ]);
    $existing->assignRole('admin');

    mockSocialiteUser('google', 'alice@acme.com', 'Alice Smith');

    $this->getJson('/api/auth/sso/google/callback?state=acme|csrf-token&code=fake-code')
        ->assertOk()
        ->assertJsonStructure(['token']);

    // Still exactly one user with this email in this tenant
    $count = User::withoutGlobalScopes()
        ->where('email', 'alice@acme.com')
        ->where('tenant_id', $this->tenant->id)
        ->count();

    expect($count)->toBe(1)
        ->and($existing->fresh()->hasRole('admin'))->toBeTrue();  // role preserved
});

// ── Tenant isolation ───────────────────────────────────────────────────────

it('a user from tenant B cannot SSO into tenant A', function (): void {
    $tenantB = Tenant::create(['name' => 'Other Corp', 'slug' => 'other-corp']);

    // Same email exists in tenant B
    User::withoutGlobalScopes()->create([
        'tenant_id' => $tenantB->id,
        'name'      => 'Bob',
        'email'     => 'bob@othercorp.com',
        'password'  => 'irrelevant',
    ]);

    // Bob's Google account SSOs into acme — should create a NEW user in acme, not reuse the tenantB one
    mockSocialiteUser('google', 'bob@othercorp.com', 'Bob');

    $this->getJson('/api/auth/sso/google/callback?state=acme|csrf-token&code=fake-code')
        ->assertOk();

    $acmeUser = User::withoutGlobalScopes()
        ->where('email', 'bob@othercorp.com')
        ->where('tenant_id', $this->tenant->id)
        ->first();

    expect($acmeUser)->not->toBeNull();   // separate user created in acme

    $orgBUser = User::withoutGlobalScopes()
        ->where('email', 'bob@othercorp.com')
        ->where('tenant_id', $tenantB->id)
        ->first();

    expect($orgBUser)->not->toBeNull();   // org B user untouched
});

// ── SSO Config admin CRUD ─────────────────────────────────────────────────

it('admin can list SSO configs for their tenant', function (): void {
    $admin = User::withoutGlobalScopes()->create([
        'tenant_id' => $this->tenant->id,
        'name'      => 'Admin',
        'email'     => 'admin@acme.com',
        'password'  => 'Password1!',
    ]);
    $admin->assignRole('admin');

    $this->actingAs($admin)
        ->getJson('/api/sso-configs')
        ->assertOk()
        ->assertJsonCount(1);
});

it('admin can create an SSO config', function (): void {
    $admin = User::withoutGlobalScopes()->create([
        'tenant_id' => $this->tenant->id,
        'name'      => 'Admin',
        'email'     => 'admin@acme.com',
        'password'  => 'Password1!',
    ]);
    $admin->assignRole('admin');

    $this->actingAs($admin)
        ->postJson('/api/sso-configs', [
            'provider'      => 'github',
            'client_id'     => 'gh-client',
            'client_secret' => 'gh-secret',
        ])->assertCreated()
        ->assertJsonPath('provider', 'github')
        ->assertJsonMissing(['client_secret']);   // secret never returned
});

it('member cannot manage SSO configs', function (): void {
    $member = User::withoutGlobalScopes()->create([
        'tenant_id' => $this->tenant->id,
        'name'      => 'Member',
        'email'     => 'member@acme.com',
        'password'  => 'Password1!',
    ]);
    $member->assignRole('member');

    $this->actingAs($member)
        ->getJson('/api/sso-configs')
        ->assertForbidden();
});
