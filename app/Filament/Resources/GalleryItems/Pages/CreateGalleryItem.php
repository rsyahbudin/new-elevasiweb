<?php

namespace App\Filament\Resources\GalleryItems\Pages;

use App\Filament\Resources\GalleryItems\Concerns\PacksTranslatableFields;
use App\Filament\Resources\GalleryItems\GalleryItemResource;
use App\Models\GalleryItem;
use Filament\Resources\Pages\CreateRecord;

class CreateGalleryItem extends CreateRecord
{
    use PacksTranslatableFields;

    protected static string $resource = GalleryItemResource::class;

    protected function mutateFormDataBeforeCreate(array $data): array
    {
        $data['sort_order'] = (GalleryItem::query()->max('sort_order') ?? -1) + 1;

        return $this->packTranslatableFields($data);
    }
}
