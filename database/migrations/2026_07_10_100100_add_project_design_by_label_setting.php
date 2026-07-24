<?php

use App\Filament\Pages\ManageSiteSettings;
use App\Models\SiteSetting;
use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\Cache;

return new class extends Migration
{
    public function up(): void
    {
        $defaults = ManageSiteSettings::projectsDefaults();
        $existing = SiteSetting::query()->where('key', 'projects')->value('value');
        $merged = array_replace_recursive($defaults, is_array($existing) ? $existing : []);

        $merged['detail_design_by'] = $defaults['detail_design_by'];

        SiteSetting::updateOrCreate(['key' => 'projects'], ['value' => $merged]);
        Cache::forget('site_settings.projects');
    }

    public function down(): void
    {
        // Non-destructive sync migration.
    }
};
