<?php

namespace App\Modules\Identity\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

/** @mixin \App\Modules\Identity\Domain\Models\SsoConfig */
final class SsoConfigResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id'              => $this->id,
            'tenant_id'       => $this->tenant_id,
            'provider'        => $this->provider,
            'client_id'       => $this->client_id,
            // Never expose client_secret in API responses
            'azure_tenant_id' => $this->azure_tenant_id,
            'extra_scopes'    => $this->extra_scopes ?? [],
            'is_enabled'      => $this->is_enabled,
            'created_at'      => $this->created_at,
        ];
    }
}
