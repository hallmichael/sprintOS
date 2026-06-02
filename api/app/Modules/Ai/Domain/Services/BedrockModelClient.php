<?php

namespace App\Modules\Ai\Domain\Services;

use App\Modules\Ai\Domain\Contracts\ModelClient;
use App\Modules\Ai\Domain\Data\ChatRequest;
use App\Modules\Ai\Domain\Data\ChatResponse;
use App\Modules\Ai\Domain\Data\TokenUsage;
use App\Modules\Ai\Domain\Data\ToolUse;
use Aws\BedrockRuntime\BedrockRuntimeClient;

/**
 * Claude via Amazon Bedrock using the Converse API (AI_DRIVER=bedrock).
 * Authenticates with Sprint's IAM role — no customer model keys (ADR 0004).
 *
 * Not exercised in the test suite (needs live AWS); the gateway and metering are
 * tested against FakeModelClient. This driver is the production wiring.
 */
final class BedrockModelClient implements ModelClient
{
    private BedrockRuntimeClient $client;

    public function __construct(?BedrockRuntimeClient $client = null)
    {
        $this->client = $client ?? new BedrockRuntimeClient([
            'region' => config('sprintos.ai.region'),
            'version' => 'latest',
            // Credentials come from the IAM role / environment — never from customers.
        ]);
    }

    public function chat(ChatRequest $request): ChatResponse
    {
        $payload = [
            'modelId' => $request->modelId(),
            'messages' => $this->mapMessages($request->messages),
            'inferenceConfig' => ['maxTokens' => $request->maxTokens],
        ];

        if ($request->system) {
            $payload['system'] = [['text' => $request->system]];
        }

        if ($request->tools !== []) {
            $payload['toolConfig'] = [
                'tools' => array_map(fn ($t) => $t->toBedrockSpec(), $request->tools),
            ];
        }

        $result = $this->client->converse($payload);

        return $this->parse($result->toArray(), $request->modelId());
    }

    /** @param array<int, array{role: string, content: mixed}> $messages */
    private function mapMessages(array $messages): array
    {
        return array_map(fn ($m) => [
            'role' => $m['role'],
            'content' => is_string($m['content']) ? [['text' => $m['content']]] : $m['content'],
        ], $messages);
    }

    private function parse(array $result, string $model): ChatResponse
    {
        $blocks = $result['output']['message']['content'] ?? [];

        $text = null;
        $toolUses = [];
        foreach ($blocks as $block) {
            if (isset($block['text'])) {
                $text = ($text ?? '').$block['text'];
            }
            if (isset($block['toolUse'])) {
                $toolUses[] = new ToolUse(
                    id: $block['toolUse']['toolUseId'],
                    name: $block['toolUse']['name'],
                    input: $block['toolUse']['input'] ?? [],
                );
            }
        }

        return new ChatResponse(
            text: $text,
            toolUses: $toolUses,
            usage: new TokenUsage(
                inputTokens: (int) ($result['usage']['inputTokens'] ?? 0),
                outputTokens: (int) ($result['usage']['outputTokens'] ?? 0),
            ),
            stopReason: $result['stopReason'] ?? 'end_turn',
            model: $model,
        );
    }
}
