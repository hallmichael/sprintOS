<?php

namespace App\Modules\Identity\Http\Requests;

use App\Modules\Identity\Domain\Models\Membership;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rules\Password;

final class RegisterRequest extends FormRequest
{
    public function rules(): array
    {
        return [
            'tenant_id' => ['required', 'string', 'exists:tenants,id'],
            'name'      => ['required', 'string', 'max:255'],
            // Email is globally unique within the deployment (ADR 0005).
            'email'     => ['required', 'email', 'unique:users,email'],
            'password'  => ['required', 'confirmed', Password::defaults()],
            'role'      => ['sometimes', 'string', 'in:'.implode(',', Membership::ROLES)],
        ];
    }
}
