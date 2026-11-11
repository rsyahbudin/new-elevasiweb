<?php

namespace App\Http\Requests;

use App\Support\PurposeOptions;
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
        $referralOptions = ReferralOptions::all();
        $referralKeys = collect($referralOptions)->pluck('key')->filter()->values()->all();
        $selectedReferral = ReferralOptions::find((string) $this->input('referral_source', ''));
        $requiresReferralDetail = (bool) ($selectedReferral['requires_detail'] ?? false);

        $purposeOptions = PurposeOptions::all();
        $purposeKeys = collect($purposeOptions)->pluck('key')->filter()->values()->all();
        $selectedPurpose = PurposeOptions::find((string) $this->input('inquiry_purpose', ''));
        $requiresPurposeDetail = (bool) ($selectedPurpose['requires_detail'] ?? false);

        return [
            'name' => ['required', 'string', 'max:120'],
            'contact' => ['required', 'string', 'max:150'],
            'message' => ['required', 'string', 'max:5000'],
            'source_page' => ['nullable', 'string', 'max:500'],
            'contact_person' => ['nullable', 'integer', 'min:0', 'max:1'],
            'inquiry_purpose' => [
                Rule::requiredIf(count($purposeKeys) > 0),
                'nullable',
                'string',
                Rule::in($purposeKeys),
            ],
            'inquiry_purpose_detail' => [
                Rule::requiredIf($requiresPurposeDetail),
                'nullable',
                'string',
                'max:200',
            ],
            'referral_source' => [
                Rule::requiredIf(count($referralKeys) > 0),
                'nullable',
                'string',
                Rule::in($referralKeys),
            ],
            'referral_detail' => [
                Rule::requiredIf($requiresReferralDetail),
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
            'inquiry_purpose.required' => __('inquiry.validation.purpose_required'),
            'inquiry_purpose.in' => __('inquiry.validation.purpose_in'),
            'inquiry_purpose_detail.required' => __('inquiry.validation.purpose_detail_required'),
            'referral_source.required' => __('inquiry.validation.referral_source_required'),
            'referral_source.in' => __('inquiry.validation.referral_source_in'),
            'referral_detail.required' => __('inquiry.validation.referral_detail_required'),
        ];
    }
}
