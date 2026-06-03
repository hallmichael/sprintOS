<?php

namespace App\Modules\DataLake;

use App\Modules\DataLake\Domain\Contracts\StorageDriver;
use App\Modules\DataLake\Domain\Contracts\VectorStore;
use App\Modules\DataLake\Domain\Services\ChunkingService;
use App\Modules\DataLake\Domain\Services\FakeStorageDriver;
use App\Modules\DataLake\Domain\Services\FakeVectorStore;
use App\Modules\DataLake\Domain\Services\OpenSearchVectorStore;
use App\Modules\DataLake\Domain\Services\S3StorageDriver;
use Illuminate\Support\Facades\Route;
use Illuminate\Support\ServiceProvider;

class DataLakeServiceProvider extends ServiceProvider
{
    public function register(): void
    {
        $isFake = config('sprintos.datalake.driver') !== 's3';

        // Storage driver: fake (local filesystem) or S3.
        $this->app->singleton(StorageDriver::class, function () use ($isFake) {
            if ($isFake) {
                if ($this->app->environment('production')) {
                    throw new \RuntimeException('DATALAKE_DRIVER=fake is forbidden in production. Use s3.');
                }
                return new FakeStorageDriver;
            }
            return new S3StorageDriver;
        });

        // Vector store: fake (in-memory cosine) or OpenSearch.
        // The FakeVectorStore is a singleton so vectors persist across the request.
        $this->app->singleton(VectorStore::class, function () use ($isFake) {
            if ($isFake) {
                if ($this->app->environment('production')) {
                    throw new \RuntimeException('DATALAKE_DRIVER=fake is forbidden in production. Use s3.');
                }
                return new FakeVectorStore;
            }
            return new OpenSearchVectorStore;
        });

        $this->app->singleton(ChunkingService::class, fn () => new ChunkingService(
            maxChars:     (int) config('sprintos.datalake.chunk_max_chars', 1500),
            overlapChars: (int) config('sprintos.datalake.chunk_overlap_chars', 200),
        ));
    }

    public function boot(): void
    {
        Route::middleware('api')->prefix('api')->group(__DIR__.'/routes.php');
    }
}
