<?php

namespace App\Modules\DataLake\Domain\Models;

use App\Modules\Tenancy\Domain\Concerns\BelongsToTenant;
use Illuminate\Database\Eloquent\Concerns\HasUlids;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\SoftDeletes;

class DataDocument extends Model
{
    use BelongsToTenant, HasUlids, SoftDeletes;

    protected $table = 'datalake_documents';

    public const STATUS_PENDING  = 'pending';
    public const STATUS_INDEXING = 'indexing';
    public const STATUS_INDEXED  = 'indexed';
    public const STATUS_FAILED   = 'failed';

    protected $fillable = [
        'tenant_id', 'source_id', 'title', 'storage_key', 'mime_type',
        'size_bytes', 'role_tags', 'status', 'error', 'chunk_count', 'metadata',
    ];

    protected function casts(): array
    {
        return [
            'role_tags' => 'array',
            'metadata'  => 'array',
            'size_bytes' => 'integer',
            'chunk_count' => 'integer',
        ];
    }

    public function source(): BelongsTo
    {
        return $this->belongsTo(DataSource::class, 'source_id');
    }

    /** The roles a user must have ANY of to retrieve this document. */
    public function accessibleBy(array $userRoles): bool
    {
        $tags = $this->role_tags ?? ['member'];

        return !empty(array_intersect($tags, $userRoles));
    }
}
