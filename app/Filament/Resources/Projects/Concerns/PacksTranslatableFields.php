<?php

namespace App\Filament\Resources\Projects\Concerns;

trait PacksTranslatableFields
{
    /** @var array<int, string> */
    protected static array $translatableFields = ['title', 'scope_of_work', 'description'];

    protected function packTranslatableFields(array $data): array
    {
        foreach (static::$translatableFields as $field) {
            $data[$field] = [
                'id' => $data["{$field}_id"] ?? '',
                'en' => $data["{$field}_en"] ?? '',
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
