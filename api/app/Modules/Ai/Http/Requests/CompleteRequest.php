<?php

namespace App\Modules\Ai\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

final class CompleteRequest extends FormRequest
{
    public function rules(): array
    {
        return [
            'prompt' => ['required', 'string', 'max:100000'],
            'tier' => ['sometimes', 'string', 'in:fast,balanced,powerful'],
            'system' => ['sometimes', 'nullable', 'string'],
            'max_tokens' => ['sometimes', 'integer', 'min:1', 'max:8192'],
        ];
    }
}
