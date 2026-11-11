<?php

use App\Filament\Pages\ManageSiteSettings;
use App\Models\SiteSetting;
use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\Cache;

return new class extends Migration
{
    public function up(): void
    {
        $defaults = ManageSiteSettings::contactDefaults();
        $existing = SiteSetting::query()->where('key', 'contact')->value('value');
        $existing = is_array($existing) ? $existing : [];
        $merged = array_replace_recursive($defaults, $existing);

        $merged['purpose_options'] = ManageSiteSettings::purposeOptionDefaults();
        $merged['inquiry_dialog_purpose_label'] = $defaults['inquiry_dialog_purpose_label'];
        $merged['inquiry_dialog_purpose_placeholder'] = $defaults['inquiry_dialog_purpose_placeholder'];
        $merged['inquiry_dialog_purpose_detail_label'] = $defaults['inquiry_dialog_purpose_detail_label'];
        $merged['inquiry_dialog_purpose_detail_placeholder'] = $defaults['inquiry_dialog_purpose_detail_placeholder'];

        unset(
            $merged['work_type_options'],
            $merged['inquiry_dialog_work_type_label'],
            $merged['inquiry_dialog_work_type_placeholder'],
            $merged['inquiry_dialog_work_type_detail_label'],
            $merged['inquiry_dialog_work_type_detail_placeholder'],
        );

        SiteSetting::updateOrCreate(['key' => 'contact'], ['value' => $merged]);
        Cache::forget('site_settings.contact');
    }

    public function down(): void
    {
        // Intentionally left blank — previous purpose options are not restored.
    }
};
