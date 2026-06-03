<?php

namespace App\Modules\Crud\Domain\Services;

use App\Modules\Crud\Domain\Data\FieldDefinition;
use App\Modules\Crud\Domain\Models\CrudDefinition;
use Illuminate\Pagination\LengthAwarePaginator;
use Illuminate\Support\Str;

/**
 * Creates and manages entity definitions (the schema-as-metadata layer).
 * All writes increment the version so consumers can detect schema changes.
 */
final class DefinitionService
{
    /**
     * @param  array<int, FieldDefinition>  $fields
     */
    public function create(
        string $tenantId,
        string $name,
        string $namePlural,
        array $fields,
        bool $isPublished = true,
    ): CrudDefinition {
        return CrudDefinition::create([
            'tenant_id'   => $tenantId,
            'key'         => Str::slug($name, '_'),
            'name'        => $name,
            'name_plural' => $namePlural,
            'fields'      => array_map(fn (FieldDefinition $f) => $f->toArray(), $fields),
            'is_published' => $isPublished,
            'version'     => 1,
        ]);
    }

    /**
     * @param  array<int, FieldDefinition>  $fields
     */
    public function update(CrudDefinition $def, string $name, string $namePlural, array $fields): CrudDefinition
    {
        $def->update([
            'name'        => $name,
            'name_plural' => $namePlural,
            'fields'      => array_map(fn (FieldDefinition $f) => $f->toArray(), $fields),
            'version'     => $def->version + 1,
        ]);

        return $def->fresh();
    }

    public function forTenant(string $tenantId): LengthAwarePaginator
    {
        return CrudDefinition::where('tenant_id', $tenantId)->latest()->paginate();
    }

    public function findByKey(string $tenantId, string $key): ?CrudDefinition
    {
        return CrudDefinition::where('tenant_id', $tenantId)->where('key', $key)->first();
    }
}
