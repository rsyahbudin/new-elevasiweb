<?php

namespace App\Actions\Inquiries;

use App\Models\Inquiry;

class BuildWhatsAppInquiryMessage
{
    public function handle(Inquiry $inquiry): string
    {
        return implode("\n", [
            "Halo Elevasi, perkenalkan saya {$inquiry->name}.",
            "Kontak: {$inquiry->contact}",
            '',
            $inquiry->message,
        ]);
    }
}
