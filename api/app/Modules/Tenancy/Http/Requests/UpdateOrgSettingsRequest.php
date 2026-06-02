<?php

namespace App\Modules\Tenancy\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

final class UpdateOrgSettingsRequest extends FormRequest
{
    public function rules(): array
    {
        return [
            'name' => ['sometimes', 'string', 'max:255'],
            'branding' => ['sometimes', 'array'],
            'branding.display_name' => ['sometimes', 'nullable', 'string', 'max:255'],
            'branding.primary_color' => ['sometimes', 'nullable', 'string', 'max:32'],
            'branding.logo_url' => ['sometimes', 'nullable', 'url'],
            'features' => ['sometimes', 'array'],
            'features.crud_builder' => ['sometimes', 'boolean'],
            'features.agents' => ['sometimes', 'boolean'],
            'features.rag' => ['sometimes', 'boolean'],
            'features.connectors' => ['sometimes', 'boolean'],
            'ai_default_tier' => ['sometimes', 'string', 'in:fast,balanced,powerful'],
            'setup_completed' => ['sometimes', 'boolean'],
        ];
    }
}
