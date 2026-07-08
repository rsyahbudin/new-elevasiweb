<?php

use App\Filament\Pages\ManageSiteSettings;
use App\Models\SiteSetting;
use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\Cache;

return new class extends Migration
{
    public function up(): void
    {
        $heroDefaults = ManageSiteSettings::heroDefaults();
        $heroExisting = SiteSetting::query()->where('key', 'hero')->value('value');
        $heroMerged = array_replace_recursive($heroDefaults, is_array($heroExisting) ? $heroExisting : []);

        foreach (['page_title', 'meta_description', 'headline_line1', 'headline_accent', 'headline_word'] as $key) {
            $heroMerged[$key] = $heroDefaults[$key];
        }

        SiteSetting::updateOrCreate(['key' => 'hero'], ['value' => $heroMerged]);
        Cache::forget('site_settings.hero');

        $projectsDefaults = ManageSiteSettings::projectsDefaults();
        $projectsExisting = SiteSetting::query()->where('key', 'projects')->value('value');
        $projectsMerged = array_replace_recursive($projectsDefaults, is_array($projectsExisting) ? $projectsExisting : []);
        $projectsMerged['index_meta_description'] = $projectsDefaults['index_meta_description'];

        SiteSetting::updateOrCreate(['key' => 'projects'], ['value' => $projectsMerged]);
        Cache::forget('site_settings.projects');
    }

    public function down(): void
    {
        // Non-destructive sync migration.
    }
};
