<?php

use Database\Seeders\RoleSeeder;
use Illuminate\Foundation\Testing\RefreshDatabase;

/*
|--------------------------------------------------------------------------
| Test Case
|--------------------------------------------------------------------------
*/

pest()->extend(Tests\TestCase::class)
    ->use(RefreshDatabase::class)
    ->beforeEach(function (): void {
        // Seed default roles so every feature test has them available.
        $this->seed(RoleSeeder::class);
    })
    ->in('Feature');

/*
|--------------------------------------------------------------------------
| Architecture Test Group
|--------------------------------------------------------------------------
*/

pest()->extend(Tests\TestCase::class)
    ->in('Architecture')
    ->group('architecture');

/*
|--------------------------------------------------------------------------
| Expectations
|--------------------------------------------------------------------------
*/

expect()->extend('toBeOne', fn () => $this->toBe(1));
