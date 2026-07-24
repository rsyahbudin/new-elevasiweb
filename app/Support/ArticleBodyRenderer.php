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

        if (self::looksLikeHtml($trimmed)) {
            return RichContentRenderer::make($trimmed)->toHtml();
        }

        return RichContentRenderer::make(self::plainTextToDoc($trimmed))->toHtml();
    }

    /**
     * Normalize stored body for the Filament RichEditor (TipTap).
     *
     * @return array<string, mixed>
     */
    public static function forEditor(mixed $body): array
    {
        if (blank($body)) {
            return self::doc();
        }

        if (is_array($body) && ($body['type'] ?? null) === 'doc') {
            return $body;
        }

        if (! is_string($body)) {
            return self::doc();
        }

        $trimmed = trim($body);

        if ($trimmed === '') {
            return self::doc();
        }

        if (str_starts_with($trimmed, '{')) {
            $decoded = json_decode($trimmed, true);

            if (is_array($decoded) && ($decoded['type'] ?? null) === 'doc') {
                return $decoded;
            }
        }

        if (self::looksLikeHtml($trimmed)) {
            return RichContentRenderer::make($trimmed)->toArray();
        }

        return self::plainTextToDoc($trimmed);
    }

    /**
     * @param  array<int, array<string, mixed>>  $content
     * @return array<string, mixed>
     */
    public static function doc(array $content = []): array
    {
        return [
            'type' => 'doc',
            'content' => $content,
        ];
    }

    /**
     * @param  array<int, array<string, mixed>>|string  ...$parts
     * @return array<string, mixed>
     */
    public static function paragraph(string|array ...$parts): array
    {
        $content = [];

        foreach ($parts as $part) {
            if (is_string($part)) {
                $content[] = self::text($part);

                continue;
            }

            $content[] = $part;
        }

        return [
            'type' => 'paragraph',
            'content' => $content,
        ];
    }

    /**
     * @param  array<int, array<string, mixed>>  $marks
     * @return array<string, mixed>
     */
    public static function text(string $text, array $marks = []): array
    {
        $node = [
            'type' => 'text',
            'text' => $text,
        ];

        if ($marks !== []) {
            $node['marks'] = $marks;
        }

        return $node;
    }

    public static function bold(string $text): array
    {
        return self::text($text, [['type' => 'bold']]);
    }

    public static function italic(string $text): array
    {
        return self::text($text, [['type' => 'italic']]);
    }

    public static function heading(int $level, string $text): array
    {
        return [
            'type' => 'heading',
            'attrs' => ['level' => $level],
            'content' => [self::text($text)],
        ];
    }

    /**
     * @param  array<int, string>  $items
     * @return array<string, mixed>
     */
    public static function bulletList(array $items): array
    {
        return [
            'type' => 'bulletList',
            'content' => collect($items)
                ->map(fn (string $item) => [
                    'type' => 'listItem',
                    'content' => [self::paragraph($item)],
                ])
                ->all(),
        ];
    }

    /**
     * @param  array<int, string>  $items
     * @return array<string, mixed>
     */
    public static function orderedList(array $items): array
    {
        return [
            'type' => 'orderedList',
            'content' => collect($items)
                ->map(fn (string $item) => [
                    'type' => 'listItem',
                    'content' => [self::paragraph($item)],
                ])
                ->all(),
        ];
    }

    public static function blockquote(string $text): array
    {
        return [
            'type' => 'blockquote',
            'content' => [self::paragraph($text)],
        ];
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

        if (is_string($body) && self::looksLikeHtml($body)) {
            return trim(strip_tags($body)) === '';
        }

        return trim((string) $body) === '';
    }

    /**
     * @return array<string, mixed>
     */
    private static function plainTextToDoc(string $body): array
    {
        $paragraphs = array_values(array_filter(preg_split('/\n\s*\n/', $body) ?: []));

        if ($paragraphs === []) {
            return self::doc();
        }

        return self::doc(
            collect($paragraphs)
                ->map(fn (string $paragraph) => self::paragraph(trim($paragraph)))
                ->all(),
        );
    }

    private static function looksLikeHtml(string $value): bool
    {
        return (bool) preg_match('/<(p|ul|ol|li|h[1-6]|blockquote|strong|em|br|a)\b/i', $value);
    }
}
