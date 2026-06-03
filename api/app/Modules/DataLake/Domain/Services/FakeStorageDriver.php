<?php

namespace App\Modules\DataLake\Domain\Services;

use App\Modules\DataLake\Domain\Contracts\StorageDriver;
use Illuminate\Support\Str;

/**
 * Stores files on the local filesystem under storage/app/datalake/.
 * Used in dev and tests — no AWS credentials required.
 */
final class FakeStorageDriver implements StorageDriver
{
    private string $root;

    public function __construct()
    {
        $this->root = storage_path('app/datalake');
        if (!is_dir($this->root)) {
            mkdir($this->root, 0755, true);
        }
    }

    public function put(string $tenantId, string $filename, string $content, string $mimeType): string
    {
        $key  = "lake/{$tenantId}/".Str::ulid().'_'.basename($filename);
        $path = $this->root.'/'.str_replace('/', '_', $key);
        file_put_contents($path, $content);

        return $key;
    }

    public function get(string $storageKey): string
    {
        $path = $this->root.'/'.str_replace('/', '_', $storageKey);

        return (string) file_get_contents($path);
    }

    public function delete(string $storageKey): void
    {
        $path = $this->root.'/'.str_replace('/', '_', $storageKey);
        if (file_exists($path)) {
            unlink($path);
        }
    }

    public function temporaryUrl(string $storageKey, int $ttlSeconds = 300): string
    {
        return url("/api/datalake/download?key=".urlencode($storageKey));
    }
}
