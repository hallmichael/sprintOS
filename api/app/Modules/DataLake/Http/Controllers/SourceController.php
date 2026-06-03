<?php

namespace App\Modules\DataLake\Http\Controllers;

use App\Modules\DataLake\Domain\Models\DataSource;
use App\Modules\DataLake\Http\Resources\DataSourceResource;
use App\Modules\Tenancy\Domain\Services\TenantContext;
use App\Shared\Http\Controller;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;

/**
 * Manages data sources (where documents come from).
 * Phase 4.1 — admins create sources; members list them.
 */
final class SourceController extends Controller
{
    public function __construct(private readonly TenantContext $context) {}

    /** GET /api/datalake/sources */
    public function index(): AnonymousResourceCollection
    {
        return DataSourceResource::collection(DataSource::paginate());
    }

    /** POST /api/datalake/sources — admin only */
    public function store(Request $request): JsonResponse
    {
        $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'type' => ['sometimes', 'string', 'in:upload,onedrive,googledrive,api'],
        ]);

        $source = DataSource::create([
            'tenant_id' => $this->context->require()->id,
            'name'      => $request->input('name'),
            'type'      => $request->input('type', DataSource::TYPE_UPLOAD),
            'status'    => DataSource::STATUS_ACTIVE,
        ]);

        return response()->json(DataSourceResource::make($source), 201);
    }

    /** GET /api/datalake/sources/{id} */
    public function show(string $id): DataSourceResource
    {
        return DataSourceResource::make(DataSource::findOrFail($id));
    }

    /** DELETE /api/datalake/sources/{id} — admin only */
    public function destroy(string $id): JsonResponse
    {
        DataSource::findOrFail($id)->delete();

        return response()->json(null, 204);
    }
}
