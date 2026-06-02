<?php

namespace App\Modules\Billing\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

final class UpdateBillingSettingsRequest extends FormRequest
{
    public function rules(): array
    {
        return [
            'markup_rate' => ['sometimes', 'numeric', 'min:0', 'max:10'],
            'currency' => ['sometimes', 'string', 'size:3'],
            'billing_cycle' => ['sometimes', 'string', 'in:monthly,weekly,annual'],
            'spend_cap' => ['sometimes', 'nullable', 'numeric', 'min:0'],
            'alert_threshold' => ['sometimes', 'nullable', 'numeric', 'min:0', 'max:1'],
        ];
    }
}
