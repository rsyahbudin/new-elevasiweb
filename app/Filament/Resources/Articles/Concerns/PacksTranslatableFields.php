<?php

namespace App\Filament\Resources\Articles\Concerns;

use App\Support\ArticleBodyRenderer;

trait PacksTranslatableFields
{
    /** @var array<int, string> */
    protected static array $translatableFields = ['title', 'excerpt', 'body'];

    protected function packTranslatableFields(array $data): array
    {
        foreach (static::$translatableFields as $field) {
            $id = $this->packFieldValue($data["{$field}_id"] ?? null, $field);
            $en = $this->packFieldValue($data["{$field}_en"] ?? null, $field);

            if ($field === 'body' ? ArticleBodyRenderer::isEmpty($en) : $en === '') {
                if (isset($this->record)) {
                    $existingEn = $this->record->getTranslation($field, 'en', false);

                    if ($field === 'body') {
                        if (! ArticleBodyRenderer::isEmpty($existingEn)) {
                            $en = $existingEn;
                        }
                    } elseif (trim((string) $existingEn) !== '') {
                        $en = trim((string) $existingEn);
                    }
                }
            }

            $data[$field] = [
                'id' => $id,
                'en' => $en,
            ];
            unset($data["{$field}_id"], $data["{$field}_en"]);
        }

        return $data;
    }

    protected function unpackTranslatableFields(array $data): array
    {
        foreach (static::$translatableFields as $field) {
            $translations = $this->record->getTranslations($field);

            if ($field === 'body') {
                $data['body_id'] = ArticleBodyRenderer::forEditor($translations['id'] ?? null);
                $data['body_en'] = ArticleBodyRenderer::forEditor($translations['en'] ?? null);
            } else {
                $data["{$field}_id"] = $translations['id'] ?? '';
                $data["{$field}_en"] = $translations['en'] ?? '';
            }

            unset($data[$field]);
        }

        return $data;
    }

    protected function packFieldValue(mixed $value, string $field): mixed
    {
        if ($field === 'body') {
            if (is_array($value)) {
                return $value;
            }

            $normalized = ArticleBodyRenderer::forEditor($value);

            return ArticleBodyRenderer::isEmpty($normalized) ? '' : $normalized;
        }

        return trim((string) ($value ?? ''));
    }
}
