<?php

namespace App\Modules\Billing\Http\Resources;

use App\Modules\Billing\Domain\Models\Invoice;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

/** @mixin Invoice */
final class InvoiceResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'number' => $this->number,
            'status' => $this->status,
            'period_start' => $this->period_start->toDateString(),
            'period_end' => $this->period_end->toDateString(),
            'subtotal_raw' => (float) $this->subtotal_raw,
            'markup_total' => (float) $this->markup_total,
            'total' => (float) $this->total,
            'currency' => $this->currency,
            'paid_at' => $this->paid_at,
            'failure_reason' => $this->failure_reason,
            'lines' => InvoiceLineResource::collection($this->whenLoaded('lines')),
            'created_at' => $this->created_at,
        ];
    }
}
