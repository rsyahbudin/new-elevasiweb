<?php

namespace App\Actions\Inquiries;

use App\Enums\UserRole;
use App\Models\Inquiry;
use App\Models\User;
use App\Notifications\NewInquiryReceived;

class SubmitInquiry
{
    /**
     * @param  array{name: string, contact: string, message: string, source_page?: ?string, ip_address?: ?string}  $data
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
