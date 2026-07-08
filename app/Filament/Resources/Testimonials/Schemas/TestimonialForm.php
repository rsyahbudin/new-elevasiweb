<?php

namespace App\Filament\Resources\Testimonials\Schemas;

use Filament\Forms\Components\Select;
use Filament\Forms\Components\Textarea;
use Filament\Forms\Components\TextInput;
use Filament\Forms\Components\Toggle;
use Filament\Schemas\Schema;

class TestimonialForm
{
    public static function configure(Schema $schema): Schema
    {
        return $schema
            ->components([
                TextInput::make('client_name')
                    ->required(),
                Select::make('project_id')
                    ->relationship('project', 'id')
                    ->getOptionLabelFromRecordUsing(fn ($record) => $record->title)
                    ->searchable(),
                Textarea::make('quote_id')
                    ->label('Quote (ID)')
                    ->required()
                    ->rows(3),
                Textarea::make('quote_en')
                    ->label('Quote (EN)')
                    ->rows(3),
                Toggle::make('is_visible')
                    ->default(true)
                    ->required(),
            ]);
    }
}
