<?php

use App\Modules\DataLake\Http\Controllers\DocumentController;
use App\Modules\DataLake\Http\Controllers\RetrievalController;
use App\Modules\DataLake\Http\Controllers\SourceController;
use Illuminate\Support\Facades\Route;

// Public download endpoint (key encodes tenant, no auth required for pre-signed URLs).
Route::get('datalake/download', [DocumentController::class, 'download'])->name('datalake.download');

Route::middleware(['auth:sanctum', 'tenant'])->group(function (): void {

    // ── Sources ──────────────────────────────────────────────────────────
    Route::get('datalake/sources', [SourceController::class, 'index'])->name('datalake.sources.index');
    Route::get('datalake/sources/{id}', [SourceController::class, 'show'])->name('datalake.sources.show');

    Route::middleware('tenant.role:admin')->group(function (): void {
        Route::post('datalake/sources', [SourceController::class, 'store'])->name('datalake.sources.store');
        Route::delete('datalake/sources/{id}', [SourceController::class, 'destroy'])->name('datalake.sources.destroy');
    });

    // ── Documents ─────────────────────────────────────────────────────────
    Route::get('datalake/documents', [DocumentController::class, 'index'])->name('datalake.documents.index');
    Route::get('datalake/documents/{id}', [DocumentController::class, 'show'])->name('datalake.documents.show');
    Route::get('datalake/sources/{sourceId}/documents', [DocumentController::class, 'forSource'])->name('datalake.documents.forSource');

    // Upload (any member may upload; admin may restrict via role_tags)
    Route::post('datalake/sources/{sourceId}/documents', [DocumentController::class, 'store'])->name('datalake.documents.store');

    Route::middleware('tenant.role:admin')->group(function (): void {
        Route::delete('datalake/documents/{id}', [DocumentController::class, 'destroy'])->name('datalake.documents.destroy');
    });

    // ── RAG retrieval ─────────────────────────────────────────────────────
    Route::post('datalake/search', [RetrievalController::class, 'search'])->name('datalake.search');
});
