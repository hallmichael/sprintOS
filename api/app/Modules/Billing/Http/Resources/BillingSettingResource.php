<?php

namespace App\Modules\Billing\Http\Resources;

use App\Modules\Billing\Domain\Models\BillingSetting;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

/** @mixin BillingSetting */
final class BillingSettingResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'tenant_id' => $this->tenant_id,
            'markup_rate' => (float) $this->markup_rate,
            'currency' => $this->currency,
            'billing_cycle' => $this->billing_cycle,
            'spend_cap' => $this->spend_cap !== null ? (float) $this->spend_cap : null,
            'alert_threshold' => $this->alert_threshold !== null ? (float) $this->alert_threshold : null,
            'card' => $this->hasCard() ? [
                'brand' => $this->card_brand,
                'last4' => $this->card_last4,
            ] : null,
        ];
    }
}
