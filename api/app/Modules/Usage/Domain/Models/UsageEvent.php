<?php

namespace App\Modules\Usage\Domain\Models;

use App\Modules\Tenancy\Domain\Concerns\BelongsToTenant;
use Illuminate\Database\Eloquent\Concerns\HasUlids;
use Illuminate\Database\Eloquent\Model;

class UsageEvent extends Model
{
    use BelongsToTenant, HasUlids;

    public const UPDATED_AT = null; // append-only ledger

    protected $fillable = [
        'tenant_id', 'actor_type', 'actor_id',
        'service', 'provider', 'operation', 'model', 'unit', 'quantity',
        'raw_cost', 'markup_rate', 'billable_cost', 'currency',
        'correlation_id', 'metadata', 'invoice_id',
    ];

    protected function casts(): array
    {
        return [
            'quantity' => 'decimal:4',
            'raw_cost' => 'decimal:8',
            'markup_rate' => 'decimal:4',
            'billable_cost' => 'decimal:8',
            'metadata' => 'array',
        ];
    }
}
