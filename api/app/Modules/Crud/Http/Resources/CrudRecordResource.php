<?php

namespace App\Modules\Crud\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

/** @mixin \App\Modules\Crud\Domain\Models\CrudRecord */
final class CrudRecordResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id'            => $this->id,
            'definition_id' => $this->definition_id,
            'data'          => $this->data,
            'created_by'    => $this->created_by,
            'created_at'    => $this->created_at,
            'updated_at'    => $this->updated_at,
        ];
    }
}
