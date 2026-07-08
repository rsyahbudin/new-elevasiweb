<?php

namespace Database\Seeders;

use App\Filament\Pages\ManageSiteSettings;
use App\Models\SiteSetting;
use Illuminate\Database\Seeder;

class SiteSettingSeeder extends Seeder
{
    public function run(): void
    {
        $defaults = [
            'hero' => ManageSiteSettings::heroDefaults(),
            'services' => ManageSiteSettings::servicesDefaults(),
            'tentang' => ManageSiteSettings::tentangDefaults(),
            'contact' => ManageSiteSettings::contactDefaults(),
            'brand' => ['accent' => '#1F7A46'],
        ];

        foreach ($defaults as $key => $value) {
            SiteSetting::firstOrCreate(['key' => $key], ['value' => $value]);
        }
    }
}
