<?php

namespace App\Modules\DataLake\Http\Controllers;

use App\Modules\DataLake\Domain\Services\RetrievalService;
use App\Modules\Tenancy\Domain\Services\TenantContext;
use App\Shared\Http\Controller;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Str;

/**
 * RAG search endpoint (Build Guide 4.6).
 * The caller's tenant + roles are always injected — role filtering is not optional.
 */
final class RetrievalController extends Controller
{
    public function __construct(
        private readonly RetrievalService $retrieval,
        private readonly TenantContext $context,
    ) {}

    /** POST /api/datalake/search */
    public function search(Request $request): JsonResponse
    {
        $request->validate([
            'query'  => ['required', 'string', 'max:2000'],
            'top_k'  => ['sometimes', 'integer', 'min:1', 'max:20'],
        ]);

        $tenantId = $this->context->require()->id;
        $user     = $request->user();
        // Build the effective role set: roles are hierarchical (admin ⊇ member ⊇ viewer).
        // Passing all implied roles lets role-tagged docs be found by higher-privilege callers.
        $roles    = $user ? $this->effectiveRoles($user->roleIn($tenantId) ?? 'member') : ['member'];

        $results = $this->retrieval->search(
            tenantId:      $tenantId,
            query:         (string) $request->input('query'),
            roles:         $roles,
            topK:          (int) $request->input('top_k', 5),
            correlationId: (string) Str::ulid(),
        );

        return response()->json([
            'query'   => $request->input('query'),
            'results' => array_map(fn ($r) => [
                'text'     => $r->text,
                'score'    => round($r->score, 4),
                'title'    => $r->metadata['title'] ?? null,
                'chunk_id' => $r->chunkId,
            ], $results),
            'context' => $this->retrieval->buildContext($results),
        ]);
    }

    /** Admin sees admin+member+viewer docs; member sees member+viewer; viewer sees viewer. */
    private function effectiveRoles(string $role): array
    {
        return match ($role) {
            'admin'  => ['admin', 'member', 'viewer', 'public'],
            'member' => ['member', 'viewer', 'public'],
            default  => ['viewer', 'public'],
        };
    }
}
