<?php

namespace App\Modules\Crud\Domain\Services;

use App\Modules\Crud\Domain\Models\CrudDefinition;
use App\Modules\Crud\Domain\Models\CrudRecord;
use Illuminate\Pagination\LengthAwarePaginator;
use Illuminate\Validation\ValidationException;
use Illuminate\Support\Facades\Validator;

/**
 * Definition-driven CRUD for any entity — CRUD endpoints work for any defined
 * entity without writing new code. Validates against the definition's field rules,
 * then persists / retrieves / deletes CrudRecord rows.
 */
final class DynamicCrudEngine
{
    // ── List ──────────────────────────────────────────────────────────────
    public function list(CrudDefinition $def): LengthAwarePaginator
    {
        return CrudRecord::where('definition_id', $def->id)->latest()->paginate();
    }

    // ── Show ──────────────────────────────────────────────────────────────
    public function find(CrudDefinition $def, string $id): CrudRecord
    {
        return CrudRecord::where('definition_id', $def->id)->findOrFail($id);
    }

    // ── Create ────────────────────────────────────────────────────────────
    public function create(CrudDefinition $def, array $data, string $actorId): CrudRecord
    {
        $this->validate($def, $data);

        return CrudRecord::create([
            'tenant_id'     => $def->tenant_id,
            'definition_id' => $def->id,
            'data'          => $data,
            'created_by'    => $actorId,
        ]);
    }

    // ── Update ────────────────────────────────────────────────────────────
    public function update(CrudDefinition $def, string $id, array $data): CrudRecord
    {
        $record = $this->find($def, $id);
        $this->validate($def, $data, partial: true);

        $record->update(['data' => array_merge($record->data, $data)]);

        return $record->fresh();
    }

    // ── Delete ────────────────────────────────────────────────────────────
    public function delete(CrudDefinition $def, string $id): void
    {
        $this->find($def, $id)->delete();
    }

    // ── Validation ────────────────────────────────────────────────────────
    private function validate(CrudDefinition $def, array $data, bool $partial = false): void
    {
        $rules = $def->validationRules();

        if ($partial) {
            // Only validate fields actually present in the payload.
            $rules = array_filter($rules, fn ($k) => array_key_exists(str_replace('data.', '', $k), $data), ARRAY_FILTER_USE_KEY);
        }

        $validator = Validator::make(['data' => $data], $rules);

        if ($validator->fails()) {
            throw new ValidationException($validator);
        }
    }
}
