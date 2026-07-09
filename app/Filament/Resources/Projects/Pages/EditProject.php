<?php

namespace App\Filament\Resources\Projects\Pages;

use App\Filament\Resources\Projects\Concerns\PacksTranslatableFields;
use App\Filament\Resources\Projects\Concerns\ValidatesHomeProjectLimit;
use App\Filament\Resources\Projects\ProjectResource;
use Filament\Actions\DeleteAction;
use Filament\Actions\ForceDeleteAction;
use Filament\Actions\RestoreAction;
use Filament\Resources\Pages\EditRecord;

class EditProject extends EditRecord
{
    use PacksTranslatableFields;
    use ValidatesHomeProjectLimit;

    protected static string $resource = ProjectResource::class;

    protected function getHeaderActions(): array
    {
        return [
            DeleteAction::make(),
            ForceDeleteAction::make(),
            RestoreAction::make(),
        ];
    }

    protected function mutateFormDataBeforeFill(array $data): array
    {
        return $this->unpackTranslatableFields($data);
    }

    protected function mutateFormDataBeforeSave(array $data): array
    {
        $data = $this->ensureHomeProjectLimit($data);

        return $this->packTranslatableFields($data);
    }
}
