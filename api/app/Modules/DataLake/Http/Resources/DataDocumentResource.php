<?php

namespace App\Modules\DataLake\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

/** @mixin \App\Modules\DataLake\Domain\Models\DataDocument */
final class DataDocumentResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id'          => $this->id,
            'source_id'   => $this->source_id,
            'title'       => $this->title,
            'mime_type'   => $this->mime_type,
            'size_bytes'  => $this->size_bytes,
            'role_tags'   => $this->role_tags,
            'status'      => $this->status,
            'chunk_count' => $this->chunk_count,
            'error'       => $this->error,
            'created_at'  => $this->created_at,
        ];
    }
}
