<?php

use App\Modules\Crud\Http\Controllers\DefinitionController;
use App\Modules\Crud\Http\Controllers\RecordController;
use Illuminate\Support\Facades\Route;

Route::middleware(['auth:sanctum', 'tenant'])->group(function (): void {

    // ── Entity definitions (admin only) ───────────────────────────────────
    Route::middleware('tenant.role:admin')->group(function (): void {
        Route::get('crud/definitions', [DefinitionController::class, 'index'])->name('crud.definitions.index');
        Route::post('crud/definitions', [DefinitionController::class, 'store'])->name('crud.definitions.store');
        Route::get('crud/definitions/{key}', [DefinitionController::class, 'show'])->name('crud.definitions.show');
        Route::patch('crud/definitions/{key}', [DefinitionController::class, 'update'])->name('crud.definitions.update');

        // AI proposal — returns a draft definition; not committed until POST /definitions.
        Route::post('crud/propose', [DefinitionController::class, 'propose'])->name('crud.propose');
    });

    // ── Dynamic entity records (any authenticated org member) ─────────────
    Route::get('crud/entities/{key}', [RecordController::class, 'index'])->name('crud.records.index');
    Route::get('crud/entities/{key}/{id}', [RecordController::class, 'show'])->name('crud.records.show');
    Route::post('crud/entities/{key}', [RecordController::class, 'store'])->name('crud.records.store');
    Route::patch('crud/entities/{key}/{id}', [RecordController::class, 'update'])->name('crud.records.update');
    Route::delete('crud/entities/{key}/{id}', [RecordController::class, 'destroy'])->name('crud.records.destroy');
});
