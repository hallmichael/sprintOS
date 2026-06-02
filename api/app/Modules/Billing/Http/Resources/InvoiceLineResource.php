<?php

namespace App\Modules\Billing\Http\Resources;

use App\Modules\Billing\Domain\Models\InvoiceLine;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

/** @mixin InvoiceLine */
final class InvoiceLineResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'service' => $this->service,
            'description' => $this->description,
            'quantity' => (float) $this->quantity,
            'raw_cost' => (float) $this->raw_cost,
            'billable_cost' => (float) $this->billable_cost,
        ];
    }
}
