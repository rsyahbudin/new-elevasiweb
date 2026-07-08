<?php

use App\Filament\Pages\ManageSiteSettings;
use App\Models\SiteSetting;
use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\Cache;

return new class extends Migration
{
    public function up(): void
    {
        $this->refreshTentang();
        $this->refreshServices();
        $this->mergeDefaults('hero', ManageSiteSettings::heroDefaults(), [
            'eyebrow',
            'lede',
            'marquee_text',
        ]);
        $this->refreshContactProcess();
    }

    private function refreshServices(): void
    {
        SiteSetting::updateOrCreate(
            ['key' => 'services'],
            ['value' => ManageSiteSettings::servicesDefaults()],
        );
        Cache::forget('site_settings.services');
    }

    private function refreshTentang(): void
    {
        $defaults = ManageSiteSettings::tentangDefaults();
        $existing = SiteSetting::query()->where('key', 'tentang')->value('value');
        $merged = array_replace_recursive($defaults, is_array($existing) ? $existing : []);

        unset($merged['timeline'], $merged['section_timeline_label']);

        foreach ([
            'title',
            'section_eyebrow',
            'section_process_label',
            'section_values_label',
            'manifesto',
            'capabilities_line1',
            'capabilities_line2',
            'tagline',
            'process_intro',
            'body',
            'process',
            'values',
        ] as $key) {
            $merged[$key] = $defaults[$key];
        }

        SiteSetting::updateOrCreate(['key' => 'tentang'], ['value' => $merged]);
        Cache::forget('site_settings.tentang');
    }

    private function refreshContactProcess(): void
    {
        $defaults = ManageSiteSettings::contactDefaults();
        $existing = SiteSetting::query()->where('key', 'contact')->value('value');
        $merged = array_replace_recursive($defaults, is_array($existing) ? $existing : []);

        $merged['process_steps'] = ManageSiteSettings::contactProcessDefaults();
        $merged['prepare_items'] = ManageSiteSettings::contactPrepareDefaults();

        SiteSetting::updateOrCreate(['key' => 'contact'], ['value' => $merged]);
        Cache::forget('site_settings.contact');
    }

    /**
     * @param  array<int, string>  $forceKeys
     */
    private function mergeDefaults(string $key, array $defaults, array $forceKeys = []): void
    {
        $existing = SiteSetting::query()->where('key', $key)->value('value');
        $merged = array_replace_recursive($defaults, is_array($existing) ? $existing : []);

        foreach ($forceKeys as $forceKey) {
            if (array_key_exists($forceKey, $defaults)) {
                $merged[$forceKey] = $defaults[$forceKey];
            }
        }

        SiteSetting::updateOrCreate(['key' => $key], ['value' => $merged]);
        Cache::forget("site_settings.{$key}");
    }

    public function down(): void
    {
        // Non-destructive sync migration.
    }
};
