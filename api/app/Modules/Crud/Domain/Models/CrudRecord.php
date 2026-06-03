<?php

namespace App\Modules\Crud\Domain\Models;

use App\Modules\Tenancy\Domain\Concerns\BelongsToTenant;
use Illuminate\Database\Eloquent\Concerns\HasUlids;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\SoftDeletes;

class CrudRecord extends Model
{
    use BelongsToTenant, HasUlids, SoftDeletes;

    protected $fillable = [
        'tenant_id', 'definition_id', 'data', 'created_by',
    ];

    protected function casts(): array
    {
        return ['data' => 'array'];
    }

    public function definition(): BelongsTo
    {
        return $this->belongsTo(CrudDefinition::class, 'definition_id');
    }
}
