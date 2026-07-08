<?php

namespace App\Filament\Resources\Categories\Pages;

use App\Filament\Resources\Categories\CategoryResource;
use Filament\Actions\DeleteAction;
use Filament\Resources\Pages\EditRecord;

class EditCategory extends EditRecord
{
    protected static string $resource = CategoryResource::class;

    protected function getHeaderActions(): array
    {
        return [
            DeleteAction::make(),
        ];
    }

    protected function mutateFormDataBeforeFill(array $data): array
    {
        $translations = $this->record->getTranslations('name');
        $data['name_id'] = $translations['id'] ?? '';
        $data['name_en'] = $translations['en'] ?? '';
        unset($data['name']);

        return $data;
    }

    protected function mutateFormDataBeforeSave(array $data): array
    {
        $data['name'] = ['id' => $data['name_id'] ?? '', 'en' => $data['name_en'] ?? ''];
        unset($data['name_id'], $data['name_en']);

        return $data;
    }
}
