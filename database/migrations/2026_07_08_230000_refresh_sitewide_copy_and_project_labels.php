<?php

use App\Filament\Pages\ManageSiteSettings;
use App\Models\SiteSetting;
use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\Cache;

return new class extends Migration
{
    public function up(): void
    {
        $this->forceKeys('hero', ManageSiteSettings::heroDefaults(), [
            'eyebrow',
            'marquee_text',
            'badge_label',
            'cover_caption',
            'headline_line1',
            'headline_accent',
            'headline_word',
            'lede',
            'page_title',
            'meta_description',
        ]);

        SiteSetting::updateOrCreate(
            ['key' => 'services'],
            ['value' => ManageSiteSettings::servicesDefaults()],
        );
        Cache::forget('site_settings.services');

        $this->forceKeys('tentang', ManageSiteSettings::tentangDefaults(), [
            'section_values_label',
            'manifesto',
            'process_intro',
            'body',
            'process',
            'values',
        ]);

        $this->forceKeys('home', ManageSiteSettings::homeDefaults(), [
            'work_heading',
            'work_heading_accent',
            'testimonial_eyebrow',
            'services_eyebrow',
            'work_all_projects',
            'services_view_projects',
        ]);

        $this->forceKeys('footer', ManageSiteSettings::footerDefaults(), [
            'eyebrow',
            'title_line1',
            'title_line2',
            'whatsapp',
        ]);

        $this->forceKeys('projects', ManageSiteSettings::projectsDefaults(), [
            'index_meta_description',
            'index_empty',
            'detail_cta_label',
            'detail_cta_note',
        ]);

        $contactDefaults = ManageSiteSettings::contactDefaults();
        $contactExisting = SiteSetting::query()->where('key', 'contact')->value('value');
        $contactMerged = array_replace_recursive($contactDefaults, is_array($contactExisting) ? $contactExisting : []);
        $contactMerged['process_steps'] = ManageSiteSettings::contactProcessDefaults();
        $contactMerged['prepare_items'] = ManageSiteSettings::contactPrepareDefaults();
        $contactMerged['page_heading'] = $contactDefaults['page_heading'];
        $contactMerged['page_subheading'] = $contactDefaults['page_subheading'];
        $contactMerged['section_process_label'] = $contactDefaults['section_process_label'];

        SiteSetting::updateOrCreate(['key' => 'contact'], ['value' => $contactMerged]);
        Cache::forget('site_settings.contact');
    }

    /**
     * @param  array<int, string>  $forceKeys
     */
    private function forceKeys(string $key, array $defaults, array $forceKeys = []): void
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
