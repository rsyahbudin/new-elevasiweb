<?php

namespace App\Actions\Images;

use Illuminate\Support\Facades\Storage;
use Spatie\Image\Enums\Fit;
use Spatie\Image\Image;
use Throwable;

class OptimizeStoredImage
{
    /**
     * @var array<string, array{width: int, height: int, fit_width: int}>
     */
    public const SIZES = [
        'thumbnail' => ['width' => 480, 'height' => 360, 'fit_width' => 480],
        'medium' => ['width' => 1024, 'height' => 768, 'fit_width' => 1024],
        'large' => ['width' => 1920, 'height' => 1440, 'fit_width' => 1920],
    ];

    /**
     * @return array{source: string, source_mtime: int, conversions: array<string, array{path: string, width: int}>}|null
     */
    public function ensure(?string $path, string $disk = 'public'): ?array
    {
        if (! is_string($path) || $path === '' || str_starts_with($path, 'http')) {
            return null;
        }

        $storage = Storage::disk($disk);

        if (! $storage->exists($path)) {
            return null;
        }

        $manifestPath = $this->manifestPath($path);
        $mtime = $storage->lastModified($path);

        if ($storage->exists($manifestPath)) {
            $manifest = json_decode($storage->get($manifestPath), true);

            if (
                is_array($manifest)
                && ($manifest['source'] ?? null) === $path
                && ($manifest['source_mtime'] ?? 0) === $mtime
                && $this->manifestHasConversions($manifest, $storage)
            ) {
                return $manifest;
            }
        }

        return $this->generate($path, $disk, $mtime);
    }

    public function purge(?string $path, string $disk = 'public'): void
    {
        if (! is_string($path) || $path === '' || str_starts_with($path, 'http')) {
            return;
        }

        $storage = Storage::disk($disk);
        $manifestPath = $this->manifestPath($path);

        if ($storage->exists($manifestPath)) {
            $manifest = json_decode($storage->get($manifestPath), true);

            if (is_array($manifest)) {
                foreach ($manifest['conversions'] ?? [] as $conversion) {
                    $conversionPath = $conversion['path'] ?? null;

                    if (is_string($conversionPath) && $conversionPath !== '') {
                        $storage->delete($conversionPath);
                    }
                }
            }

            $storage->delete($manifestPath);
        }

        $basename = pathinfo($path, PATHINFO_FILENAME);
        $conversionDir = dirname($path).'/conversions';

        foreach (array_keys(self::SIZES) as $name) {
            $storage->delete("{$conversionDir}/{$basename}-{$name}.webp");
        }
    }

    /**
     * @return array{source: string, source_mtime: int, conversions: array<string, array{path: string, width: int}>}|null
     */
    protected function generate(string $path, string $disk, int $mtime): ?array
    {
        $storage = Storage::disk($disk);
        $absolutePath = $storage->path($path);
        $conversionDir = dirname($path).'/conversions';

        $storage->makeDirectory($conversionDir);

        $basename = pathinfo($path, PATHINFO_FILENAME);
        $conversions = [];

        foreach (self::SIZES as $name => $config) {
            $destPath = "{$conversionDir}/{$basename}-{$name}.webp";

            try {
                Image::load($absolutePath)
                    ->fit(Fit::Max, $config['width'], $config['height'])
                    ->format('webp')
                    ->quality(82)
                    ->save($storage->path($destPath));
            } catch (Throwable) {
                continue;
            }

            if ($storage->exists($destPath)) {
                $conversions[$name] = [
                    'path' => $destPath,
                    'width' => $config['fit_width'],
                ];
            }
        }

        if ($conversions === []) {
            return null;
        }

        $manifest = [
            'source' => $path,
            'source_mtime' => $mtime,
            'conversions' => $conversions,
        ];

        $storage->put($this->manifestPath($path), json_encode($manifest, JSON_THROW_ON_ERROR));

        return $manifest;
    }

    protected function manifestPath(string $path): string
    {
        $basename = pathinfo($path, PATHINFO_FILENAME);

        return dirname($path).'/conversions/'.$basename.'.json';
    }

    /**
     * @param  array<string, mixed>  $manifest
     */
    protected function manifestHasConversions(array $manifest, $storage): bool
    {
        $conversions = $manifest['conversions'] ?? [];

        if (! is_array($conversions) || $conversions === []) {
            return false;
        }

        foreach ($conversions as $conversion) {
            $conversionPath = $conversion['path'] ?? null;

            if (! is_string($conversionPath) || $conversionPath === '' || ! $storage->exists($conversionPath)) {
                return false;
            }
        }

        return true;
    }
}
