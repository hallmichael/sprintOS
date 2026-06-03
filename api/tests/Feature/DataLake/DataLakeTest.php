<?php

/**
 * Phase 4 — Data lake & RAG.
 *
 * Tests: source management, file upload, ingestion pipeline (chunk→embed→index),
 * role-filtered retrieval, RAG search endpoint, rag_search tool, tenant isolation.
 */

use App\Modules\Ai\Domain\Contracts\ModelClient;
use App\Modules\Ai\Domain\Data\ChatResponse;
use App\Modules\Ai\Domain\Data\TokenUsage;
use App\Modules\DataLake\Domain\Contracts\VectorStore;
use App\Modules\DataLake\Domain\Data\TextChunk;
use App\Modules\DataLake\Domain\Models\DataDocument;
use App\Modules\DataLake\Domain\Models\DataSource;
use App\Modules\DataLake\Domain\Services\ChunkingService;
use App\Modules\DataLake\Domain\Services\IngestionService;
use App\Modules\DataLake\Domain\Services\RetrievalService;
use App\Modules\DataLake\Jobs\IngestDocumentJob;
use App\Modules\Tenancy\Domain\Models\Tenant;
use App\Modules\Tools\Domain\Services\ToolDispatcher;
use App\Modules\Ai\Domain\Data\ToolUse;
use Database\Seeders\UsageRateSeeder;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Queue;

uses(RefreshDatabase::class);

beforeEach(function (): void {
    $this->seed(UsageRateSeeder::class);
    $this->tenant = Tenant::create(['name' => 'Acme', 'slug' => 'acme']);
    $this->admin  = makeUser($this->tenant->id, 'admin',  ['email' => 'admin@acme.com']);
    $this->member = makeUser($this->tenant->id, 'member', ['email' => 'member@acme.com']);
});

// ── 4.1 Source management ─────────────────────────────────────────────────

it('admin can create a data source', function (): void {
    $this->actingAs($this->admin)
        ->postJson('/api/datalake/sources', ['name' => 'Company docs', 'type' => 'upload'])
        ->assertCreated()
        ->assertJsonPath('name', 'Company docs')
        ->assertJsonPath('type', 'upload');
});

it('member cannot create a source', function (): void {
    $this->actingAs($this->member)
        ->postJson('/api/datalake/sources', ['name' => 'Docs'])
        ->assertForbidden();
});

it('lists sources for the active org', function (): void {
    DataSource::withoutGlobalScopes()->create(['tenant_id' => $this->tenant->id, 'name' => 'Docs', 'type' => 'upload']);

    $this->actingAs($this->member)
        ->getJson('/api/datalake/sources')
        ->assertOk()
        ->assertJsonCount(1, 'data');
});

// ── 4.3 File upload ───────────────────────────────────────────────────────

it('uploads a file and queues ingestion', function (): void {
    Queue::fake();

    $source = DataSource::withoutGlobalScopes()->create(['tenant_id' => $this->tenant->id, 'name' => 'Docs', 'type' => 'upload']);
    $file   = UploadedFile::fake()->createWithContent('policy.txt', 'All employees must complete the safety induction.');

    $this->actingAs($this->member)
        ->postJson("/api/datalake/sources/{$source->id}/documents", [
            'file'      => $file,
            'role_tags' => ['member'],
        ])
        ->assertStatus(202)
        ->assertJsonPath('status', 'pending')
        ->assertJsonPath('title', 'policy.txt');

    Queue::assertPushed(IngestDocumentJob::class);
});

// ── 4.5 Chunking ──────────────────────────────────────────────────────────

it('chunks text into overlapping windows', function (): void {
    $chunker = app(ChunkingService::class);
    $text    = implode(' ', array_fill(0, 200, 'word')); // 200 words ~1000 chars

    $chunks = $chunker->chunk('doc1', $text, ['member'], []);

    expect($chunks)->not->toBeEmpty()
        ->and($chunks[0]->documentId)->toBe('doc1')
        ->and($chunks[0]->index)->toBe(0);
});

it('extracts plain text from HTML', function (): void {
    $chunker = app(ChunkingService::class);
    $html    = '<h1>Title</h1><p>Body text here.</p><script>js()</script>';
    $text    = $chunker->extractText($html, 'text/html');

    expect($text)->toContain('Body text here')
        ->and($text)->not->toContain('<p>')
        ->and($text)->not->toContain('js()');
});

// ── 4.5 Ingestion pipeline (fake drivers) ────────────────────────────────

it('ingests a document: chunks, embeds, indexes, updates status', function (): void {
    $source = DataSource::withoutGlobalScopes()->create(['tenant_id' => $this->tenant->id, 'name' => 'Docs', 'type' => 'upload']);
    $file   = UploadedFile::fake()->createWithContent(
        'faq.txt',
        'We offer 24/7 support. Our office hours are 9am-5pm AEST. Contact us at help@acme.com.',
    );

    $doc = app(IngestionService::class)->storeUpload($source, $file, ['member']);

    expect($doc->status)->toBe(DataDocument::STATUS_PENDING);

    app(IngestionService::class)->ingest($doc);

    $doc->refresh();
    expect($doc->status)->toBe(DataDocument::STATUS_INDEXED)
        ->and($doc->chunk_count)->toBeGreaterThan(0);
});

it('marks document failed on ingestion error', function (): void {
    $source = DataSource::withoutGlobalScopes()->create(['tenant_id' => $this->tenant->id, 'name' => 'Docs', 'type' => 'upload']);

    // Create a document with a bad storage key that will cause get() to fail.
    $doc = DataDocument::withoutGlobalScopes()->create([
        'tenant_id'   => $this->tenant->id,
        'source_id'   => $source->id,
        'title'       => 'broken.txt',
        'storage_key' => 'lake/bad/nonexistent.txt',
        'mime_type'   => 'text/plain',
        'role_tags'   => ['member'],
        'status'      => DataDocument::STATUS_PENDING,
    ]);

    try {
        app(IngestionService::class)->ingest($doc);
    } catch (\Throwable) { /* expected */ }

    expect($doc->fresh()->status)->toBe(DataDocument::STATUS_FAILED);
});

// ── 4.6 Retrieval ─────────────────────────────────────────────────────────

it('retrieves relevant chunks via cosine similarity', function (): void {
    $vectors = app(VectorStore::class);

    // Pre-index two chunks with known vectors.
    $vectors->index($this->tenant->id, new TextChunk('doc1', 0, 'The cat sat on the mat.', ['member'], []), [1.0, 0.0]);
    $vectors->index($this->tenant->id, new TextChunk('doc2', 0, 'Dogs love to run in parks.', ['member'], []), [0.0, 1.0]);

    // Query close to the first chunk's vector direction.
    $results = $vectors->search($this->tenant->id, [1.0, 0.0], ['member'], 5);

    expect($results)->not->toBeEmpty()
        ->and($results[0]->text)->toBe('The cat sat on the mat.')
        ->and($results[0]->score)->toBeGreaterThan(0.9);
});

it('retrieval respects role tags — viewer cannot access admin-only chunks', function (): void {
    $vectors = app(VectorStore::class);

    $vectors->index($this->tenant->id, new TextChunk('doc1', 0, 'Confidential salary data.', ['admin'], []), [1.0, 0.0]);
    $vectors->index($this->tenant->id, new TextChunk('doc2', 0, 'Welcome to the team!',      ['member'], []), [1.0, 0.0]);

    // Member role: should only see the member-tagged chunk.
    $results = $vectors->search($this->tenant->id, [1.0, 0.0], ['member'], 10);

    $texts = array_column($results, 'text');
    expect($texts)->not->toContain('Confidential salary data.')
        ->and($texts)->toContain('Welcome to the team!');
});

it('search endpoint returns context and results', function (): void {
    // Pre-index a chunk.
    app(VectorStore::class)->index(
        $this->tenant->id,
        new TextChunk('doc1', 0, 'sprintOS is an agentic business OS.', ['member'], ['title' => 'About']),
        [1.0, 0.0],
    );

    // Fake embed returns the same deterministic vector for any input.
    // The real test is the route wiring + role injection.
    $this->actingAs($this->member)
        ->postJson('/api/datalake/search', ['query' => 'What is sprintOS?'])
        ->assertOk()
        ->assertJsonStructure(['query', 'results', 'context']);
});

// ── rag_search tool wiring ────────────────────────────────────────────────

it('rag_search tool is registered and can be dispatched', function (): void {
    // Register the rag_search tool in the org (required by ToolDispatcher::handlerFor).
    \App\Modules\Tools\Domain\Models\Tool::withoutGlobalScopes()->create([
        'tenant_id' => $this->tenant->id, 'key' => 'rag_search', 'name' => 'RAG search',
        'description' => 'Search the data lake', 'input_schema' => [], 'handler' => 'rag_search',
    ]);

    // Ingest a document so vectors exist (fake embed → consistent hash-based vectors).
    $source = DataSource::withoutGlobalScopes()->create(['tenant_id' => $this->tenant->id, 'name' => 'Docs', 'type' => 'upload']);
    $file   = UploadedFile::fake()->createWithContent('faq.txt', 'Payment terms are net 30 days.');
    $doc    = app(IngestionService::class)->storeUpload($source, $file, ['member']);
    app(IngestionService::class)->ingest($doc);

    $call   = new ToolUse('tu_rag', 'rag_search', ['query' => 'payment terms', 'top_k' => 3]);
    $result = app(ToolDispatcher::class)->dispatch(
        $this->tenant->id, $call, null, ['roles' => ['member']],
    );

    expect($result->isError)->toBeFalse()
        ->and($result->content['results'])->toBeArray();
});

// ── Tenant isolation ───────────────────────────────────────────────────────

it('org A cannot see org B documents', function (): void {
    $orgB    = Tenant::create(['name' => 'Org B', 'slug' => 'org-b']);
    $adminB  = makeUser($orgB->id, 'admin', ['email' => 'admin@orgb.com']);
    $sourceB = DataSource::withoutGlobalScopes()->create(['tenant_id' => $orgB->id, 'name' => 'B Docs', 'type' => 'upload']);

    DataDocument::withoutGlobalScopes()->create([
        'tenant_id' => $orgB->id, 'source_id' => $sourceB->id, 'title' => 'secret.txt',
        'role_tags' => ['member'], 'status' => 'indexed',
    ]);

    $this->actingAs($this->admin)
        ->getJson('/api/datalake/documents')
        ->assertOk()
        ->assertJsonCount(0, 'data');
});

it('org B chunks are not returned to org A searches', function (): void {
    $orgB = Tenant::create(['name' => 'Org B', 'slug' => 'org-b']);

    // Index a chunk for org B.
    app(VectorStore::class)->index(
        $orgB->id,
        new TextChunk('docB', 0, 'Top secret org B data.', ['admin'], []),
        [1.0, 0.0],
    );

    // Org A searches with the same query vector direction.
    $results = app(VectorStore::class)->search($this->tenant->id, [1.0, 0.0], ['admin', 'member'], 10);

    $texts = array_column($results, 'text');
    expect($texts)->not->toContain('Top secret org B data.');
});
