<?php

namespace App\Actions\Inquiries;

use App\Models\Inquiry;
use Illuminate\Support\Facades\App;

class BuildWhatsAppInquiryMessage
{
    public function handle(Inquiry $inquiry, ?string $locale = null): string
    {
        $locale = $locale ?? App::getLocale();

        $lines = [
            __('inquiry.whatsapp.greeting', ['name' => $inquiry->name], $locale),
            __('inquiry.whatsapp.contact', ['contact' => $inquiry->contact], $locale),
        ];

        if (filled($inquiry->inquiry_purpose)) {
            $purpose = (string) $inquiry->inquiry_purpose;

            if (filled($inquiry->inquiry_purpose_detail)) {
                $purpose .= " ({$inquiry->inquiry_purpose_detail})";
            }

            $lines[] = __('inquiry.whatsapp.purpose', ['purpose' => $purpose], $locale);
        }

        if (filled($inquiry->project_location)) {
            $lines[] = __('inquiry.whatsapp.location', ['location' => $inquiry->project_location], $locale);
        }

        if (filled($inquiry->has_drawings)) {
            $lines[] = __('inquiry.whatsapp.has_drawings', ['value' => $inquiry->has_drawings], $locale);
        }

        if (filled($inquiry->target_budget)) {
            $lines[] = __('inquiry.whatsapp.budget', ['budget' => $inquiry->target_budget], $locale);
        }

        if (filled($inquiry->referral_source)) {
            $source = (string) $inquiry->referral_source;

            if (filled($inquiry->referral_detail)) {
                $source .= " ({$inquiry->referral_detail})";
            }

            $lines[] = __('inquiry.whatsapp.referral', ['source' => $source], $locale);
        }

        $lines[] = '';
        $lines[] = $inquiry->message;

        return implode("\n", $lines);
    }
}
