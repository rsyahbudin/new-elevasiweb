<?php

namespace Tests\Unit;

use App\Actions\Inquiries\BuildWhatsAppInquiryMessage;
use App\Models\Inquiry;
use Tests\TestCase;

class BuildWhatsAppInquiryMessageTest extends TestCase
{
    public function test_builds_indonesian_message(): void
    {
        $inquiry = new Inquiry([
            'name' => 'Budi',
            'contact' => '08123456789',
            'message' => 'Mau renovasi rumah',
            'inquiry_purpose' => 'Design & build',
            'inquiry_purpose_detail' => null,
            'project_location' => 'Jakarta Selatan',
            'has_drawings' => 'Ada',
            'target_budget' => '500 juta - 1 M',
            'referral_source' => 'Teman / referensi',
            'referral_detail' => 'Andi',
        ]);

        $message = app(BuildWhatsAppInquiryMessage::class)->handle($inquiry, 'id');

        $this->assertStringContainsString('Halo Elevasi, perkenalkan saya Budi.', $message);
        $this->assertStringContainsString('Kontak: 08123456789', $message);
        $this->assertStringContainsString('Jenis pekerjaan: Design & build', $message);
        $this->assertStringContainsString('Lokasi: Jakarta Selatan', $message);
        $this->assertStringContainsString('Sudah memiliki gambar: Ada', $message);
        $this->assertStringContainsString('Target budget: 500 juta - 1 M', $message);
        $this->assertStringContainsString('Tahu dari: Teman / referensi (Andi)', $message);
        $this->assertStringContainsString('Mau renovasi rumah', $message);
    }

    public function test_builds_english_message(): void
    {
        $inquiry = new Inquiry([
            'name' => 'John',
            'contact' => '08123456789',
            'message' => 'I want a renovation',
            'inquiry_purpose' => 'Other',
            'inquiry_purpose_detail' => 'Landscape',
            'project_location' => 'South Jakarta',
            'has_drawings' => 'No',
            'target_budget' => 'Under 1B',
            'referral_source' => 'Friend / referral',
            'referral_detail' => 'Sarah',
        ]);

        $message = app(BuildWhatsAppInquiryMessage::class)->handle($inquiry, 'en');

        $this->assertStringContainsString('Hi Elevasi, my name is John.', $message);
        $this->assertStringContainsString('Contact: 08123456789', $message);
        $this->assertStringContainsString('Work type: Other (Landscape)', $message);
        $this->assertStringContainsString('Location: South Jakarta', $message);
        $this->assertStringContainsString('Already have drawings: No', $message);
        $this->assertStringContainsString('Target budget: Under 1B', $message);
        $this->assertStringContainsString('Heard about you from: Friend / referral (Sarah)', $message);
        $this->assertStringContainsString('I want a renovation', $message);
    }
}
