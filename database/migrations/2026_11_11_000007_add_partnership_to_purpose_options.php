<?php

use App\Filament\Pages\ManageSiteSettings;
use App\Models\SiteSetting;
use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\Cache;

return new class extends Migration
{
    public function up(): void
    {
        $existing = SiteSetting::query()->where('key', 'contact')->value('value');
        $existing = is_array($existing) ? $existing : [];

        $options = is_array($existing['purpose_options'] ?? null)
            ? array_values($existing['purpose_options'])
            : ManageSiteSettings::purposeOptionDefaults();

        $hasPartnership = collect($options)->contains(
            fn ($option) => is_array($option) && ($option['key'] ?? null) === 'partnership',
        );

        if (! $hasPartnership) {
            $partnership = collect(ManageSiteSettings::purposeOptionDefaults())
                ->firstWhere('key', 'partnership');

            $insertAt = collect($options)->search(
                fn ($option) => is_array($option) && ($option['key'] ?? null) === 'other',
            );

            if ($partnership !== null) {
                if ($insertAt === false) {
                    $options[] = $partnership;
                } else {
                    array_splice($options, (int) $insertAt, 0, [$partnership]);
                }
            }
        }

        $existing['purpose_options'] = array_values($options);

        SiteSetting::updateOrCreate(['key' => 'contact'], ['value' => $existing]);
        Cache::forget('site_settings.contact');
    }

    public function down(): void
    {
        $existing = SiteSetting::query()->where('key', 'contact')->value('value');
        $existing = is_array($existing) ? $existing : [];

        if (! is_array($existing['purpose_options'] ?? null)) {
            return;
        }

        $existing['purpose_options'] = collect($existing['purpose_options'])
            ->reject(fn ($option) => is_array($option) && ($option['key'] ?? null) === 'partnership')
            ->values()
            ->all();

        SiteSetting::updateOrCreate(['key' => 'contact'], ['value' => $existing]);
        Cache::forget('site_settings.contact');
    }
};
