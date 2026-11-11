<?php

namespace App\Support;

class ReferralOptions
{
    /**
     * @return array<int, array{key: string, label: string, requires_detail: bool, detail_label: string, detail_placeholder: string}>
     */
    public static function all(?string $locale = null): array
    {
        return ContactSelectOptions::all('referral_options', $locale);
    }

    /**
     * @return array{key: string, label: string, requires_detail: bool, detail_label: string, detail_placeholder: string}|null
     */
    public static function find(string $key, ?string $locale = null): ?array
    {
        return ContactSelectOptions::find('referral_options', $key, $locale);
    }
}
