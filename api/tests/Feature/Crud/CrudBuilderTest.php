<?php

/**
 * Phase 3 — AI CRUD builder.
 * Tests: definition CRUD, dynamic record engine, AI propose (fake driver),
 * tenant isolation, field validation.
 */

use App\Modules\Ai\Domain\Contracts\ModelClient;
use App\Modules\Ai\Domain\Data\ChatResponse;
use App\Modules\Ai\Domain\Data\TokenUsage;
use App\Modules\Ai\Domain\Data\ToolUse;
use App\Modules\Crud\Domain\Models\CrudDefinition;
use App\Modules\Crud\Domain\Models\CrudRecord;
use App\Modules\Tenancy\Domain\Models\Tenant;
use Database\Seeders\UsageRateSeeder;
use Illuminate\Foundation\Testing\RefreshDatabase;

uses(RefreshDatabase::class);

// ── Fixtures ──────────────────────────────────────────────────────────────

beforeEach(function (): void {
    $this->seed(UsageRateSeeder::class);
    $this->tenant = Tenant::create(['name' => 'Acme', 'slug' => 'acme']);
    $this->admin  = makeUser($this->tenant->id, 'admin', ['email' => 'admin@acme.com']);
    $this->member = makeUser($this->tenant->id, 'member', ['email' => 'member@acme.com']);
});

function customerDef(): array
{
    return [
        'name'       => 'Customer',
        'name_plural' => 'Customers',
        'fields'     => [
            ['key' => 'company_name', 'label' => 'Company name', 'type' => 'text', 'required' => true],
            ['key' => 'email',        'label' => 'Email',        'type' => 'email', 'required' => false],
            ['key' => 'status',       'label' => 'Status',       'type' => 'select', 'required' => true, 'options' => ['active', 'inactive']],
        ],
    ];
}

// ── 3.1 Definition schema ─────────────────────────────────────────────────

it('admin can create an entity definition', function (): void {
    $this->actingAs($this->admin)
        ->postJson('/api/crud/definitions', customerDef())
        ->assertCreated()
        ->assertJsonPath('name', 'Customer')
        ->assertJsonPath('key', 'customer')
        ->assertJsonPath('version', 1)
        ->assertJsonCount(3, 'fields');
});

it('stores the definition and it is queryable by key', function (): void {
    $this->actingAs($this->admin)->postJson('/api/crud/definitions', customerDef());

    $this->actingAs($this->admin)
        ->getJson('/api/crud/definitions/customer')
        ->assertOk()
        ->assertJsonPath('name', 'Customer');
});

it('updating a definition increments the version', function (): void {
    $this->actingAs($this->admin)->postJson('/api/crud/definitions', customerDef());

    $updated = customerDef();
    $updated['fields'][] = ['key' => 'phone', 'label' => 'Phone', 'type' => 'phone', 'required' => false];

    $this->actingAs($this->admin)
        ->patchJson('/api/crud/definitions/customer', $updated)
        ->assertOk()
        ->assertJsonPath('version', 2)
        ->assertJsonCount(4, 'fields');
});

it('member cannot manage definitions', function (): void {
    $this->actingAs($this->member)
        ->postJson('/api/crud/definitions', customerDef())
        ->assertForbidden();
});

// ── 3.2/3.3 Dynamic record CRUD ───────────────────────────────────────────

it('creates a record against a published definition', function (): void {
    $this->actingAs($this->admin)->postJson('/api/crud/definitions', customerDef());

    $this->actingAs($this->admin)
        ->postJson('/api/crud/entities/customer', ['data' => ['company_name' => 'Acme Plumbing', 'email' => 'admin@acme.com.au', 'status' => 'active']])
        ->assertCreated()
        ->assertJsonPath('data.company_name', 'Acme Plumbing');
});

it('a member can create and list records', function (): void {
    $this->actingAs($this->admin)->postJson('/api/crud/definitions', customerDef());

    $this->actingAs($this->member)
        ->postJson('/api/crud/entities/customer', ['data' => ['company_name' => 'Brisbane Trades', 'status' => 'active']])
        ->assertCreated();

    $this->actingAs($this->member)
        ->getJson('/api/crud/entities/customer')
        ->assertOk()
        ->assertJsonCount(1, 'data');
});

it('validates required fields against the definition', function (): void {
    $this->actingAs($this->admin)->postJson('/api/crud/definitions', customerDef());

    // company_name is required — should 422
    $this->actingAs($this->member)
        ->postJson('/api/crud/entities/customer', ['data' => ['email' => 'x@x.com', 'status' => 'active']])
        ->assertUnprocessable();
});

it('partially updates a record merging existing data', function (): void {
    $this->actingAs($this->admin)->postJson('/api/crud/definitions', customerDef());
    $create = $this->actingAs($this->admin)
        ->postJson('/api/crud/entities/customer', ['data' => ['company_name' => 'Acme', 'status' => 'active']])
        ->json();

    $this->actingAs($this->admin)
        ->patchJson("/api/crud/entities/customer/{$create['id']}", ['data' => ['status' => 'inactive']])
        ->assertOk()
        ->assertJsonPath('data.company_name', 'Acme')   // preserved
        ->assertJsonPath('data.status', 'inactive');    // updated
});

it('deletes a record', function (): void {
    $this->actingAs($this->admin)->postJson('/api/crud/definitions', customerDef());
    $rec = $this->actingAs($this->admin)
        ->postJson('/api/crud/entities/customer', ['data' => ['company_name' => 'Delete me', 'status' => 'active']])
        ->json();

    $this->actingAs($this->admin)->deleteJson("/api/crud/entities/customer/{$rec['id']}")->assertNoContent();
    expect(CrudRecord::withoutGlobalScopes()->find($rec['id'])->trashed())->toBeTrue();
});

// ── 3.4 AI proposal (fake driver) ────────────────────────────────────────

it('AI proposes an entity definition via Claude tool-use', function (): void {
    // Script the fake driver to return a propose_entity tool call.
    app(ModelClient::class)->willReturn(new ChatResponse(
        text: null,
        toolUses: [
            new ToolUse('tu_1', 'propose_entity', [
                'name'        => 'Invoice',
                'name_plural' => 'Invoices',
                'fields'      => [
                    ['key' => 'invoice_number', 'label' => 'Invoice number', 'type' => 'text',     'required' => true],
                    ['key' => 'amount',         'label' => 'Amount',         'type' => 'currency', 'required' => true],
                    ['key' => 'due_date',       'label' => 'Due date',       'type' => 'date',     'required' => true],
                    ['key' => 'status',         'label' => 'Status',         'type' => 'select',   'required' => true,
                        'options' => ['draft', 'sent', 'paid', 'overdue']],
                ],
            ]),
        ],
        usage: new TokenUsage(80, 120),
        stopReason: 'tool_use',
        model: 'au.anthropic.claude-sonnet-4-5-20250929-v1:0',
    ));

    $this->actingAs($this->admin)
        ->postJson('/api/crud/propose', ['prompt' => 'Invoices for a trade business with number, amount, due date and status'])
        ->assertOk()
        ->assertJsonPath('name', 'Invoice')
        ->assertJsonCount(4, 'fields')
        ->assertJsonPath('fields.0.key', 'invoice_number')
        ->assertJsonPath('fields.3.options.2', 'paid');
});

it('proposed entity metered to the usage ledger', function (): void {
    app(ModelClient::class)->willReturn(new ChatResponse(
        text: null,
        toolUses: [new ToolUse('tu_1', 'propose_entity', ['name' => 'Job', 'name_plural' => 'Jobs', 'fields' => [['key' => 'title', 'label' => 'Title', 'type' => 'text', 'required' => true]]])],
        usage: new TokenUsage(50, 90),
        stopReason: 'tool_use',
        model: 'au.anthropic.claude-sonnet-4-5-20250929-v1:0',
    ));

    $this->actingAs($this->admin)->postJson('/api/crud/propose', ['prompt' => 'Jobs']);

    $events = \App\Modules\Usage\Domain\Models\UsageEvent::withoutGlobalScopes()->where('tenant_id', $this->tenant->id)->get();
    expect($events->count())->toBe(2)
        ->and($events->pluck('unit')->sort()->values()->all())->toBe(['input_tokens', 'output_tokens']);
});

// ── Tenant isolation ──────────────────────────────────────────────────────

it('org A cannot see org B definitions or records', function (): void {
    $orgB   = Tenant::create(['name' => 'Org B', 'slug' => 'org-b']);
    $adminB = makeUser($orgB->id, 'admin', ['email' => 'admin@orgb.com']);

    $this->actingAs($adminB)->postJson('/api/crud/definitions', customerDef());
    $this->actingAs($adminB)->postJson('/api/crud/entities/customer', ['data' => ['company_name' => 'Secret', 'status' => 'active']]);

    // Org A sees empty definition list.
    $this->actingAs($this->admin)->getJson('/api/crud/definitions')->assertOk()->assertJsonCount(0, 'data');

    // Org A gets 404 for org B's entity key.
    $this->actingAs($this->admin)->getJson('/api/crud/entities/customer')->assertNotFound();
});
