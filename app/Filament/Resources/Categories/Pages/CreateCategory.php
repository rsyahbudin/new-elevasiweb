<?php

namespace App\Filament\Resources\Categories\Pages;

use App\Filament\Resources\Categories\CategoryResource;
use Filament\Resources\Pages\CreateRecord;

class CreateCategory extends CreateRecord
{
    protected static string $resource = CategoryResource::class;

    protected function mutateFormDataBeforeCreate(array $data): array
    {
        $data['name'] = ['id' => $data['name_id'] ?? '', 'en' => $data['name_en'] ?? ''];
        unset($data['name_id'], $data['name_en']);

        return $data;
    }
}
