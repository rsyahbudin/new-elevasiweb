<?php

namespace App\Actions\Inquiries;

use App\Enums\UserRole;
use App\Models\Inquiry;
use App\Models\User;
use App\Notifications\NewInquiryReceived;

class SubmitInquiry
{
    /**
     * @param  array{name: string, contact: string, message: string, inquiry_purpose?: ?string, inquiry_purpose_detail?: ?string, project_location?: ?string, has_drawings?: ?string, target_budget?: ?string, referral_source?: ?string, referral_detail?: ?string, source_page?: ?string, ip_address?: ?string}  $data
     */
    public function handle(array $data): Inquiry
    {
        $inquiry = Inquiry::create($data);

        User::query()
            ->where('role', UserRole::Admin)
            ->get()
            ->each(fn (User $admin) => $admin->notify(new NewInquiryReceived($inquiry)));

        return $inquiry;
    }
}
