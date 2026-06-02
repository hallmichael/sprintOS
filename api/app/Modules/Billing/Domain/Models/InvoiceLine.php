<?php

namespace App\Modules\Billing\Domain\Models;

use App\Modules\Tenancy\Domain\Concerns\BelongsToTenant;
use Illuminate\Database\Eloquent\Concerns\HasUlids;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class InvoiceLine extends Model
{
    use BelongsToTenant, HasUlids;

    protected $fillable = [
        'tenant_id', 'invoice_id', 'service', 'description',
        'quantity', 'unit', 'raw_cost', 'billable_cost',
    ];

    protected function casts(): array
    {
        return [
            'quantity' => 'decimal:4',
            'raw_cost' => 'decimal:6',
            'billable_cost' => 'decimal:6',
        ];
    }

    public function invoice(): BelongsTo
    {
        return $this->belongsTo(Invoice::class);
    }
}
