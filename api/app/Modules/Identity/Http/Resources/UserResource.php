<?php

namespace App\Modules\Identity\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

/** @mixin \App\Modules\Identity\Domain\Models\User */
final class UserResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id'        => $this->id,
            'tenant_id' => $this->tenant_id,
            'name'      => $this->name,
            'email'     => $this->email,
            'roles'     => $this->getRoleNames(),
            'created_at' => $this->created_at,
        ];
    }
}
