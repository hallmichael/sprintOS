<?php

namespace App\Modules\Tenancy\Domain\Concerns;

use App\Modules\Tenancy\Domain\Models\Tenant;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

/**
 * Apply to every tenant-owned Eloquent model.
 *
 * Adds:
 * - A global scope that auto-filters all queries by the resolved tenant_id.
 * - A boot hook that sets tenant_id on create from the request-scoped TenantContext.
 * - A tenant() relationship.
 *
 * Rule: every model in Modules\/\*\*\/Models that is owned by a tenant MUST use
 * this trait OR be explicitly allow-listed. The Architecture test enforces this.
 */
trait BelongsToTenant
{
    protected static function bootBelongsToTenant(): void
    {
        // Auto-filter every query by the active tenant.
        static::addGlobalScope('tenant', function (Builder $builder): void {
            $tenantId = app('tenant.context')->id();
            if ($tenantId !== null) {
                $builder->where($builder->getModel()->getTable().'.tenant_id', $tenantId);
            }
        });

        // Stamp tenant_id on every new record.
        static::creating(function (self $model): void {
            if (empty($model->tenant_id)) {
                $tenantId = app('tenant.context')->id();
                if ($tenantId !== null) {
                    $model->tenant_id = $tenantId;
                }
            }
        });
    }

    public function tenant(): BelongsTo
    {
        return $this->belongsTo(Tenant::class, 'tenant_id');
    }
}
