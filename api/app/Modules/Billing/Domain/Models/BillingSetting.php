<?php

namespace App\Modules\Billing\Domain\Models;

use App\Modules\Tenancy\Domain\Concerns\BelongsToTenant;
use Illuminate\Database\Eloquent\Concerns\HasUlids;
use Illuminate\Database\Eloquent\Model;

class BillingSetting extends Model
{
    use BelongsToTenant, HasUlids;

    protected $fillable = [
        'tenant_id', 'markup_rate', 'currency', 'billing_cycle',
        'spend_cap', 'alert_threshold',
        'stripe_customer_id', 'stripe_payment_method_id', 'card_brand', 'card_last4',
    ];

    protected $hidden = [
        'stripe_customer_id', 'stripe_payment_method_id',
    ];

    protected function casts(): array
    {
        return [
            'markup_rate' => 'decimal:4',
            'spend_cap' => 'decimal:2',
            'alert_threshold' => 'decimal:4',
        ];
    }

    public function hasCard(): bool
    {
        return $this->stripe_payment_method_id !== null;
    }
}
