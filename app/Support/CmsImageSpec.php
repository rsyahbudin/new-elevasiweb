<?php

namespace App\Support;

class CmsImageSpec
{
    public const MAX_MB = 15;

    public const MAX_KB = 15 * 1024;

    /**
     * @return array{rules: array<int, string>, messages: array<string, string>, helper: string}
     */
    public static function preset(string $key): array
    {
        return match ($key) {
            'project_cover' => self::make(
                minWidth: 2000,
                minHeight: 1125,
                recommended: '2400×1350',
                aspect: '16:9',
                usage: 'Foto utama proyek — kartu beranda, index proyek, & hero detail.',
            ),
            'project_gallery' => self::make(
                minWidth: 1920,
                minHeight: 1080,
                recommended: '2400×1350',
                aspect: '16:9',
                usage: 'Foto galeri proyek — grid halaman detail & lightbox.',
            ),
            'gallery_item' => self::make(
                minWidth: 1920,
                minHeight: 1080,
                recommended: '2400×1350',
                aspect: '16:9',
                usage: 'Foto galeri inspirasi — grid & lightbox halaman publik.',
            ),
            'article_cover' => self::make(
                minWidth: 1920,
                minHeight: 1080,
                recommended: '2400×1350',
                aspect: '16:9',
                usage: 'Cover artikel — daftar & halaman detail.',
                optional: true,
            ),
            'hero_cover' => self::make(
                minWidth: 2400,
                minHeight: 1350,
                recommended: '2880×1620',
                aspect: '16:9',
                usage: 'Hero full-bleed beranda — butuh resolusi lebih tinggi.',
            ),
            'contact_banner' => self::make(
                minWidth: 1920,
                minHeight: 864,
                recommended: '2560×1080',
                aspect: '21:9',
                usage: 'Banner lebar halaman kontak.',
            ),
            'footer_cta' => self::make(
                minWidth: 1920,
                minHeight: 960,
                recommended: '2400×1200',
                aspect: '2:1',
                usage: 'Background footer CTA — pilih foto yang kontras dengan teks putih.',
            ),
            default => throw new \InvalidArgumentException("Unknown CmsImageSpec preset: {$key}"),
        };
    }

    /**
     * @return array{rules: array<int, string>, messages: array<string, string>, helper: string}
     */
    protected static function make(
        int $minWidth,
        int $minHeight,
        string $recommended,
        string $aspect,
        string $usage,
        bool $optional = false,
    ): array {
        $optionalPrefix = $optional ? 'Opsional. ' : '';

        return [
            'rules' => ["dimensions:min_width={$minWidth},min_height={$minHeight}"],
            'messages' => CmsValidation::imageUpload($minWidth, $minHeight, self::MAX_MB),
            'helper' => "{$optionalPrefix}Landscape {$aspect}. {$usage} "
                ."Disarankan {$recommended} px, minimal {$minWidth}×{$minHeight} px, maks. ".self::MAX_MB.' MB. '
                .'Situs otomatis optimasi ke WebP — cukup upload resolusi di atas agar tajam di mobile & desktop.',
        ];
    }
}
