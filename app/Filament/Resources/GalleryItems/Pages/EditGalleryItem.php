<?php

namespace App\Filament\Resources\GalleryItems\Pages;

use App\Filament\Resources\GalleryItems\Concerns\PacksTranslatableFields;
use App\Filament\Resources\GalleryItems\GalleryItemResource;
use Filament\Actions\DeleteAction;
use Filament\Resources\Pages\EditRecord;

class EditGalleryItem extends EditRecord
{
    use PacksTranslatableFields;

    protected static string $resource = GalleryItemResource::class;

    protected function getHeaderActions(): array
    {
        return [
            DeleteAction::make(),
        ];
    }

    protected function mutateFormDataBeforeFill(array $data): array
    {
        return $this->unpackTranslatableFields($data);
    }

    protected function mutateFormDataBeforeSave(array $data): array
    {
        return $this->packTranslatableFields($data);
    }
}
