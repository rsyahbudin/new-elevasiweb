<?php

namespace App\Filament\Resources\Testimonials\Pages;

use App\Filament\Resources\Testimonials\TestimonialResource;
use Filament\Resources\Pages\CreateRecord;

class CreateTestimonial extends CreateRecord
{
    protected static string $resource = TestimonialResource::class;

    protected function mutateFormDataBeforeCreate(array $data): array
    {
        $data['quote'] = ['id' => $data['quote_id'] ?? '', 'en' => $data['quote_en'] ?? ''];
        unset($data['quote_id'], $data['quote_en']);

        return $data;
    }
}
