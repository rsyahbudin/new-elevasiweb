<?php

namespace Tests\Unit;

use App\Support\StoredImageSources;
use Illuminate\Support\Facades\Storage;
use Tests\TestCase;

class StoredImageSourcesTest extends TestCase
{
    public function test_it_returns_null_for_empty_path(): void
    {
        $this->assertNull(StoredImageSources::resolve(null));
        $this->assertNull(StoredImageSources::resolve(''));
    }

    public function test_it_returns_external_url_without_srcset(): void
    {
        $result = StoredImageSources::resolve('https://cdn.example.com/hero.jpg', 'large');

        $this->assertSame([
            'src' => 'https://cdn.example.com/hero.jpg',
            'srcSet' => null,
        ], $result);
    }

    public function test_it_builds_srcset_from_generated_conversions(): void
    {
        Storage::fake('public');

        $sourcePath = 'site-settings/hero/sample.jpg';
        Storage::disk('public')->put($sourcePath, 'original');

        $manifest = [
            'source' => $sourcePath,
            'source_mtime' => Storage::disk('public')->lastModified($sourcePath),
            'conversions' => [
                'thumbnail' => ['path' => 'site-settings/hero/conversions/sample-thumbnail.webp', 'width' => 480],
                'medium' => ['path' => 'site-settings/hero/conversions/sample-medium.webp', 'width' => 1024],
                'large' => ['path' => 'site-settings/hero/conversions/sample-large.webp', 'width' => 1920],
            ],
        ];

        Storage::disk('public')->put('site-settings/hero/conversions/sample.json', json_encode($manifest));
        Storage::disk('public')->put('site-settings/hero/conversions/sample-thumbnail.webp', 'thumb');
        Storage::disk('public')->put('site-settings/hero/conversions/sample-medium.webp', 'medium');
        Storage::disk('public')->put('site-settings/hero/conversions/sample-large.webp', 'large');

        $result = StoredImageSources::resolve($sourcePath, 'large');

        $this->assertNotNull($result);
        $this->assertStringContainsString('sample-large.webp', $result['src']);
        $this->assertStringContainsString('480w', $result['srcSet']);
        $this->assertStringContainsString('1024w', $result['srcSet']);
        $this->assertStringContainsString('1920w', $result['srcSet']);
    }
}
