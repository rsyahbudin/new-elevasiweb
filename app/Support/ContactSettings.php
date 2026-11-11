<?php

namespace App\Support;

use App\Filament\Pages\ManageSiteSettings;
use App\Models\SiteSetting;
use Illuminate\Support\Facades\Storage;

class ContactSettings
{
    /**
     * @return array<int, array{index: int, name: string, role: string, whatsapp_number: string}>
     */
    public static function contactPersons(?string $locale = null): array
    {
        $locale ??= app()->getLocale();
        $contact = SiteSetting::translatedMerged('contact', ManageSiteSettings::contactDefaults(), $locale);
        $persons = collect($contact['contact_persons'] ?? [])
            ->values()
            ->map(function ($person, int $index) use ($locale) {
                if (! is_array($person)) {
                    return null;
                }

                $number = preg_replace('/\D/', '', (string) ($person['whatsapp_number'] ?? ''));

                if ($number === '') {
                    return null;
                }

                $name = trim((string) ($person['name'] ?? ''));
                $role = trim((string) ($person['role'] ?? ''));

                return [
                    'index' => $index,
                    'name' => $name !== '' ? $name : __('inquiry.fallback.contact_person', [], $locale),
                    'role' => $role,
                    'whatsapp_number' => $number,
                ];
            })
            ->filter()
            ->take(2)
            ->values()
            ->all();

        if ($persons !== []) {
            return $persons;
        }

        $fallback = preg_replace('/\D/', '', (string) ($contact['whatsapp_number'] ?? ''));

        if ($fallback === '') {
            return [];
        }

        return [[
            'index' => 0,
            'name' => 'Elevasi',
            'role' => '',
            'whatsapp_number' => $fallback,
        ]];
    }

    /**
     * @return array{index: int, name: string, role: string, whatsapp_number: string}|null
     */
    public static function resolvePerson(?int $index, ?string $locale = null): ?array
    {
        $persons = self::contactPersons($locale);

        if ($persons === []) {
            return null;
        }

        if ($index === null) {
            return $persons[0];
        }

        foreach ($persons as $person) {
            if ((int) $person['index'] === $index) {
                return $person;
            }
        }

        return $persons[0];
    }

    /**
     * @return array{url: ?string, label: ?string, filename: ?string}
     */
    public static function companyProfile(?string $locale = null): array
    {
        $locale ??= app()->getLocale();
        $contact = SiteSetting::translatedMerged('contact', ManageSiteSettings::contactDefaults(), $locale);
        $raw = SiteSetting::get('contact', ManageSiteSettings::contactDefaults());
        $path = ManageSiteSettings::normalizeImagePath(
            is_array($raw) ? ($raw['company_profile_file'] ?? null) : null,
        );

        $label = trim((string) ($contact['company_profile_label'] ?? ''));
        if ($label === '') {
            $label = __('inquiry.fallback.company_profile_label', [], $locale);
        }

        if ($path === null || ! Storage::disk('public')->exists($path)) {
            return [
                'url' => null,
                'label' => $label,
                'filename' => null,
            ];
        }

        return [
            'url' => Storage::disk('public')->url($path),
            'label' => $label,
            'filename' => basename($path),
        ];
    }
}
