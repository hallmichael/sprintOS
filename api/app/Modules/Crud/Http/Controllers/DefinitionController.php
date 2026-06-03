<?php

namespace App\Modules\Crud\Http\Controllers;

use App\Modules\Crud\Domain\Actions\ProposeEntityAction;
use App\Modules\Crud\Domain\Data\FieldDefinition;
use App\Modules\Crud\Domain\Models\CrudDefinition;
use App\Modules\Crud\Domain\Services\DefinitionService;
use App\Modules\Crud\Http\Requests\SaveDefinitionRequest;
use App\Modules\Crud\Http\Resources\CrudDefinitionResource;
use App\Modules\Tenancy\Domain\Services\TenantContext;
use App\Shared\Http\Controller;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;

/**
 * Manages entity definitions (the schema-as-metadata layer).
 * Admins create/edit definitions; the AI proposes initial schemas.
 */
final class DefinitionController extends Controller
{
    public function __construct(
        private readonly TenantContext $context,
        private readonly DefinitionService $service,
        private readonly ProposeEntityAction $propose,
    ) {}

    /** GET /api/crud/definitions */
    public function index(): AnonymousResourceCollection
    {
        return CrudDefinitionResource::collection(
            $this->service->forTenant($this->context->require()->id),
        );
    }

    /** GET /api/crud/definitions/{key} */
    public function show(string $key): CrudDefinitionResource
    {
        return CrudDefinitionResource::make(
            $this->service->findByKey($this->context->require()->id, $key)
                ?? abort(404, "Entity '{$key}' not found."),
        );
    }

    /** POST /api/crud/definitions */
    public function store(SaveDefinitionRequest $request): JsonResponse
    {
        $fields = array_map(fn ($f) => FieldDefinition::fromArray($f), $request->validated('fields'));

        $def = $this->service->create(
            tenantId: $this->context->require()->id,
            name: $request->validated('name'),
            namePlural: $request->validated('name_plural', $request->validated('name').'s'),
            fields: $fields,
            isPublished: (bool) $request->validated('is_published', true),
        );

        return response()->json(CrudDefinitionResource::make($def), 201);
    }

    /** PATCH /api/crud/definitions/{key} */
    public function update(SaveDefinitionRequest $request, string $key): CrudDefinitionResource
    {
        $def = $this->service->findByKey($this->context->require()->id, $key)
            ?? abort(404);

        $fields = array_map(fn ($f) => FieldDefinition::fromArray($f), $request->validated('fields'));

        return CrudDefinitionResource::make($this->service->update($def, $request->validated('name'), $request->validated('name_plural', $def->name_plural), $fields));
    }

    /**
     * POST /api/crud/propose
     * Claude proposes a full entity definition from a plain-English prompt.
     * The proposal is returned for review before being committed.
     */
    public function propose(Request $request): JsonResponse
    {
        $request->validate(['prompt' => ['required', 'string', 'max:2000']]);

        $proposal = $this->propose->execute(
            $this->context->require()->id,
            (string) $request->input('prompt'),
        );

        return response()->json([
            'name'        => $proposal['name'],
            'name_plural' => $proposal['name_plural'],
            'fields'      => array_map(fn (FieldDefinition $f) => $f->toArray(), $proposal['fields']),
        ]);
    }
}
