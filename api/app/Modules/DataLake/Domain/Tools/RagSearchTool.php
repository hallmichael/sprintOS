<?php

namespace App\Modules\DataLake\Domain\Tools;

use App\Modules\DataLake\Domain\Services\RetrievalService;
use App\Modules\Tools\Domain\Contracts\ToolHandler;

/**
 * Agent-callable tool: searches the tenant's data lake.
 * Registered in ToolsServiceProvider under the 'rag_search' handler key.
 *
 * The caller's roles are passed in context so retrieval stays role-filtered.
 */
final class RagSearchTool implements ToolHandler
{
    public function __construct(private readonly RetrievalService $retrieval) {}

    public function handle(array $input, array $context): array
    {
        $query     = (string) ($input['query']     ?? '');
        $topK      = (int)    ($input['top_k']     ?? 5);
        $tenantId  = (string) ($context['tenant_id'] ?? '');
        // Expand roles hierarchically so admin sees member-tagged docs too.
        $rawRole   = (string) (($context['roles'] ?? ['member'])[0] ?? 'member');
        $roles     = match ($rawRole) {
            'admin'  => ['admin', 'member', 'viewer', 'public'],
            'member' => ['member', 'viewer', 'public'],
            default  => ['viewer', 'public'],
        };

        if ($query === '' || $tenantId === '') {
            return ['error' => 'query and tenant_id are required'];
        }

        $results = $this->retrieval->search(
            tenantId:      $tenantId,
            query:         $query,
            roles:         $roles,
            topK:          min($topK, 10),
            correlationId: $context['correlation_id'] ?? null,
        );

        return [
            'results' => array_map(fn ($r) => [
                'text'     => $r->text,
                'score'    => round($r->score, 4),
                'title'    => $r->metadata['title'] ?? null,
                'chunk_id' => $r->chunkId,
            ], $results),
            'context' => $this->retrieval->buildContext($results),
        ];
    }
}
