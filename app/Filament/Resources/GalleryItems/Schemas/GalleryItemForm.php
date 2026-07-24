<?php

namespace App\Filament\Resources\GalleryItems\Schemas;

use App\Enums\ProjectStatus;
use App\Support\CmsImageSpec;
use App\Support\CmsValidation;
use Filament\Forms\Components\Select;
use Filament\Forms\Components\SpatieMediaLibraryFileUpload;
use Filament\Forms\Components\TextInput;
use Filament\Schemas\Components\Section;
use Filament\Schemas\Components\Tabs;
use Filament\Schemas\Components\Tabs\Tab;
use Filament\Schemas\Schema;
use Filament\Support\Icons\Heroicon;

class GalleryItemForm
{
    public static function configure(Schema $schema): Schema
    {
        $imageSpec = CmsImageSpec::preset('gallery_item');

        return $schema
            ->components([
                Section::make('Foto')
                    ->description('Upload foto landscape (horizontal) untuk galeri inspirasi.')
                    ->schema([
                        SpatieMediaLibraryFileUpload::make('image')
                            ->label('Foto')
                            ->collection('image')
                            ->image()
                            ->imageEditor()
                            ->panelAspectRatio('16:9')
                            ->rules($imageSpec['rules'])
                            ->maxSize(CmsImageSpec::MAX_KB)
                            ->validationMessages(array_merge(
                                CmsValidation::required('Foto'),
                                $imageSpec['messages'],
                            ))
                            ->helperText($imageSpec['helper'])
                            ->required(),
                    ]),

                Section::make('Detail')
                    ->columns(2)
                    ->schema([
                        Select::make('status')
                            ->label('Status')
                            ->options(ProjectStatus::class)
                            ->default(ProjectStatus::Draft)
                            ->required()
                            ->validationMessages(CmsValidation::required('Status'))
                            ->helperText('Published = tampil di situs & navbar (jika ada item lain).'),
                    ]),

                Tabs::make('Caption')
                    ->tabs([
                        Tab::make('Bahasa Indonesia')
                            ->icon(Heroicon::OutlinedLanguage)
                            ->schema([
                                TextInput::make('title_id')
                                    ->label('Caption (ID)')
                                    ->maxLength(255)
                                    ->helperText('Opsional. Ditampilkan di bawah foto.'),
                            ]),
                        Tab::make('English')
                            ->icon(Heroicon::OutlinedGlobeAlt)
                            ->schema([
                                TextInput::make('title_en')
                                    ->label('Caption (EN)')
                                    ->maxLength(255)
                                    ->helperText('Optional. Leave blank to use Indonesian caption on /en.'),
                            ]),
                    ])
                    ->persistTabInQueryString('gallery_lang')
                    ->columnSpanFull(),
            ]);
    }
}
