<?php

namespace App\Modules\Crud\Domain\Data;

/**
 * One field in a CrudDefinition. Serialised as a JSON object inside
 * crud_definitions.fields[].
 */
final readonly class FieldDefinition
{
    public function __construct(
        public string $key,          // machine key, e.g. "company_name"
        public string $label,        // human label, e.g. "Company name"
        public FieldType $type,
        public bool $required = false,
        /** @var array<string>|null select options */
        public ?array $options = null,
        public ?string $placeholder = null,
        public ?string $helpText = null,
    ) {}

    public function toArray(): array
    {
        return array_filter([
            'key'         => $this->key,
            'label'       => $this->label,
            'type'        => $this->type->value,
            'required'    => $this->required,
            'options'     => $this->options,
            'placeholder' => $this->placeholder,
            'help_text'   => $this->helpText,
        ], fn ($v) => $v !== null);
    }

    public static function fromArray(array $data): self
    {
        return new self(
            key:         $data['key'],
            label:       $data['label'],
            type:        FieldType::from($data['type']),
            required:    (bool) ($data['required'] ?? false),
            options:     $data['options'] ?? null,
            placeholder: $data['placeholder'] ?? null,
            helpText:    $data['help_text'] ?? null,
        );
    }
}
