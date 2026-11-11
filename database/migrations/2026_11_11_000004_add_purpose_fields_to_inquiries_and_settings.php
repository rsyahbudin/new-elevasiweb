<?php

use App\Filament\Pages\ManageSiteSettings;
use App\Models\SiteSetting;
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('inquiries', function (Blueprint $table) {
            $table->string('inquiry_purpose')->nullable()->after('message');
            $table->string('inquiry_purpose_detail')->nullable()->after('inquiry_purpose');
        });

        $defaults = ManageSiteSettings::contactDefaults();
        $existing = SiteSetting::query()->where('key', 'contact')->value('value');
        $existing = is_array($existing) ? $existing : [];
        $merged = array_replace_recursive($defaults, $existing);

        foreach ([
            'inquiry_dialog_purpose_label',
            'inquiry_dialog_purpose_placeholder',
            'inquiry_dialog_purpose_detail_label',
            'inquiry_dialog_purpose_detail_placeholder',
        ] as $key) {
            if (! array_key_exists($key, $existing) && array_key_exists($key, $defaults)) {
                $merged[$key] = $defaults[$key];
            }
        }

        $hasOptions = is_array($existing['purpose_options'] ?? null)
            && collect($existing['purpose_options'])->filter()->isNotEmpty();

        if (! $hasOptions) {
            $merged['purpose_options'] = ManageSiteSettings::purposeOptionDefaults();
        }

        SiteSetting::updateOrCreate(['key' => 'contact'], ['value' => $merged]);
        Cache::forget('site_settings.contact');
    }

    public function down(): void
    {
        Schema::table('inquiries', function (Blueprint $table) {
            $table->dropColumn(['inquiry_purpose', 'inquiry_purpose_detail']);
        });
    }
};
