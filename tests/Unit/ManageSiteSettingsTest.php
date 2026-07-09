<?php

namespace Tests\Unit;

use App\Filament\Pages\ManageSiteSettings;
use Tests\TestCase;

class ManageSiteSettingsTest extends TestCase
{
    public function test_it_normalizes_single_image_upload_paths(): void
    {
        $this->assertSame(
            'site-settings/hero/cover.jpg',
            ManageSiteSettings::normalizeImagePath('site-settings/hero/cover.jpg'),
        );
    }

    public function test_it_normalizes_array_image_upload_paths(): void
    {
        $this->assertSame(
            'site-settings/hero/cover.jpg',
            ManageSiteSettings::normalizeImagePath(['site-settings/hero/cover.jpg']),
        );
    }

    public function test_it_returns_null_for_empty_image_values(): void
    {
        $this->assertNull(ManageSiteSettings::normalizeImagePath(null));
        $this->assertNull(ManageSiteSettings::normalizeImagePath(''));
        $this->assertNull(ManageSiteSettings::normalizeImagePath([]));
    }
}
