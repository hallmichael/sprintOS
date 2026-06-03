<?php

namespace App\Modules\Crud\Domain\Data;

/**
 * The supported field types for dynamic entity definitions.
 * Determines input component, validation rules and display formatting.
 */
enum FieldType: string
{
    case Text     = 'text';
    case TextArea = 'textarea';
    case Number   = 'number';
    case Currency = 'currency';
    case Date     = 'date';
    case DateTime = 'datetime';
    case Boolean  = 'boolean';
    case Select   = 'select';    // options[] required
    case Email    = 'email';
    case Phone    = 'phone';
    case Url      = 'url';

    /** Laravel validation rules for this type. */
    public function validationRules(bool $required): array
    {
        $base = match ($this) {
            self::Number, self::Currency => ['numeric'],
            self::Date                  => ['date'],
            self::DateTime              => ['date'],
            self::Boolean               => ['boolean'],
            self::Email                 => ['email'],
            self::Url                   => ['url'],
            default                     => ['string', 'max:65535'],
        };

        return $required ? array_merge(['required'], $base) : array_merge(['nullable'], $base);
    }
}
