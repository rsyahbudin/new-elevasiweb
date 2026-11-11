<?php

namespace App\Http\Requests;

use App\Support\ReferralOptions;
use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class StoreInquiryRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    /**
     * @return array<string, ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        $options = ReferralOptions::all();
        $keys = collect($options)->pluck('key')->filter()->values()->all();
        $selected = ReferralOptions::find((string) $this->input('referral_source', ''));
        $requiresDetail = (bool) ($selected['requires_detail'] ?? false);

        return [
            'name' => ['required', 'string', 'max:120'],
            'contact' => ['required', 'string', 'max:150'],
            'message' => ['required', 'string', 'max:5000'],
            'source_page' => ['nullable', 'string', 'max:500'],
            'contact_person' => ['nullable', 'integer', 'min:0', 'max:1'],
            'referral_source' => [
                Rule::requiredIf(count($keys) > 0),
                'nullable',
                'string',
                Rule::in($keys),
            ],
            'referral_detail' => [
                Rule::requiredIf($requiresDetail),
                'nullable',
                'string',
                'max:200',
            ],
            'company' => ['nullable', 'string'], // honeypot — checked (not rejected) in the controller
        ];
    }

    /**
     * @return array<string, string>
     */
    public function messages(): array
    {
        return [
            'referral_source.required' => __('inquiry.validation.referral_source_required'),
            'referral_source.in' => __('inquiry.validation.referral_source_in'),
            'referral_detail.required' => __('inquiry.validation.referral_detail_required'),
        ];
    }
}
