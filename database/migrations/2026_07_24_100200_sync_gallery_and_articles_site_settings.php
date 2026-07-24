<?php

use App\Filament\Pages\ManageSiteSettings;
use App\Models\SiteSetting;
use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\Cache;

return new class extends Migration
{
    public function up(): void
    {
        $navDefaults = ManageSiteSettings::navigationDefaults();
        $navExisting = SiteSetting::query()->where('key', 'navigation')->value('value');
        $navMerged = array_replace_recursive($navDefaults, is_array($navExisting) ? $navExisting : []);
        $navMerged['gallery'] = $navDefaults['gallery'];
        $navMerged['articles'] = $navDefaults['articles'];

        SiteSetting::updateOrCreate(['key' => 'navigation'], ['value' => $navMerged]);

        SiteSetting::updateOrCreate(
            ['key' => 'gallery'],
            ['value' => ManageSiteSettings::galleryDefaults()],
        );

        SiteSetting::updateOrCreate(
            ['key' => 'articles'],
            ['value' => ManageSiteSettings::articlesDefaults()],
        );

        Cache::forget('site_settings.navigation');
        Cache::forget('site_settings.gallery');
        Cache::forget('site_settings.articles');
    }

    public function down(): void
    {
        // Non-destructive sync migration.
    }
};
