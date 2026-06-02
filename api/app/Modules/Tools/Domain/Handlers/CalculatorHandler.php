<?php

namespace App\Modules\Tools\Domain\Handlers;

use App\Modules\Tools\Domain\Contracts\ToolHandler;
use InvalidArgumentException;

/**
 * Built-in sample tool: arithmetic on two numbers. Free (no metering).
 * Demonstrates the registered-tool → tool-use → dispatch path.
 */
final class CalculatorHandler implements ToolHandler
{
    public function handle(array $input, array $context): array
    {
        $a = (float) ($input['a'] ?? 0);
        $b = (float) ($input['b'] ?? 0);
        $op = $input['op'] ?? 'add';

        $result = match ($op) {
            'add' => $a + $b,
            'subtract' => $a - $b,
            'multiply' => $a * $b,
            'divide' => $b != 0.0 ? $a / $b : throw new InvalidArgumentException('Division by zero'),
            default => throw new InvalidArgumentException("Unknown op: {$op}"),
        };

        return ['result' => $result];
    }
}
