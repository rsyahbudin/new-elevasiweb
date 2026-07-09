<?php

namespace App\Filament\Resources\Categories\Schemas;

use Filament\Forms\Components\TextInput;
use Filament\Schemas\Components\Section;
use Filament\Schemas\Components\Tabs;
use Filament\Schemas\Components\Tabs\Tab;
use Filament\Schemas\Schema;
use Filament\Support\Icons\Heroicon;
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
                        TextInput::make('slug')
                            ->label('Slug')
                            ->required()
                            ->unique(ignoreRecord: true)
                            ->helperText('Untuk URL filter, contoh: /proyek?category=residential. Dibuat otomatis dari nama Indonesia saat kategori baru.')
                            ->columnSpanFull(),
                        Tabs::make('Nama kategori')
                            ->tabs([
                                Tab::make('Bahasa Indonesia')
                                    ->icon(Heroicon::OutlinedLanguage)
                                    ->schema([
                                        TextInput::make('name_id')
                                            ->label('Nama (ID)')
                                            ->required()
                                            ->live(onBlur: true)
                                            ->afterStateUpdated(function ($state, callable $set, string $operation) {
                                                if ($operation === 'create') {
                                                    $set('slug', Str::slug($state));
                                                }
                                            })
                                            ->helperText('Slug URL mengikuti nama Indonesia.'),
                                    ]),
                                Tab::make('English')
                                    ->icon(Heroicon::OutlinedGlobeAlt)
                                    ->schema([
                                        TextInput::make('name_en')
                                            ->label('Name (EN)')
                                            ->helperText('Optional. Leave blank to use the Indonesian name on /en.'),
                                    ]),
                            ])
                            ->persistTabInQueryString('category_lang')
                            ->columnSpanFull(),
                    ]),
            ]);
    }
}
