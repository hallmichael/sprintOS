<?php

namespace App\Modules\Crud\Http\Requests;

use App\Modules\Crud\Domain\Data\FieldType;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rules\Enum;

final class SaveDefinitionRequest extends FormRequest
{
    public function rules(): array
    {
        return [
            'name'              => ['required', 'string', 'max:255'],
            'name_plural'       => ['sometimes', 'string', 'max:255'],
            'is_published'      => ['sometimes', 'boolean'],
            'fields'            => ['required', 'array', 'min:1'],
            'fields.*.key'      => ['required', 'string', 'regex:/^[a-z0-9_]+$/'],
            'fields.*.label'    => ['required', 'string'],
            'fields.*.type'     => ['required', new Enum(FieldType::class)],
            'fields.*.required' => ['required', 'boolean'],
            'fields.*.options'  => ['sometimes', 'nullable', 'array'],
            'fields.*.options.*' => ['string'],
        ];
    }
}
