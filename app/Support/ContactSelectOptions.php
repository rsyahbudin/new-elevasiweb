<?php

namespace App\Support;

use App\Filament\Pages\ManageSiteSettings;
use App\Models\SiteSetting;

class ContactSelectOptions
{
    /**
     * @return array<int, array{key: string, label: string, requires_detail: bool, detail_label: string, detail_placeholder: string}>
     */
    public static function all(string $settingsKey, ?string $locale = null): array
    {
        $contact = SiteSetting::translatedMerged('contact', ManageSiteSettings::contactDefaults(), $locale);

        return collect($contact[$settingsKey] ?? [])
            ->values()
            ->map(function ($option) {
                if (! is_array($option)) {
                    return null;
                }

                $key = trim((string) ($option['key'] ?? ''));
                $label = trim((string) ($option['label'] ?? ''));

                if ($key === '' || $label === '') {
                    return null;
                }

                return [
                    'key' => $key,
                    'label' => $label,
                    'requires_detail' => (bool) ($option['requires_detail'] ?? false),
                    'detail_label' => trim((string) ($option['detail_label'] ?? '')),
                    'detail_placeholder' => trim((string) ($option['detail_placeholder'] ?? '')),
                ];
            })
            ->filter()
            ->values()
            ->all();
    }

    /**
     * @return array{key: string, label: string, requires_detail: bool, detail_label: string, detail_placeholder: string}|null
     */
    public static function find(string $settingsKey, string $key, ?string $locale = null): ?array
    {
        foreach (self::all($settingsKey, $locale) as $option) {
            if ($option['key'] === $key) {
                return $option;
            }
        }

        return null;
    }
}
