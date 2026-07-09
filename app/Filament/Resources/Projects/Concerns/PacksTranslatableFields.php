<?php

namespace App\Filament\Resources\Projects\Concerns;

trait PacksTranslatableFields
{
    /** @var array<int, string> */
    protected static array $translatableFields = ['title', 'scope_of_work', 'description'];

    protected function packTranslatableFields(array $data): array
    {
        foreach (static::$translatableFields as $field) {
            $id = trim((string) ($data["{$field}_id"] ?? ''));
            $en = trim((string) ($data["{$field}_en"] ?? ''));

            // Jangan hapus terjemahan EN yang sudah ada jika field EN dikosongkan saat edit.
            if ($en === '' && isset($this->record)) {
                $existingEn = trim((string) ($this->record->getTranslation($field, 'en', false) ?? ''));
                if ($existingEn !== '') {
                    $en = $existingEn;
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
            $data["{$field}_id"] = $translations['id'] ?? '';
            $data["{$field}_en"] = $translations['en'] ?? '';
            unset($data[$field]);
        }

        return $data;
    }
}
