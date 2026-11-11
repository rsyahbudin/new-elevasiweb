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
            'referral_source' => 'Teman / referensi',
            'referral_detail' => 'Andi',
        ]);

        $message = app(BuildWhatsAppInquiryMessage::class)->handle($inquiry, 'id');

        $this->assertStringContainsString('Halo Elevasi, perkenalkan saya Budi.', $message);
        $this->assertStringContainsString('Kontak: 08123456789', $message);
        $this->assertStringContainsString('Tahu dari: Teman / referensi (Andi)', $message);
        $this->assertStringContainsString('Mau renovasi rumah', $message);
    }

    public function test_builds_english_message(): void
    {
        $inquiry = new Inquiry([
            'name' => 'John',
            'contact' => '08123456789',
            'message' => 'I want a renovation',
            'referral_source' => 'Friend / referral',
            'referral_detail' => 'Sarah',
        ]);

        $message = app(BuildWhatsAppInquiryMessage::class)->handle($inquiry, 'en');

        $this->assertStringContainsString('Hi Elevasi, my name is John.', $message);
        $this->assertStringContainsString('Contact: 08123456789', $message);
        $this->assertStringContainsString('Heard about you from: Friend / referral (Sarah)', $message);
        $this->assertStringContainsString('I want a renovation', $message);
    }
}
