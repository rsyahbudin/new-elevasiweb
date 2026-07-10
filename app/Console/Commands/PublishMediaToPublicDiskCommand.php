<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use Illuminate\Support\Facades\File;
use Spatie\MediaLibrary\MediaCollections\Models\Media;

class PublishMediaToPublicDiskCommand extends Command
{
    protected $signature = 'media:publish-to-public';

    protected $description = 'Move Spatie media files from the private local disk to the public disk';

    public function handle(): int
    {
        $moved = 0;

        Media::query()
            ->where('disk', 'local')
            ->orWhere('conversions_disk', 'local')
            ->each(function (Media $media) use (&$moved): void {
                $source = storage_path('app/private/'.$media->id);

                if (! is_dir($source)) {
                    $this->warn("Skipping media {$media->id}: source folder not found.");

                    return;
                }

                $destination = storage_path('app/public/'.$media->id);

                if (is_dir($destination)) {
                    File::deleteDirectory($destination);
                }

                File::copyDirectory($source, $destination);

                $media->update([
                    'disk' => 'public',
                    'conversions_disk' => 'public',
                ]);

                $moved++;
                $this->line("Moved media {$media->id} ({$media->file_name})");
            });

        $this->info("Done. Moved {$moved} media item(s) to public disk.");

        return self::SUCCESS;
    }
}
