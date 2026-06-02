<?php

namespace App\Modules\Usage\Domain\Models;

use Illuminate\Database\Eloquent\Concerns\HasUlids;
use Illuminate\Database\Eloquent\Model;

/**
 * Deployment-wide rate card. NOT tenant-scoped (one customer per deployment;
 * rates are shared across that customer's orgs). Allow-listed in the arch test.
 */
class UsageRate extends Model
{
    use HasUlids;

    protected $fillable = [
        'service', 'operation', 'model', 'unit', 'raw_unit_cost', 'currency',
    ];

    protected function casts(): array
    {
        return [
            'raw_unit_cost' => 'decimal:10',
        ];
    }
}
