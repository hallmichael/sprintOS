<?php

namespace App\Modules\Tools\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

final class RegisterToolRequest extends FormRequest
{
    public function rules(): array
    {
        return [
            'key' => ['required', 'string', 'max:64', 'regex:/^[a-z0-9_]+$/'],
            'name' => ['required', 'string', 'max:255'],
            'description' => ['required', 'string'],
            'input_schema' => ['required', 'array'],
            'handler' => ['required', 'string', 'max:64'],
            'is_enabled' => ['sometimes', 'boolean'],
        ];
    }
}
