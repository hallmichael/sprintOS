<?php

namespace App\Modules\Usage\Http\Resources;

use App\Modules\Usage\Domain\Models\UsageEvent;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

/** @mixin UsageEvent */
final class UsageEventResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'service' => $this->service,
            'operation' => $this->operation,
            'model' => $this->model,
            'unit' => $this->unit,
            'quantity' => (float) $this->quantity,
            'raw_cost' => (float) $this->raw_cost,
            'markup_rate' => (float) $this->markup_rate,
            'billable_cost' => (float) $this->billable_cost,
            'currency' => $this->currency,
            'actor_type' => $this->actor_type,
            'correlation_id' => $this->correlation_id,
            'invoice_id' => $this->invoice_id,
            'created_at' => $this->created_at,
        ];
    }
}
