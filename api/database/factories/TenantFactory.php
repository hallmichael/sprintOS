<?php

namespace Database\Factories;

use App\Modules\Tenancy\Domain\Models\Tenant;
use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Str;

/**
 * @extends Factory<Tenant>
 */
class TenantFactory extends Factory
{
    protected $model = Tenant::class;

    public function definition(): array
    {
        $name = fake()->company();

        return [
            'name'      => $name,
            'slug'      => Str::slug($name).'-'.Str::random(4),
            'settings'  => [],
            'is_active' => true,
        ];
    }
}
