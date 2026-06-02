<?php

/**
 * Phase 2.2 — Tool registry + tool-use dispatch ("Claude can call a tool").
 */

use App\Modules\Ai\Domain\Data\ToolUse;
use App\Modules\Tenancy\Domain\Models\Tenant;
use App\Modules\Tools\Domain\Models\Tool;
use App\Modules\Tools\Domain\Services\ToolDispatcher;
use App\Modules\Tools\Domain\Services\ToolRegistry;
use Illuminate\Foundation\Testing\RefreshDatabase;

uses(RefreshDatabase::class);

beforeEach(function (): void {
    $this->tenant = Tenant::create(['name' => 'Acme', 'slug' => 'acme']);
    $this->admin = makeUser($this->tenant->id, 'admin', ['email' => 'admin@acme.com']);
    $this->member = makeUser($this->tenant->id, 'member', ['email' => 'member@acme.com']);
});

function calcSchema(): array
{
    return [
        'type' => 'object',
        'properties' => [
            'a' => ['type' => 'number'],
            'b' => ['type' => 'number'],
            'op' => ['type' => 'string', 'enum' => ['add', 'subtract', 'multiply', 'divide']],
        ],
        'required' => ['a', 'b'],
    ];
}

it('an admin can register a tool', function (): void {
    $this->actingAs($this->admin)
        ->postJson('/api/tools', [
            'key' => 'calculator', 'name' => 'Calculator',
            'description' => 'Does arithmetic', 'input_schema' => calcSchema(),
            'handler' => 'calculator',
        ])
        ->assertCreated()
        ->assertJsonPath('key', 'calculator');
});

it('rejects an unknown handler', function (): void {
    $this->actingAs($this->admin)
        ->postJson('/api/tools', [
            'key' => 'mystery', 'name' => 'Mystery',
            'description' => 'x', 'input_schema' => ['type' => 'object'],
            'handler' => 'does_not_exist',
        ])
        ->assertStatus(422);
});

it('a member cannot register a tool', function (): void {
    $this->actingAs($this->member)
        ->postJson('/api/tools', [
            'key' => 'calculator', 'name' => 'Calculator',
            'description' => 'x', 'input_schema' => ['type' => 'object'], 'handler' => 'calculator',
        ])
        ->assertForbidden();
});

it('exposes registered tool definitions to the model', function (): void {
    Tool::withoutGlobalScopes()->create([
        'tenant_id' => $this->tenant->id, 'key' => 'calculator', 'name' => 'Calc',
        'description' => 'Arithmetic', 'input_schema' => calcSchema(), 'handler' => 'calculator',
    ]);

    $defs = app(ToolRegistry::class)->definitionsFor($this->tenant->id);

    expect($defs)->toHaveCount(1)
        ->and($defs[0]->name)->toBe('calculator')
        ->and($defs[0]->toBedrockSpec()['toolSpec']['name'])->toBe('calculator');
});

it('dispatches a model tool_use to its handler and returns the result', function (): void {
    Tool::withoutGlobalScopes()->create([
        'tenant_id' => $this->tenant->id, 'key' => 'calculator', 'name' => 'Calc',
        'description' => 'Arithmetic', 'input_schema' => calcSchema(), 'handler' => 'calculator',
    ]);

    // Simulate the model asking to call the tool.
    $call = new ToolUse('tu_1', 'calculator', ['a' => 2, 'b' => 3, 'op' => 'add']);
    $result = app(ToolDispatcher::class)->dispatch($this->tenant->id, $call);

    expect($result->isError)->toBeFalse()
        ->and($result->content['result'])->toBe(5.0)
        ->and($result->toolUseId)->toBe('tu_1');
});

it('returns an error result for an unregistered tool (not thrown)', function (): void {
    $call = new ToolUse('tu_2', 'ghost_tool', []);
    $result = app(ToolDispatcher::class)->dispatch($this->tenant->id, $call);

    expect($result->isError)->toBeTrue();
});

it('invokes a tool via the HTTP endpoint', function (): void {
    Tool::withoutGlobalScopes()->create([
        'tenant_id' => $this->tenant->id, 'key' => 'calculator', 'name' => 'Calc',
        'description' => 'Arithmetic', 'input_schema' => calcSchema(), 'handler' => 'calculator',
    ]);

    $this->actingAs($this->admin)
        ->postJson('/api/tools/calculator/invoke', ['input' => ['a' => 10, 'b' => 4, 'op' => 'subtract']])
        ->assertOk()
        ->assertJsonPath('content.result', 6);
});

it('isolates tools by org', function (): void {
    $other = Tenant::create(['name' => 'Other', 'slug' => 'other']);
    Tool::withoutGlobalScopes()->create([
        'tenant_id' => $other->id, 'key' => 'calculator', 'name' => 'Calc',
        'description' => 'x', 'input_schema' => calcSchema(), 'handler' => 'calculator',
    ]);

    // Acme has no tools registered → definitions empty.
    expect(app(ToolRegistry::class)->definitionsFor($this->tenant->id))->toHaveCount(0);
});
