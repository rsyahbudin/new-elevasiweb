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
            $table->string('project_location')->nullable()->after('inquiry_purpose_detail');
            $table->string('has_drawings')->nullable()->after('project_location');
            $table->string('work_type')->nullable()->after('has_drawings');
            $table->string('work_type_detail')->nullable()->after('work_type');
            $table->string('target_budget')->nullable()->after('work_type_detail');
        });

        $defaults = ManageSiteSettings::contactDefaults();
        $existing = SiteSetting::query()->where('key', 'contact')->value('value');
        $existing = is_array($existing) ? $existing : [];
        $merged = array_replace_recursive($defaults, $existing);

        foreach ([
            'inquiry_dialog_location_label',
            'inquiry_dialog_location_placeholder',
            'inquiry_dialog_has_drawings_label',
            'inquiry_dialog_has_drawings_yes',
            'inquiry_dialog_has_drawings_no',
            'inquiry_dialog_budget_label',
            'inquiry_dialog_budget_placeholder',
        ] as $key) {
            if (! array_key_exists($key, $existing) && array_key_exists($key, $defaults)) {
                $merged[$key] = $defaults[$key];
            }
        }

        SiteSetting::updateOrCreate(['key' => 'contact'], ['value' => $merged]);
        Cache::forget('site_settings.contact');
    }

    public function down(): void
    {
        Schema::table('inquiries', function (Blueprint $table) {
            $table->dropColumn([
                'project_location',
                'has_drawings',
                'work_type',
                'work_type_detail',
                'target_budget',
            ]);
        });
    }
};
