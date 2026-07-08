<?php

namespace App\Filament\Resources\Testimonials\Pages;

use App\Filament\Resources\Testimonials\TestimonialResource;
use Filament\Actions\DeleteAction;
use Filament\Resources\Pages\EditRecord;

class EditTestimonial extends EditRecord
{
    protected static string $resource = TestimonialResource::class;

    protected function getHeaderActions(): array
    {
        return [
            DeleteAction::make(),
        ];
    }

    protected function mutateFormDataBeforeFill(array $data): array
    {
        $translations = $this->record->getTranslations('quote');
        $data['quote_id'] = $translations['id'] ?? '';
        $data['quote_en'] = $translations['en'] ?? '';
        unset($data['quote']);

        return $data;
    }

    protected function mutateFormDataBeforeSave(array $data): array
    {
        $data['quote'] = ['id' => $data['quote_id'] ?? '', 'en' => $data['quote_en'] ?? ''];
        unset($data['quote_id'], $data['quote_en']);

        return $data;
    }
}
