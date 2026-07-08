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
        $merged = array_replace_recursive($defaults, is_array($existing) ? $existing : []);

        foreach ([
            'page_subheading',
            'page_cta_label',
            'inquiry_dialog_title',
            'inquiry_dialog_description',
            'inquiry_dialog_name_label',
            'inquiry_dialog_contact_label',
            'inquiry_dialog_contact_placeholder',
            'inquiry_dialog_message_label',
            'inquiry_dialog_message_placeholder',
            'inquiry_dialog_submit_label',
            'inquiry_dialog_submitting_label',
            'inquiry_dialog_cancel_label',
        ] as $key) {
            $merged[$key] = $defaults[$key];
        }

        SiteSetting::updateOrCreate(['key' => 'contact'], ['value' => $merged]);
        Cache::forget('site_settings.contact');
    }

    public function down(): void
    {
        // Non-destructive sync migration.
    }
};
