<?php

use App\Filament\Pages\ManageSiteSettings;
use App\Models\SiteSetting;
use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\Cache;

return new class extends Migration
{
    public function up(): void
    {
        $keys = [
            'navigation' => ManageSiteSettings::navigationDefaults(),
            'footer' => ManageSiteSettings::footerDefaults(),
            'home' => ManageSiteSettings::homeDefaults(),
            'projects' => ManageSiteSettings::projectsDefaults(),
        ];

        foreach ($keys as $key => $defaults) {
            $existing = SiteSetting::query()->where('key', $key)->value('value');
            $merged = array_replace_recursive($defaults, is_array($existing) ? $existing : []);

            if ($key === 'navigation') {
                $merged['contact'] = ManageSiteSettings::navigationDefaults()['contact'];
            }

            SiteSetting::updateOrCreate(['key' => $key], ['value' => $merged]);
        }

        foreach (array_keys($keys) as $key) {
            Cache::forget("site_settings.{$key}");
        }
    }

    public function down(): void
    {
        // Non-destructive sync migration.
    }
};
