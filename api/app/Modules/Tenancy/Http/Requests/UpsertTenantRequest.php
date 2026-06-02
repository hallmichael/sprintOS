<?php

namespace App\Modules\Tenancy\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

/**
 * Validates both create (POST) and partial update (PATCH) of an organisation.
 * name is required only on create; slug uniqueness ignores the row being updated.
 */
final class UpsertTenantRequest extends FormRequest
{
    public function rules(): array
    {
        $creating = $this->isMethod('post');
        $tenantId = $this->route('id');

        return [
            'name'      => [$creating ? 'required' : 'sometimes', 'string', 'max:255'],
            'slug'      => ['sometimes', 'string', 'max:100', Rule::unique('tenants', 'slug')->ignore($tenantId)],
            'settings'  => ['sometimes', 'array'],
            'is_active' => ['sometimes', 'boolean'],
        ];
    }
}
