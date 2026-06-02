<?php

namespace App\Modules\Identity\Http\Resources;

use App\Modules\Tenancy\Domain\Services\TenantContext;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

/** @mixin \App\Modules\Identity\Domain\Models\User */
final class UserResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        // Org-level role is relative to the active organisation, if one is set.
        $activeTenantId = app(TenantContext::class)->id();

        return [
            'id'                => $this->id,
            'name'              => $this->name,
            'email'             => $this->email,
            'is_platform_admin' => $this->isPlatformAdmin(),
            'role'              => $activeTenantId ? $this->roleIn($activeTenantId) : null,
            'created_at'        => $this->created_at,
        ];
    }
}
