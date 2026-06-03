<?php

namespace App\Modules\Crud\Http\Controllers;

use App\Modules\Crud\Domain\Services\DefinitionService;
use App\Modules\Crud\Domain\Services\DynamicCrudEngine;
use App\Modules\Crud\Http\Resources\CrudRecordResource;
use App\Modules\Tenancy\Domain\Services\TenantContext;
use App\Shared\Http\Controller;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;

/**
 * Definition-driven record CRUD. One controller handles every entity — the
 * {key} route param identifies which definition to apply.
 */
final class RecordController extends Controller
{
    public function __construct(
        private readonly TenantContext $context,
        private readonly DefinitionService $definitions,
        private readonly DynamicCrudEngine $engine,
    ) {}

    /** GET /api/crud/entities/{key} */
    public function index(string $key): AnonymousResourceCollection
    {
        $def = $this->resolveOrFail($key);

        return CrudRecordResource::collection($this->engine->list($def));
    }

    /** GET /api/crud/entities/{key}/{id} */
    public function show(string $key, string $id): CrudRecordResource
    {
        return CrudRecordResource::make($this->engine->find($this->resolveOrFail($key), $id));
    }

    /** POST /api/crud/entities/{key} */
    public function store(Request $request, string $key): JsonResponse
    {
        $def    = $this->resolveOrFail($key);
        $record = $this->engine->create($def, $request->input('data', []), $request->user()->id);

        return response()->json(CrudRecordResource::make($record), 201);
    }

    /** PATCH /api/crud/entities/{key}/{id} */
    public function update(Request $request, string $key, string $id): CrudRecordResource
    {
        $def = $this->resolveOrFail($key);

        return CrudRecordResource::make($this->engine->update($def, $id, $request->input('data', [])));
    }

    /** DELETE /api/crud/entities/{key}/{id} */
    public function destroy(string $key, string $id): JsonResponse
    {
        $this->engine->delete($this->resolveOrFail($key), $id);

        return response()->json(null, 204);
    }

    private function resolveOrFail(string $key)
    {
        return $this->definitions->findByKey($this->context->require()->id, $key)
            ?? abort(404, "Entity '{$key}' not found.");
    }
}
