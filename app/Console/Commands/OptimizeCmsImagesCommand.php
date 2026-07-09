<?php

namespace App\Console\Commands;

use App\Actions\Images\OptimizeStoredImage;
use App\Filament\Pages\ManageSiteSettings;
use App\Models\SiteSetting;
use Illuminate\Console\Command;

class OptimizeCmsImagesCommand extends Command
{
    protected $signature = 'images:optimize-cms';

    protected $description = 'Generate responsive WebP variants for CMS images (hero, kontak, footer).';

    public function handle(OptimizeStoredImage $optimizer): int
    {
        $paths = [
            SiteSetting::get('hero', ManageSiteSettings::heroDefaults())['cover_image'] ?? null,
            SiteSetting::get('contact', ManageSiteSettings::contactDefaults())['page_image'] ?? null,
            SiteSetting::get('footer', ManageSiteSettings::footerDefaults())['cta_image'] ?? null,
        ];

        $optimized = 0;

        foreach (array_filter($paths) as $path) {
            $this->line("Optimizing {$path}…");

            if ($optimizer->ensure($path) !== null) {
                $optimized++;
            }
        }

        $this->info("Optimized {$optimized} CMS image(s).");

        return self::SUCCESS;
    }
}
