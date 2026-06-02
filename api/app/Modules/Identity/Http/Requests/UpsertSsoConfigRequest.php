<?php

namespace App\Modules\Identity\Http\Requests;

use App\Modules\Identity\Domain\Models\SsoConfig;
use Illuminate\Foundation\Http\FormRequest;

final class UpsertSsoConfigRequest extends FormRequest
{
    public function rules(): array
    {
        return [
            'provider'        => ['required', 'string', 'in:'.implode(',', SsoConfig::PROVIDERS)],
            'client_id'       => ['required', 'string'],
            'client_secret'   => ['required', 'string'],
            'azure_tenant_id' => ['nullable', 'string', 'required_if:provider,microsoft'],
            'extra_scopes'    => ['sometimes', 'array'],
            'extra_scopes.*'  => ['string'],
            'is_enabled'      => ['sometimes', 'boolean'],
        ];
    }
}
