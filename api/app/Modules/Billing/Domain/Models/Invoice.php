<?php

namespace App\Modules\Billing\Domain\Models;

use App\Modules\Tenancy\Domain\Concerns\BelongsToTenant;
use Illuminate\Database\Eloquent\Concerns\HasUlids;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Support\Carbon;

/**
 * @property Carbon $period_start
 * @property Carbon $period_end
 * @property Carbon|null $paid_at
 */
class Invoice extends Model
{
    use BelongsToTenant, HasUlids;

    public const STATUS_DRAFT = 'draft';

    public const STATUS_OPEN = 'open';

    public const STATUS_PAID = 'paid';

    public const STATUS_FAILED = 'failed';

    public const STATUS_VOID = 'void';

    protected $fillable = [
        'tenant_id', 'number', 'period_start', 'period_end', 'status',
        'subtotal_raw', 'markup_total', 'total', 'currency',
        'stripe_invoice_id', 'stripe_payment_intent_id', 'failure_reason', 'paid_at',
    ];

    protected function casts(): array
    {
        return [
            'period_start' => 'date',
            'period_end' => 'date',
            'subtotal_raw' => 'decimal:4',
            'markup_total' => 'decimal:4',
            'total' => 'decimal:4',
            'paid_at' => 'datetime',
        ];
    }

    public function lines(): HasMany
    {
        return $this->hasMany(InvoiceLine::class);
    }
}
