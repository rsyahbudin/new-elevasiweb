<?php

namespace App\Filament\Resources\Categories\Schemas;

use Filament\Forms\Components\TextInput;
use Filament\Schemas\Components\Section;
use Filament\Schemas\Schema;
use Illuminate\Support\Str;

class CategoryForm
{
    public static function configure(Schema $schema): Schema
    {
        return $schema
            ->components([
                Section::make('Kategori proyek')
                    ->description('Digunakan untuk filter di halaman Karya.')
                    ->schema([
                        TextInput::make('name_id')
                            ->label('Nama (ID)')
                            ->required()
                            ->live(onBlur: true)
                            ->afterStateUpdated(function ($state, callable $set, string $operation) {
                                if ($operation === 'create') {
                                    $set('slug', Str::slug($state));
                                }
                            }),
                        TextInput::make('name_en')
                            ->label('Nama (EN)')
                            ->helperText('Opsional. Kosongkan untuk memakai nama Indonesia.'),
                        TextInput::make('slug')
                            ->label('Slug')
                            ->required()
                            ->unique(ignoreRecord: true)
                            ->helperText('Untuk URL filter, contoh: /proyek?category=residential'),
                    ]),
            ]);
    }
}
