<?php

namespace App\Modules\DataLake\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

/** @mixin \App\Modules\DataLake\Domain\Models\DataSource */
final class DataSourceResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id'             => $this->id,
            'name'           => $this->name,
            'type'           => $this->type,
            'status'         => $this->status,
            'last_synced_at' => $this->last_synced_at,
            'created_at'     => $this->created_at,
        ];
    }
}
