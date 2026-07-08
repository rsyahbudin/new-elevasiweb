<?php

use App\Filament\Pages\ManageSiteSettings;
use App\Models\SiteSetting;
use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\Cache;

return new class extends Migration
{
    public function up(): void
    {
        $tentangDefaults = ManageSiteSettings::tentangDefaults();
        $existing = SiteSetting::query()->where('key', 'tentang')->value('value');
        $merged = array_replace_recursive($tentangDefaults, is_array($existing) ? $existing : []);

        unset(
            $merged['timeline'],
            $merged['section_timeline_label'],
            $merged['capabilities_line1'],
            $merged['capabilities_line2'],
            $merged['tagline'],
        );

        foreach (['manifesto', 'process_intro', 'body', 'values'] as $key) {
            $merged[$key] = $tentangDefaults[$key];
        }

        SiteSetting::updateOrCreate(['key' => 'tentang'], ['value' => $merged]);
        Cache::forget('site_settings.tentang');

        $heroDefaults = ManageSiteSettings::heroDefaults();
        $heroExisting = SiteSetting::query()->where('key', 'hero')->value('value');
        $heroMerged = array_replace_recursive($heroDefaults, is_array($heroExisting) ? $heroExisting : []);

        foreach (['eyebrow', 'lede', 'marquee_text'] as $key) {
            $heroMerged[$key] = $heroDefaults[$key];
        }

        SiteSetting::updateOrCreate(['key' => 'hero'], ['value' => $heroMerged]);
        Cache::forget('site_settings.hero');
    }

    public function down(): void
    {
        // Non-destructive sync migration.
    }
};
