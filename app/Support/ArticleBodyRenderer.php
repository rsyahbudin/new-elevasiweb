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
            return RichContentRenderer::make(self::normalizeDoc($body))->toHtml();
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
            return self::normalizeDoc($body);
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
        $blocks = array_values(array_filter(preg_split('/\n\s*\n/', $body) ?: []));

        if ($blocks === []) {
            return self::doc();
        }

        $content = [];

        foreach ($blocks as $block) {
            array_push($content, ...self::parseTextBlock(trim($block)));
        }

        return self::doc($content);
    }

    /**
     * @return array<int, array<string, mixed>>
     */
    private static function parseTextBlock(string $block): array
    {
        if ($block === '') {
            return [];
        }

        $lines = preg_split('/\r\n|\r|\n/', $block) ?: [];
        $lines = array_values(array_filter(array_map('trim', $lines), fn (string $line) => $line !== ''));

        if ($lines === []) {
            return [];
        }

        if (count($lines) === 1) {
            $ordered = self::extractManualOrderedItems($lines[0]);

            if ($ordered !== null) {
                return [self::orderedList($ordered)];
            }

            return [self::paragraph($lines[0])];
        }

        $ordered = self::extractOrderedLines($lines);

        if ($ordered !== null) {
            return [self::orderedList($ordered)];
        }

        $bullets = self::extractBulletLines($lines);

        if ($bullets !== null) {
            return [self::bulletList($bullets)];
        }

        return [self::paragraph($block)];
    }

    /**
     * @param  array<string, mixed>  $doc
     * @return array<string, mixed>
     */
    private static function normalizeDoc(array $doc): array
    {
        if (($doc['type'] ?? null) !== 'doc') {
            return $doc;
        }

        $content = [];

        foreach ($doc['content'] ?? [] as $node) {
            if (! is_array($node)) {
                continue;
            }

            if (($node['type'] ?? null) === 'paragraph') {
                $text = trim(self::extractPlainTextFromNode($node));
                $ordered = self::extractManualOrderedItems($text);

                if ($ordered !== null) {
                    $content[] = self::orderedList($ordered);

                    continue;
                }

                $lines = array_values(array_filter(array_map('trim', preg_split('/\r\n|\r|\n/', $text) ?: [])));
                $lineOrdered = count($lines) > 1 ? self::extractOrderedLines($lines) : null;

                if ($lineOrdered !== null) {
                    $content[] = self::orderedList($lineOrdered);

                    continue;
                }

                $lineBullets = count($lines) > 1 ? self::extractBulletLines($lines) : null;

                if ($lineBullets !== null) {
                    $content[] = self::bulletList($lineBullets);

                    continue;
                }
            }

            $content[] = $node;
        }

        return self::doc($content);
    }

    /**
     * @param  array<string, mixed>  $node
     */
    private static function extractPlainTextFromNode(array $node): string
    {
        if (($node['type'] ?? null) === 'text') {
            return $node['text'] ?? '';
        }

        $text = '';

        foreach ($node['content'] ?? [] as $child) {
            if (is_array($child)) {
                $text .= self::extractPlainTextFromNode($child);
            }
        }

        return $text;
    }

    /**
     * @return array<int, string>|null
     */
    private static function extractManualOrderedItems(string $text): ?array
    {
        if (! preg_match_all('/\d+\.\s*\)?\s*/', $text, $matches) || count($matches[0]) < 2) {
            return null;
        }

        $parts = preg_split('/(?=\d+\.\s*\)?\s*)/', $text, -1, PREG_SPLIT_NO_EMPTY) ?: [];
        $items = [];

        foreach ($parts as $part) {
            $item = trim((string) preg_replace('/^\d+\.\s*\)?\s*/', '', trim($part)));

            if ($item !== '') {
                $items[] = $item;
            }
        }

        return count($items) >= 2 ? $items : null;
    }

    /**
     * @param  array<int, string>  $lines
     * @return array<int, string>|null
     */
    private static function extractOrderedLines(array $lines): ?array
    {
        if (count($lines) < 2) {
            return null;
        }

        $items = [];

        foreach ($lines as $line) {
            if (! preg_match('/^\d+\.\s*\)?\s*(.+)$/', $line, $matches)) {
                return null;
            }

            $items[] = trim($matches[1]);
        }

        return $items;
    }

    /**
     * @param  array<int, string>  $lines
     * @return array<int, string>|null
     */
    private static function extractBulletLines(array $lines): ?array
    {
        if (count($lines) < 2) {
            return null;
        }

        $items = [];

        foreach ($lines as $line) {
            if (! preg_match('/^[-•*]\s+(.+)$/', $line, $matches)) {
                return null;
            }

            $items[] = trim($matches[1]);
        }

        return $items;
    }

    private static function looksLikeHtml(string $value): bool
    {
        return (bool) preg_match('/<(p|ul|ol|li|h[1-6]|blockquote|strong|em|br|a)\b/i', $value);
    }
}
