<?php

namespace App\Support;

use App\Actions\Images\OptimizeStoredImage;
use Illuminate\Support\Facades\Storage;

class StoredImageSources
{
    /**
     * Resolve a stored CMS image path into responsive WebP sources.
     *
     * @return array{src: string, srcSet: string|null}|null
     */
    public static function resolve(?string $path, string $size = 'medium', string $disk = 'public'): ?array
    {
        if (! is_string($path) || $path === '') {
            return null;
        }

        if (str_starts_with($path, 'http://') || str_starts_with($path, 'https://')) {
            return ['src' => $path, 'srcSet' => null];
        }

        $manifest = app(OptimizeStoredImage::class)->ensure($path, $disk);
        $storage = Storage::disk($disk);

        if ($manifest === null) {
            $fallback = $storage->url($path);

            return $fallback ? ['src' => $fallback, 'srcSet' => null] : null;
        }

        $urls = [];

        foreach ($manifest['conversions'] as $name => $conversion) {
            $urls[$name] = [
                'url' => $storage->url($conversion['path']),
                'width' => $conversion['width'],
            ];
        }

        if ($urls === []) {
            $fallback = $storage->url($path);

            return $fallback ? ['src' => $fallback, 'srcSet' => null] : null;
        }

        $src = $urls[$size]['url']
          ?? $urls['medium']['url']
          ?? $urls['thumbnail']['url']
          ?? $storage->url($path);

        $srcSet = collect($urls)
            ->map(fn (array $item) => "{$item['url']} {$item['width']}w")
            ->implode(', ');

        return [
            'src' => $src,
            'srcSet' => $srcSet !== '' ? $srcSet : null,
        ];
    }
}
