<?php

namespace App\Modules\DataLake\Http\Controllers;

use App\Modules\DataLake\Domain\Models\DataDocument;
use App\Modules\DataLake\Domain\Models\DataSource;
use App\Modules\DataLake\Domain\Services\IngestionService;
use App\Modules\DataLake\Http\Resources\DataDocumentResource;
use App\Modules\DataLake\Jobs\IngestDocumentJob;
use App\Shared\Http\Controller;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;
use Illuminate\Support\Facades\Storage;

/**
 * File upload and document management (Build Guide 4.3 + 4.7).
 */
final class DocumentController extends Controller
{
    public function __construct(private readonly IngestionService $service) {}

    /** GET /api/datalake/documents */
    public function index(): AnonymousResourceCollection
    {
        return DataDocumentResource::collection(DataDocument::latest()->paginate());
    }

    /** GET /api/datalake/sources/{sourceId}/documents */
    public function forSource(string $sourceId): AnonymousResourceCollection
    {
        DataSource::findOrFail($sourceId); // ensures tenant scope
        return DataDocumentResource::collection(DataDocument::where('source_id', $sourceId)->latest()->paginate());
    }

    /**
     * POST /api/datalake/sources/{sourceId}/documents
     * Upload a file → store → queue ingestion.
     */
    public function store(Request $request, string $sourceId): JsonResponse
    {
        $request->validate([
            'file'       => ['required', 'file', 'max:51200'],   // 50 MB
            'role_tags'  => ['sometimes', 'array'],
            'role_tags.*' => ['string', 'in:admin,member,viewer,public'],
        ]);

        $source = DataSource::findOrFail($sourceId);

        $doc = $this->service->storeUpload(
            $source,
            $request->file('file'),
            $request->input('role_tags', ['member']),
        );

        // Queue the ingestion pipeline (or run synchronously when QUEUE_CONNECTION=sync).
        IngestDocumentJob::dispatch($doc);

        return response()->json(DataDocumentResource::make($doc), 202);
    }

    /** GET /api/datalake/documents/{id} */
    public function show(string $id): DataDocumentResource
    {
        return DataDocumentResource::make(DataDocument::findOrFail($id));
    }

    /** DELETE /api/datalake/documents/{id} — removes storage + vectors + record */
    public function destroy(string $id): JsonResponse
    {
        $this->service->delete(DataDocument::findOrFail($id));

        return response()->json(null, 204);
    }

    /** GET /api/datalake/download?key={storageKey} — pre-signed download */
    public function download(Request $request): \Symfony\Component\HttpFoundation\Response
    {
        $key = $request->query('key', '');
        abort_if(empty($key), 400, 'key is required');

        // The FakeStorageDriver serves content directly; the S3Driver would
        // redirect to a pre-signed URL. For simplicity we stream both here.
        $content = app(\App\Modules\DataLake\Domain\Contracts\StorageDriver::class)->get($key);

        return response($content)->header('Content-Disposition', 'attachment; filename="'.basename($key).'"');
    }
}
