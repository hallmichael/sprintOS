<?php

namespace App\Modules\Identity\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

/** @mixin \App\Modules\Identity\Domain\Models\Membership */
final class MembershipResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'tenant_id'   => $this->tenant_id,
            'tenant_name' => $this->whenLoaded('tenant', fn () => $this->tenant->name),
            'tenant_slug' => $this->whenLoaded('tenant', fn () => $this->tenant->slug),
            'role'        => $this->role,
        ];
    }
}
