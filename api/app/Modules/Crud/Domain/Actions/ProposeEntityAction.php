<?php

namespace App\Modules\Crud\Domain\Actions;

use App\Modules\Ai\Domain\Data\ChatRequest;
use App\Modules\Ai\Domain\Data\ModelTier;
use App\Modules\Ai\Domain\Data\ToolDefinition;
use App\Modules\Ai\Domain\Data\ToolUse;
use App\Modules\Ai\Domain\Services\ModelGateway;
use App\Modules\Crud\Domain\Data\FieldDefinition;
use App\Modules\Crud\Domain\Data\FieldType;

/**
 * Ask Claude to propose an entity definition from a plain-English prompt, using
 * Bedrock's tool-use so the response is structured (not a free-text string to parse).
 *
 * The model is forced to call `propose_entity` with a fully-typed schema.
 * The action is metered like any other AI call — via ModelGateway.
 */
final class ProposeEntityAction
{
    public function __construct(private readonly ModelGateway $gateway) {}

    /**
     * @return array{ name: string, name_plural: string, fields: array<int, FieldDefinition> }
     */
    public function execute(string $tenantId, string $prompt): array
    {
        $tool = new ToolDefinition(
            name: 'propose_entity',
            description: 'Propose a structured entity definition with fields for a business data model.',
            inputSchema: [
                'type' => 'object',
                'properties' => [
                    'name' => [
                        'type' => 'string',
                        'description' => 'Singular entity name, e.g. "Customer"',
                    ],
                    'name_plural' => [
                        'type' => 'string',
                        'description' => 'Plural entity name, e.g. "Customers"',
                    ],
                    'fields' => [
                        'type' => 'array',
                        'description' => 'The fields of the entity',
                        'items' => [
                            'type' => 'object',
                            'properties' => [
                                'key'       => ['type' => 'string', 'description' => 'snake_case field key'],
                                'label'     => ['type' => 'string', 'description' => 'Human-readable label'],
                                'type'      => ['type' => 'string', 'enum' => array_column(FieldType::cases(), 'value')],
                                'required'  => ['type' => 'boolean'],
                                'options'   => ['type' => 'array', 'items' => ['type' => 'string'], 'description' => 'Only for select fields'],
                                'placeholder' => ['type' => 'string'],
                                'help_text'   => ['type' => 'string'],
                            ],
                            'required' => ['key', 'label', 'type', 'required'],
                        ],
                    ],
                ],
                'required' => ['name', 'name_plural', 'fields'],
            ],
        );

        $response = $this->gateway->chat(new ChatRequest(
            tenantId: $tenantId,
            messages: [
                [
                    'role'    => 'user',
                    'content' => "Design an entity for a business operating system based on this description: {$prompt}\n\nCall the propose_entity tool with a complete field definition.",
                ],
            ],
            tier: ModelTier::Balanced,
            tools: [$tool],
            maxTokens: 1024,
            actorType: 'system',
            correlationId: "crud-propose-{$tenantId}",
        ));

        // Claude returns a tool_use block when forced with a tool list.
        $toolUse = collect($response->toolUses)->first(fn (ToolUse $tu) => $tu->name === 'propose_entity');

        if ($toolUse === null) {
            throw new \RuntimeException('Claude did not return a propose_entity tool call. Response: '.($response->text ?? '(no text)'));
        }

        $input = $toolUse->input;

        return [
            'name'        => $input['name'],
            'name_plural' => $input['name_plural'],
            'fields'      => array_map(
                fn (array $f) => FieldDefinition::fromArray($f),
                $input['fields'] ?? [],
            ),
        ];
    }
}
