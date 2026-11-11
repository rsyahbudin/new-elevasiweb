<?php

namespace Tests\Unit;

use App\Models\SiteSetting;
use ReflectionMethod;
use Tests\TestCase;

class SiteSettingLocaleTest extends TestCase
{
    public function test_resolve_locale_prefers_requested_language(): void
    {
        $value = ['id' => 'Teman', 'en' => 'Friend'];

        $this->assertSame('Teman', $this->resolve($value, 'id'));
        $this->assertSame('Friend', $this->resolve($value, 'en'));
    }

    public function test_resolve_locale_falls_back_when_translation_empty(): void
    {
        $value = ['id' => 'Teman', 'en' => ''];

        $this->assertSame('Teman', $this->resolve($value, 'id'));
        $this->assertSame('Teman', $this->resolve($value, 'en'));
    }

    public function test_resolve_locale_nested_referral_options(): void
    {
        $value = [
            'referral_options' => [
                [
                    'key' => 'friend',
                    'requires_detail' => true,
                    'label' => ['id' => 'Teman', 'en' => 'Friend'],
                    'detail_label' => ['id' => 'Nama teman', 'en' => ''],
                ],
            ],
        ];

        $id = $this->resolve($value, 'id');
        $en = $this->resolve($value, 'en');

        $this->assertSame('Teman', $id['referral_options'][0]['label']);
        $this->assertSame('Friend', $en['referral_options'][0]['label']);
        $this->assertSame('Nama teman', $en['referral_options'][0]['detail_label']);
        $this->assertTrue($en['referral_options'][0]['requires_detail']);
        $this->assertSame('friend', $en['referral_options'][0]['key']);
    }

    private function resolve(mixed $value, string $locale): mixed
    {
        $method = new ReflectionMethod(SiteSetting::class, 'resolveLocale');
        $method->setAccessible(true);

        return $method->invoke(null, $value, $locale);
    }
}
