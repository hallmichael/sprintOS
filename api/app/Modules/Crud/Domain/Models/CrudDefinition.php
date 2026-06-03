<?php

namespace App\Modules\Crud\Domain\Models;

use App\Modules\Crud\Domain\Data\FieldDefinition;
use App\Modules\Tenancy\Domain\Concerns\BelongsToTenant;
use Illuminate\Database\Eloquent\Concerns\HasUlids;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Support\Collection;

class CrudDefinition extends Model
{
    use BelongsToTenant, HasUlids;

    protected $fillable = [
        'tenant_id', 'key', 'name', 'name_plural', 'fields', 'is_published', 'version',
    ];

    protected function casts(): array
    {
        return [
            'fields'       => 'array',
            'is_published' => 'boolean',
            'version'      => 'integer',
        ];
    }

    public function records(): HasMany
    {
        return $this->hasMany(CrudRecord::class, 'definition_id');
    }

    /**
     * Typed field definitions from the JSON column.
     *
     * @return Collection<int, FieldDefinition>
     */
    public function fieldDefinitions(): Collection
    {
        return collect($this->fields ?? [])->map(fn ($f) => FieldDefinition::fromArray($f));
    }

    /**
     * Build a Laravel validation rule array for one record's data.
     *
     * @return array<string, array<string>>
     */
    public function validationRules(): array
    {
        $rules = [];
        foreach ($this->fieldDefinitions() as $field) {
            $rules["data.{$field->key}"] = $field->type->validationRules($field->required);
        }

        return $rules;
    }
}
