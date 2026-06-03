<?php

namespace App\Modules\DataLake\Domain\Services;

use App\Modules\DataLake\Domain\Contracts\StorageDriver;
use Aws\S3\S3Client;
use Illuminate\Support\Str;

/**
 * S3-backed storage driver (DATALAKE_DRIVER=s3).
 * Uses Sprint's IAM credentials — no customer keys (ADR 0004).
 * All keys are namespaced: lake/{tenant_id}/{ulid}_{filename}
 */
final class S3StorageDriver implements StorageDriver
{
    private S3Client $client;
    private string $bucket;

    public function __construct(?S3Client $client = null, ?string $bucket = null)
    {
        $this->bucket = $bucket ?? (string) config('sprintos.datalake.s3_bucket');
        $this->client = $client ?? new S3Client([
            'region'  => config('sprintos.datalake.region', config('sprintos.ai.region')),
            'version' => 'latest',
        ]);
    }

    public function put(string $tenantId, string $filename, string $content, string $mimeType): string
    {
        $key = "lake/{$tenantId}/".Str::ulid().'_'.basename($filename);

        $this->client->putObject([
            'Bucket'      => $this->bucket,
            'Key'         => $key,
            'Body'        => $content,
            'ContentType' => $mimeType,
        ]);

        return $key;
    }

    public function get(string $storageKey): string
    {
        $result = $this->client->getObject(['Bucket' => $this->bucket, 'Key' => $storageKey]);

        return (string) $result['Body'];
    }

    public function delete(string $storageKey): void
    {
        $this->client->deleteObject(['Bucket' => $this->bucket, 'Key' => $storageKey]);
    }

    public function temporaryUrl(string $storageKey, int $ttlSeconds = 300): string
    {
        $cmd = $this->client->getCommand('GetObject', ['Bucket' => $this->bucket, 'Key' => $storageKey]);
        $request = $this->client->createPresignedRequest($cmd, "+{$ttlSeconds} seconds");

        return (string) $request->getUri();
    }
}
