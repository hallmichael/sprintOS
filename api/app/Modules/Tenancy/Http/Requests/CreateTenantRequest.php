<?php

namespace App\Modules\Tenancy\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

final class CreateTenantRequest extends FormRequest
{
    public function rules(): array
    {
        return [
            'name'     => ['required', 'string', 'max:255'],
            'slug'     => ['sometimes', 'string', 'max:100', 'unique:tenants,slug'],
            'settings' => ['sometimes', 'array'],
        ];
    }
}
