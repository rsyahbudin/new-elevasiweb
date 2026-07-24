<?php

namespace App\Support;

use App\Filament\Pages\ManageSiteSettings;
use App\Models\SiteSetting;

class SiteVerification
{
    public static function googleSearchConsoleToken(): ?string
    {
        $fromEnv = trim((string) config('services.google_search_console.verification', ''));

        if ($fromEnv !== '') {
            return $fromEnv;
        }

        $analytics = SiteSetting::get('analytics', ManageSiteSettings::analyticsDefaults());
        $token = trim((string) ($analytics['google_search_console_verification'] ?? ''));

        return $token !== '' ? $token : null;
    }
}
