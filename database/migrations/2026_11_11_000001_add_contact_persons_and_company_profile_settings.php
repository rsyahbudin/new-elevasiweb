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

        $existingNumber = preg_replace('/\D/', '', (string) ($existing['whatsapp_number'] ?? ''));
        $hasPersons = is_array($existing['contact_persons'] ?? null)
            && collect($existing['contact_persons'])->filter()->isNotEmpty();

        if (! $hasPersons) {
            $persons = ManageSiteSettings::contactPersonDefaults();

            if ($existingNumber !== '') {
                $persons[0]['whatsapp_number'] = $existingNumber;
                $persons[1]['whatsapp_number'] = $existingNumber;
            }

            $merged['contact_persons'] = $persons;
        }

        foreach ([
            'company_profile_label',
            'section_team_label',
            'section_download_label',
            'inquiry_dialog_person_label',
        ] as $key) {
            if (! array_key_exists($key, $existing) && array_key_exists($key, $defaults)) {
                $merged[$key] = $defaults[$key];
            }
        }

        if (! array_key_exists('company_profile_file', $existing)) {
            $merged['company_profile_file'] = null;
        }

        SiteSetting::updateOrCreate(['key' => 'contact'], ['value' => $merged]);
        Cache::forget('site_settings.contact');
    }

    public function down(): void
    {
        // Non-destructive sync migration.
    }
};
