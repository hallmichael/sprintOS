<?php

namespace App\Modules\Tenancy\Domain\Concerns;

use Illuminate\Database\Eloquent\Builder;

/**
 * Apply to every tenant-owned Eloquent model. Adds a global scope filtering by the
 * current tenant context and auto-fills tenant_id on create. Enforced by tests/Architecture.
 */
trait BelongsToTenant
{
    protected static function bootBelongsToTenant(): void
    {
        static::addGlobalScope('tenant', function (Builder $builder) {
            if ($tenantId = app('tenant.context')->id()) {
                $builder->where($builder->getModel()->getTable() . '.tenant_id', $tenantId);
            }
        });

        static::creating(function ($model) {
            if (! $model->tenant_id && $id = app('tenant.context')->id()) {
                $model->tenant_id = $id;
            }
        });
    }
}
