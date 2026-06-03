<?php

namespace App\Modules\Crud\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

/** @mixin \App\Modules\Crud\Domain\Models\CrudDefinition */
final class CrudDefinitionResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id'           => $this->id,
            'key'          => $this->key,
            'name'         => $this->name,
            'name_plural'  => $this->name_plural,
            'fields'       => $this->fields,
            'is_published' => $this->is_published,
            'version'      => $this->version,
            'created_at'   => $this->created_at,
        ];
    }
}
