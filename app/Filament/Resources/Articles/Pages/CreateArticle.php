<?php

namespace App\Filament\Resources\Articles\Pages;

use App\Filament\Resources\Articles\ArticleResource;
use App\Filament\Resources\Articles\Concerns\PacksTranslatableFields;
use Filament\Resources\Pages\CreateRecord;

class CreateArticle extends CreateRecord
{
    use PacksTranslatableFields;

    protected static string $resource = ArticleResource::class;

    protected function mutateFormDataBeforeCreate(array $data): array
    {
        $data['sort_order'] = 0;

        return $this->packTranslatableFields($data);
    }
}
