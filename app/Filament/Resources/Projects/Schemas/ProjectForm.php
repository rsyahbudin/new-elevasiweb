<?php

namespace App\Filament\Resources\Projects\Schemas;

use App\Enums\ProjectStatus;
use Filament\Forms\Components\DateTimePicker;
use Filament\Forms\Components\Select;
use Filament\Forms\Components\SpatieMediaLibraryFileUpload;
use Filament\Forms\Components\Textarea;
use Filament\Forms\Components\TextInput;
use Filament\Schemas\Components\Section;
use Filament\Schemas\Components\Tabs;
use Filament\Schemas\Components\Tabs\Tab;
use Filament\Schemas\Schema;
use Filament\Support\Icons\Heroicon;
use Illuminate\Support\Str;

class ProjectForm
{
    public static function configure(Schema $schema): Schema
    {
        return $schema
            ->components([
                Tabs::make('Translations')
                    ->tabs([
                        Tab::make('Bahasa Indonesia')
                            ->schema([
                                TextInput::make('title_id')
                                    ->label('Nama proyek')
                                    ->required()
                                    ->live(onBlur: true)
                                    ->afterStateUpdated(function ($state, callable $set, string $operation) {
                                        if ($operation === 'create') {
                                            $set('slug', Str::slug($state));
                                        }
                                    }),
                                TextInput::make('scope_of_work_id')
                                    ->label('Lingkup pekerjaan')
                                    ->required()
                                    ->helperText('Contoh: Design + Build'),
                                Textarea::make('description_id')
                                    ->label('Deskripsi')
                                    ->rows(6)
                                    ->required()
                                    ->helperText('Pisahkan paragraf dengan baris kosong.'),
                            ]),
                        Tab::make('English')
                            ->schema([
                                TextInput::make('title_en')->label('Project name'),
                                TextInput::make('scope_of_work_en')->label('Scope of work'),
                                Textarea::make('description_en')
                                    ->label('Description')
                                    ->rows(6)
                                    ->helperText('Leave blank to fall back to the Indonesian text on the public site.'),
                            ]),
                    ])
                    ->columnSpanFull(),

                Section::make('Details')
                    ->columns(2)
                    ->schema([
                        TextInput::make('slug')
                            ->required()
                            ->unique(ignoreRecord: true)
                            ->helperText('Used in the public URL — not translated.'),
                        Select::make('category_id')
                            ->relationship('category', 'id')
                            ->getOptionLabelFromRecordUsing(fn ($record) => $record->name)
                            ->searchable()
                            ->required(),
                        TextInput::make('location_city')
                            ->label('City')
                            ->required(),
                        TextInput::make('area_size')
                            ->label('Area (optional)')
                            ->placeholder('e.g. 240 m2')
                            ->helperText('Optional. Recommended format: number + unit, e.g. "240 m2".'),
                        TextInput::make('year_completed')
                            ->numeric()
                            ->required(),
                        Select::make('status')
                            ->options(ProjectStatus::class)
                            ->default(ProjectStatus::Draft)
                            ->required(),
                        DateTimePicker::make('published_at'),
                        TextInput::make('sort_order')
                            ->numeric()
                            ->default(0)
                            ->required(),
                    ]),

                Section::make('Photos')
                    ->icon(Heroicon::OutlinedPhoto)
                    ->schema([
                        TextInput::make('cover_caption')
                            ->label('Placeholder caption')
                            ->helperText('Shown until a real cover photo is uploaded, e.g. "exterior, dusk".'),
                        SpatieMediaLibraryFileUpload::make('cover')
                            ->collection('cover')
                            ->image()
                            ->rules(['dimensions:min_width=2000,min_height=1200'])
                            ->maxSize(8 * 1024)
                            ->helperText('Recommended: 2400x1350 px (16:9), min 2000x1200 px, max 8 MB.')
                            ->required(),
                        SpatieMediaLibraryFileUpload::make('gallery')
                            ->collection('gallery')
                            ->image()
                            ->multiple()
                            ->reorderable()
                            ->rules(['dimensions:min_width=1400,min_height=1000'])
                            ->maxSize(15 * 1024)
                            ->helperText('Minimum 1 photo. Recommended: 1600x1200 px (4:3), min 1400x1000 px, max 15 MB per file.'),
                    ]),
            ]);
    }
}
