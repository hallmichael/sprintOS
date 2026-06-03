<?php

namespace App\Modules\Ai\Domain\Services;

use App\Modules\Ai\Domain\Contracts\ModelClient;
use App\Modules\Ai\Domain\Data\ChatRequest;
use App\Modules\Ai\Domain\Data\ChatResponse;
use App\Modules\Ai\Domain\Data\EmbedRequest;
use App\Modules\Ai\Domain\Data\EmbedResponse;
use App\Modules\Ai\Domain\Data\TokenUsage;

/**
 * Deterministic driver for tests and local dev (AI_DRIVER=fake). No network, no
 * AWS creds. Token counts are derived from text length (≈4 chars/token) so the
 * metering path is exercised end-to-end.
 *
 * Tests can script the next response via willReturn(); otherwise it echoes a
 * canned completion.
 */
final class FakeModelClient implements ModelClient
{
    private ?ChatResponse $next = null;

    /** @var array<int, ChatRequest> */
    public array $received = [];

    public function willReturn(ChatResponse $response): void
    {
        $this->next = $response;
    }

    public function chat(ChatRequest $request): ChatResponse
    {
        $this->received[] = $request;

        $inputTokens = (int) ceil($this->charCount($request) / 4);

        if ($this->next !== null) {
            $scripted = $this->next;
            $this->next = null;

            // Re-stamp usage/model so metering reflects this request.
            return new ChatResponse(
                text: $scripted->text,
                toolUses: $scripted->toolUses,
                usage: new TokenUsage($inputTokens, $scripted->usage->outputTokens),
                stopReason: $scripted->stopReason,
                model: $request->modelId(),
            );
        }

        $text = 'This is a fake completion.';

        return new ChatResponse(
            text: $text,
            toolUses: [],
            usage: new TokenUsage($inputTokens, (int) ceil(strlen($text) / 4)),
            stopReason: 'end_turn',
            model: $request->modelId(),
        );
    }

    public function embed(EmbedRequest $request): EmbedResponse
    {
        // Deterministic pseudo-vectors (8-dim) derived from each text's hash.
        $vectors = [];
        $tokens = 0;
        foreach ($request->inputs as $text) {
            $tokens += (int) ceil(strlen($text) / 4);
            $bytes = array_values(unpack('C*', substr(md5($text, true), 0, 8)));
            $vectors[] = array_map(fn ($b) => round($b / 255, 6), $bytes);
        }

        return new EmbedResponse($vectors, $tokens, $request->modelId());
    }

    private function charCount(ChatRequest $request): int
    {
        $chars = strlen($request->system ?? '');
        foreach ($request->messages as $m) {
            $chars += strlen(is_string($m['content']) ? $m['content'] : json_encode($m['content']));
        }

        return $chars;
    }
}
