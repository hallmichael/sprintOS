<?php

namespace App\Modules\Billing\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

final class AddCardRequest extends FormRequest
{
    public function rules(): array
    {
        return [
            // Tokenised payment method id from Stripe.js — never a raw card number.
            'payment_method_id' => ['required', 'string'],
        ];
    }
}
