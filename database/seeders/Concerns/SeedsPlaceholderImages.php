<?php

namespace Database\Seeders\Concerns;

use Illuminate\Support\Str;
use RuntimeException;

trait SeedsPlaceholderImages
{
    /**
     * @param  array{0: int, 1: int, 2: int}  $rgb
     */
    protected function createPlaceholderImage(string $label, int $width, int $height, array $rgb): string
    {
        if (! function_exists('imagecreatetruecolor')) {
            throw new RuntimeException('PHP GD extension is required to seed gallery/article images.');
        }

        $image = imagecreatetruecolor($width, $height);
        $base = imagecolorallocate($image, $rgb[0], $rgb[1], $rgb[2]);
        imagefill($image, 0, 0, $base);

        $stripe = imagecolorallocate(
            $image,
            max(0, $rgb[0] - 12),
            max(0, $rgb[1] - 12),
            max(0, $rgb[2] - 12),
        );

        for ($y = -$height; $y < $height * 2; $y += 28) {
            imageline($image, 0, $y, $width, $y + $width, $stripe);
        }

        $caption = imagecolorallocate($image, 243, 243, 240);
        $text = Str::upper(Str::limit($label, 28, ''));
        $font = 5;
        $textWidth = imagefontwidth($font) * strlen($text);
        $x = max(12, (int) (($width - $textWidth) / 2));
        $y = max(12, (int) (($height - imagefontheight($font)) / 2));
        imagestring($image, $font, $x, $y, $text, $caption);

        $path = sys_get_temp_dir().'/elevasi-seed-'.Str::slug($label).'-'.uniqid('', true).'.jpg';
        imagejpeg($image, $path, 88);
        imagedestroy($image);

        return $path;
    }

    protected function attachPlaceholderImage(object $model, string $collection, string $label, int $width, int $height, array $rgb): void
    {
        if ($model->hasMedia($collection)) {
            return;
        }

        $path = $this->createPlaceholderImage($label, $width, $height, $rgb);

        try {
            $model->addMedia($path)->toMediaCollection($collection);
        } finally {
            @unlink($path);
        }
    }
}
