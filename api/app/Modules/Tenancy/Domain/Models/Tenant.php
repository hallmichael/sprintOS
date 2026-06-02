<?php

namespace App\Modules\Tenancy\Domain\Models;

use Illuminate\Database\Eloquent\Concerns\HasUlids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Tenant extends Model
{
    use HasFactory, HasUlids, SoftDeletes;

    protected $fillable = [
        'name',
        'slug',
        'settings',
        'is_active',
    ];

    protected function casts(): array
    {
        return [
            'settings'  => 'array',
            'is_active' => 'boolean',
        ];
    }

    /**
     * The S3 key prefix for this tenant's data lake files.
     * Pattern: lake/{tenant_id}/...
     */
    public function s3Prefix(): string
    {
        return "lake/{$this->id}";
    }

    /**
     * The OpenSearch index prefix for this tenant.
     * Always inject this into every vector query.
     */
    public function openSearchNamespace(): string
    {
        return $this->id;
    }
}
