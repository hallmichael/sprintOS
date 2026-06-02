<?php

namespace App\Modules\Tools\Http\Resources;

use App\Modules\Tools\Domain\Models\Tool;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

/** @mixin Tool */
final class ToolResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'key' => $this->key,
            'name' => $this->name,
            'description' => $this->description,
            'input_schema' => $this->input_schema,
            'handler' => $this->handler,
            'is_enabled' => $this->is_enabled,
        ];
    }
}
