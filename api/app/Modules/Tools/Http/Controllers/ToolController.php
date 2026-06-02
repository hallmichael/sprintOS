<?php

namespace App\Modules\Tools\Http\Controllers;

use App\Modules\Ai\Domain\Data\ToolUse;
use App\Modules\Tenancy\Domain\Services\TenantContext;
use App\Modules\Tools\Domain\Models\Tool;
use App\Modules\Tools\Domain\Services\ToolDispatcher;
use App\Modules\Tools\Domain\Services\ToolRegistry;
use App\Modules\Tools\Http\Requests\RegisterToolRequest;
use App\Modules\Tools\Http\Resources\ToolResource;
use App\Shared\Http\Controller;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;
use Illuminate\Support\Str;

final class ToolController extends Controller
{
    public function __construct(
        private readonly TenantContext $context,
        private readonly ToolRegistry $registry,
        private readonly ToolDispatcher $dispatcher,
    ) {}

    /** GET /api/tools — registered tools for the active org. */
    public function index(): AnonymousResourceCollection
    {
        return ToolResource::collection(Tool::query()->get());
    }

    /** POST /api/tools — register a tool (admin). */
    public function store(RegisterToolRequest $request): JsonResponse
    {
        abort_unless(
            $this->registry->hasHandler($request->validated('handler')),
            422,
            "Unknown tool handler '{$request->validated('handler')}'.",
        );

        $tool = Tool::create($request->validated());

        return response()->json(ToolResource::make($tool), 201);
    }

    /** POST /api/tools/{key}/invoke — run a tool directly (testing/admin). */
    public function invoke(string $key): JsonResponse
    {
        $input = request()->validate(['input' => ['array']])['input'] ?? [];

        $result = $this->dispatcher->dispatch(
            $this->context->require()->id,
            new ToolUse((string) Str::ulid(), $key, $input),
        );

        return response()->json([
            'content' => $result->content,
            'is_error' => $result->isError,
        ], $result->isError ? 422 : 200);
    }
}
