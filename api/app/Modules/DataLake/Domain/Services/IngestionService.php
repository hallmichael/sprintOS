<?php

namespace App\Modules\DataLake\Domain\Services;

use App\Modules\Ai\Domain\Data\EmbedRequest;
use App\Modules\Ai\Domain\Services\ModelGateway;
use App\Modules\DataLake\Domain\Contracts\StorageDriver;
use App\Modules\DataLake\Domain\Contracts\VectorStore;
use App\Modules\DataLake\Domain\Models\DataDocument;
use App\Modules\DataLake\Domain\Models\DataSource;
use Illuminate\Http\UploadedFile;

/**
 * Orchestrates the full ingestion pipeline (Build Guide 4.3 + 4.5):
 *   1. Store raw file (StorageDriver — S3/fake)
 *   2. Extract text (ChunkingService)
 *   3. Chunk with overlap
 *   4. Embed each chunk (ModelGateway → Bedrock Titan, metered)
 *   5. Index in vector store (OpenSearch/fake)
 *   6. Update document status + chunk_count
 *
 * The heavy work (steps 2–5) is dispatched as a queued job in production.
 * This service can also be called synchronously (e.g. small files, tests).
 */
final class IngestionService
{
    public function __construct(
        private readonly StorageDriver  $storage,
        private readonly VectorStore    $vectors,
        private readonly ChunkingService $chunker,
        private readonly ModelGateway   $gateway,
    ) {}

    /**
     * Store a file upload and create a DataDocument record (status = pending).
     * Returns the document so callers can dispatch IngestDocumentJob.
     */
    public function storeUpload(DataSource $source, UploadedFile $file, array $roleTags = ['member']): DataDocument
    {
        $content = $file->get();
        $key     = $this->storage->put($source->tenant_id, $file->getClientOriginalName(), $content, $file->getMimeType() ?? 'text/plain');

        return DataDocument::create([
            'tenant_id'   => $source->tenant_id,
            'source_id'   => $source->id,
            'title'       => $file->getClientOriginalName(),
            'storage_key' => $key,
            'mime_type'   => $file->getMimeType() ?? 'text/plain',
            'size_bytes'  => $file->getSize(),
            'role_tags'   => $roleTags,
            'status'      => DataDocument::STATUS_PENDING,
            'metadata'    => ['original_name' => $file->getClientOriginalName()],
        ]);
    }

    /**
     * Run the full pipeline for one document (synchronous).
     * Called directly in tests; in production dispatched via IngestDocumentJob.
     */
    public function ingest(DataDocument $doc): void
    {
        $doc->update(['status' => DataDocument::STATUS_INDEXING]);

        try {
            // 1. Load raw content from storage.
            $raw  = $this->storage->get($doc->storage_key ?? '');
            $text = $this->chunker->extractText($raw, $doc->mime_type ?? 'text/plain');

            // 2. Chunk.
            $chunks = $this->chunker->chunk(
                documentId: $doc->id,
                text: $text,
                roleTags: $doc->role_tags ?? ['member'],
                metadata: [
                    'title'     => $doc->title,
                    'source_id' => $doc->source_id,
                ],
            );

            if (empty($chunks)) {
                $doc->update(['status' => DataDocument::STATUS_INDEXED, 'chunk_count' => 0]);

                return;
            }

            // 3. Embed all chunks in one batched call (Bedrock Titan supports batch).
            $texts   = array_map(fn ($c) => $c->text, $chunks);
            $embedRes = $this->gateway->embed(new EmbedRequest(
                tenantId:    $doc->tenant_id,
                inputs:      $texts,
                actorType:   'system',
                correlationId: "ingest-{$doc->id}",
            ));

            // 4. Index each chunk with its vector.
            foreach ($chunks as $i => $chunk) {
                $vector = $embedRes->vectors[$i] ?? [];
                $this->vectors->index($doc->tenant_id, $chunk, $vector);
            }

            $doc->update([
                'status'      => DataDocument::STATUS_INDEXED,
                'chunk_count' => count($chunks),
            ]);
        } catch (\Throwable $e) {
            $doc->update([
                'status' => DataDocument::STATUS_FAILED,
                'error'  => substr($e->getMessage(), 0, 500),
            ]);
            throw $e;
        }
    }

    /**
     * Delete a document: remove from storage, purge vector index, soft-delete row.
     */
    public function delete(DataDocument $doc): void
    {
        if ($doc->storage_key) {
            try {
                $this->storage->delete($doc->storage_key);
            } catch (\Throwable) {
                // Storage delete failures are non-fatal — continue with vector purge.
            }
        }

        $this->vectors->deleteDocument($doc->tenant_id, $doc->id);
        $doc->delete();
    }
}
