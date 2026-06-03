<?php

namespace App\Modules\DataLake\Jobs;

use App\Modules\DataLake\Domain\Models\DataDocument;
use App\Modules\DataLake\Domain\Services\IngestionService;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;

/**
 * Dispatched after a file is uploaded. Runs the full ingestion pipeline
 * (extract → chunk → embed → index) on the SQS queue via Horizon.
 * Retries 3 times with exponential backoff; marks the document 'failed'
 * on exhaustion so operators can see it and retry.
 */
class IngestDocumentJob implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    public int $tries   = 3;
    public int $timeout = 300;

    public function __construct(public readonly DataDocument $document) {}

    public function handle(IngestionService $service): void
    {
        $service->ingest($this->document);
    }

    public function backoff(): array
    {
        return [30, 120, 300];
    }
}
