<?php

namespace App\Modules\Identity\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;
use Illuminate\Validation\Rules\Password;

final class RegisterRequest extends FormRequest
{
    public function rules(): array
    {
        return [
            'tenant_id' => ['required', 'string', 'exists:tenants,id'],
            'name'      => ['required', 'string', 'max:255'],
            // Uniqueness is per-tenant (same email can exist in different orgs)
            'email'     => ['required', 'email', Rule::unique('users')->where('tenant_id', $this->input('tenant_id'))],
            'password'  => ['required', 'confirmed', Password::defaults()],
        ];
    }
}
