<?php

namespace App\Modules\Tools\Domain\Models;

use App\Modules\Tenancy\Domain\Concerns\BelongsToTenant;
use Illuminate\Database\Eloquent\Concerns\HasUlids;
use Illuminate\Database\Eloquent\Model;

class Tool extends Model
{
    use BelongsToTenant, HasUlids;

    protected $fillable = [
        'tenant_id', 'key', 'name', 'description', 'input_schema', 'handler', 'is_enabled',
    ];

    protected function casts(): array
    {
        return [
            'input_schema' => 'array',
            'is_enabled' => 'boolean',
        ];
    }
}
