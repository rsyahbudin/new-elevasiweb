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

        foreach ([
            'inquiry_dialog_referral_label',
            'inquiry_dialog_referral_placeholder',
            'inquiry_dialog_referral_detail_label',
            'inquiry_dialog_referral_detail_placeholder',
        ] as $key) {
            if (! array_key_exists($key, $existing) && array_key_exists($key, $defaults)) {
                $merged[$key] = $defaults[$key];
            }
        }

        $hasOptions = is_array($existing['referral_options'] ?? null)
            && collect($existing['referral_options'])->filter()->isNotEmpty();

        if (! $hasOptions) {
            $merged['referral_options'] = ManageSiteSettings::referralOptionDefaults();
        }

        SiteSetting::updateOrCreate(['key' => 'contact'], ['value' => $merged]);
        Cache::forget('site_settings.contact');
    }

    public function down(): void
    {
        // Non-destructive sync migration.
    }
};
