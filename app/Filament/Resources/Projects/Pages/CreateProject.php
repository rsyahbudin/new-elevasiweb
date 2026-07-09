<?php

namespace App\Filament\Resources\Projects\Pages;

use App\Filament\Resources\Projects\Concerns\PacksTranslatableFields;
use App\Filament\Resources\Projects\Concerns\ValidatesHomeProjectLimit;
use App\Filament\Resources\Projects\ProjectResource;
use App\Models\Project;
use Filament\Resources\Pages\CreateRecord;

class CreateProject extends CreateRecord
{
    use PacksTranslatableFields;
    use ValidatesHomeProjectLimit;

    protected static string $resource = ProjectResource::class;

    protected function mutateFormDataBeforeCreate(array $data): array
    {
        $data = $this->ensureHomeProjectLimit($data);
        $data['sort_order'] = (Project::query()->max('sort_order') ?? -1) + 1;

        return $this->packTranslatableFields($data);
    }
}
