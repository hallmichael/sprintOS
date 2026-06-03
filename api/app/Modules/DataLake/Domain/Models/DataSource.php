<?php

namespace App\Modules\DataLake\Domain\Models;

use App\Modules\Tenancy\Domain\Concerns\BelongsToTenant;
use Illuminate\Database\Eloquent\Concerns\HasUlids;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class DataSource extends Model
{
    use BelongsToTenant, HasUlids;

    protected $table = 'datalake_sources';

    public const TYPE_UPLOAD    = 'upload';
    public const TYPE_ONEDRIVE  = 'onedrive';
    public const TYPE_GDRIVE    = 'googledrive';
    public const TYPE_API       = 'api';

    public const STATUS_ACTIVE  = 'active';
    public const STATUS_PENDING = 'pending';
    public const STATUS_ERROR   = 'error';

    protected $fillable = [
        'tenant_id', 'name', 'type', 'config', 'status', 'last_synced_at', 'cursor',
    ];

    protected $hidden = ['config', 'cursor'];

    protected function casts(): array
    {
        return [
            'config'         => 'encrypted',
            'last_synced_at' => 'datetime',
        ];
    }

    public function documents(): HasMany
    {
        return $this->hasMany(DataDocument::class, 'source_id');
    }
}
