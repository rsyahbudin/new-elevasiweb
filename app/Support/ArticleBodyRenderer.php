<?php

namespace App\Support;

use Filament\Forms\Components\RichEditor\RichContentRenderer;

class ArticleBodyRenderer
{
    public static function toHtml(mixed $body): string
    {
        if (blank($body)) {
            return '';
        }

        if (is_array($body) && ($body['type'] ?? null) === 'doc') {
            return RichContentRenderer::make($body)->toHtml();
        }

        if (! is_string($body)) {
            return '';
        }

        $trimmed = trim($body);

        if ($trimmed === '') {
            return '';
        }

        if (str_starts_with($trimmed, '{')) {
            $decoded = json_decode($trimmed, true);

            if (is_array($decoded) && ($decoded['type'] ?? null) === 'doc') {
                return RichContentRenderer::make($decoded)->toHtml();
            }
        }

        return collect(array_values(array_filter(preg_split('/\n\s*\n/', $body) ?: [])))
            ->map(fn (string $paragraph) => '<p>'.e(trim($paragraph)).'</p>')
            ->implode('');
    }

    /**
     * Normalize stored body for the Filament RichEditor (TipTap).
     */
    public static function forEditor(mixed $body): array|string
    {
        if (blank($body)) {
            return [
                'type' => 'doc',
                'content' => [],
            ];
        }

        if (is_array($body) && ($body['type'] ?? null) === 'doc') {
            return $body;
        }

        if (! is_string($body)) {
            return [
                'type' => 'doc',
                'content' => [],
            ];
        }

        $trimmed = trim($body);

        if ($trimmed === '') {
            return [
                'type' => 'doc',
                'content' => [],
            ];
        }

        if (str_starts_with($trimmed, '{')) {
            $decoded = json_decode($trimmed, true);

            if (is_array($decoded) && ($decoded['type'] ?? null) === 'doc') {
                return $decoded;
            }
        }

        $paragraphs = array_values(array_filter(preg_split('/\n\s*\n/', $body) ?: []));

        if ($paragraphs === []) {
            return [
                'type' => 'doc',
                'content' => [],
            ];
        }

        return collect($paragraphs)
            ->map(fn (string $paragraph) => '<p>'.e(trim($paragraph)).'</p>')
            ->implode('');
    }

    public static function isEmpty(mixed $body): bool
    {
        if (blank($body)) {
            return true;
        }

        if (is_array($body) && ($body['type'] ?? null) === 'doc') {
            $content = $body['content'] ?? [];

            if ($content === []) {
                return true;
            }

            if (count($content) === 1 && ($content[0]['type'] ?? null) === 'paragraph') {
                $inner = $content[0]['content'] ?? [];

                return $inner === [];
            }

            return false;
        }

        return trim((string) $body) === '';
    }
}
