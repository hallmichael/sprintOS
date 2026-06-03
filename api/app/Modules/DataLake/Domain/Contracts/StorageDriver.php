<?php

namespace App\Modules\DataLake\Domain\Contracts;

/**
 * Abstracts raw file storage. S3 in production; a local-file driver for
 * dev/tests. Callers never reference a concrete path scheme directly.
 */
interface StorageDriver
{
    /** Store raw content under a tenant-namespaced key and return the key. */
    public function put(string $tenantId, string $filename, string $content, string $mimeType): string;

    /** Retrieve the raw content of a previously stored file. */
    public function get(string $storageKey): string;

    /** Delete a file by its storage key. */
    public function delete(string $storageKey): void;

    /** Generate a time-limited pre-signed URL for browser download. */
    public function temporaryUrl(string $storageKey, int $ttlSeconds = 300): string;
}
