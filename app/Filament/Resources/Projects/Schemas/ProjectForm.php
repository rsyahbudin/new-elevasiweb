<?php

namespace App\Filament\Resources\Projects\Schemas;

use App\Enums\ProjectStatus;
use App\Support\CmsValidation;
use Filament\Forms\Components\Select;
use Filament\Forms\Components\SpatieMediaLibraryFileUpload;
use Filament\Forms\Components\Textarea;
use Filament\Forms\Components\TextInput;
use Filament\Forms\Components\Toggle;
use Filament\Schemas\Components\Grid;
use Filament\Schemas\Components\Group;
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
            ->columns(1)
            ->components([
                Grid::make([
                    'default' => 1,
                    'xl' => 12,
                ])
                    ->columnSpanFull()
                    ->schema([
                        Group::make()
                            ->columnSpan([
                                'default' => 'full',
                                'xl' => 7,
                            ])
                            ->schema([
                                Tabs::make('Teks proyek')
                                    ->tabs([
                                        Tab::make('Bahasa Indonesia')
                                            ->icon(Heroicon::OutlinedLanguage)
                                            ->columns(1)
                                            ->schema([
                                                TextInput::make('title_id')
                                                    ->label('Nama proyek')
                                                    ->required()
                                                    ->validationMessages(CmsValidation::required('Nama proyek'))
                                                    ->maxLength(255)
                                                    ->live(onBlur: true)
                                                    ->afterStateUpdated(function ($state, callable $set, string $operation) {
                                                        if ($operation === 'create') {
                                                            $set('slug', Str::slug($state));
                                                        }
                                                    })
                                                    ->helperText('Slug URL dibuat dari nama Indonesia saat proyek baru dibuat.'),
                                                TextInput::make('scope_of_work_id')
                                                    ->label('Lingkup pekerjaan')
                                                    ->required()
                                                    ->validationMessages(CmsValidation::required('Lingkup pekerjaan'))
                                                    ->maxLength(255)
                                                    ->helperText('Contoh: Design + Build, Interior Fit-Out'),
                                                Textarea::make('description_id')
                                                    ->label('Deskripsi')
                                                    ->rows(8)
                                                    ->required()
                                                    ->validationMessages(CmsValidation::required('Deskripsi'))
                                                    ->helperText('Pisahkan paragraf dengan baris kosong.'),
                                            ]),
                                        Tab::make('English')
                                            ->icon(Heroicon::OutlinedGlobeAlt)
                                            ->columns(1)
                                            ->schema([
                                                TextInput::make('title_en')
                                                    ->label('Project name')
                                                    ->maxLength(255)
                                                    ->helperText('Opsional. Tidak mengubah slug URL.'),
                                                TextInput::make('scope_of_work_en')
                                                    ->label('Scope of work')
                                                    ->maxLength(255),
                                                Textarea::make('description_en')
                                                    ->label('Description')
                                                    ->rows(8)
                                                    ->helperText('Opsional. Kosongkan untuk memakai teks Indonesia di situs English.'),
                                            ]),
                                    ])
                                    ->persistTabInQueryString('project_lang')
                                    ->columnSpanFull(),
                            ]),

                        Group::make()
                            ->columnSpan([
                                'default' => 'full',
                                'xl' => 5,
                            ])
                            ->schema([
                                Section::make('Detail & publikasi')
                                    ->icon(Heroicon::OutlinedClipboardDocumentList)
                                    ->description('Data teknis dan status tayang. Urutan di situs diatur lewat drag-and-drop di daftar proyek.')
                                    ->columns([
                                        'default' => 1,
                                        'sm' => 2,
                                    ])
                                    ->schema([
                                        Toggle::make('show_on_home')
                                            ->label('Tampilkan di beranda')
                                            ->helperText('Maks. 6 proyek di section Karya pilihan.')
                                            ->columnSpanFull(),
                                        TextInput::make('slug')
                                            ->label('Slug URL')
                                            ->required()
                                            ->unique(ignoreRecord: true)
                                            ->validationMessages(array_merge(
                                                CmsValidation::required('Slug URL'),
                                                CmsValidation::uniqueSlug(),
                                            ))
                                            ->helperText('Otomatis dari nama proyek (ID) saat dibuat.')
                                            ->columnSpanFull(),
                                        Select::make('category_id')
                                            ->label('Kategori')
                                            ->relationship('category', 'id')
                                            ->getOptionLabelFromRecordUsing(fn ($record) => $record->name)
                                            ->searchable()
                                            ->preload()
                                            ->required()
                                            ->validationMessages(CmsValidation::required('Kategori')),
                                        Select::make('status')
                                            ->label('Status')
                                            ->options(ProjectStatus::class)
                                            ->default(ProjectStatus::Draft)
                                            ->required()
                                            ->validationMessages(CmsValidation::required('Status'))
                                            ->helperText('Published = tayang publik.'),
                                        TextInput::make('location_city')
                                            ->label('Kota / lokasi')
                                            ->required()
                                            ->validationMessages(CmsValidation::required('Kota / lokasi'))
                                            ->placeholder('Jakarta Selatan'),
                                        TextInput::make('year_completed')
                                            ->label('Tahun selesai')
                                            ->numeric()
                                            ->required()
                                            ->minValue(2000)
                                            ->maxValue((int) date('Y') + 2)
                                            ->validationMessages(CmsValidation::yearCompleted()),
                                        TextInput::make('client_name')
                                            ->label('Klien')
                                            ->placeholder('Pak Andi / PT Sejahtera')
                                            ->helperText('Opsional.'),
                                        TextInput::make('area_size')
                                            ->label('Luas area')
                                            ->placeholder('240 m²')
                                            ->helperText('Opsional.'),
                                    ]),
                            ]),

                        Section::make('Foto')
                            ->icon(Heroicon::OutlinedPhoto)
                            ->description('Upload sekali — dipakai untuk Bahasa Indonesia dan English. Gunakan foto landscape (horizontal).')
                            ->columnSpanFull()
                            ->columns(1)
                            ->schema([
                                TextInput::make('cover_caption')
                                    ->label('Caption foto cover')
                                    ->helperText('Teks cadangan jika foto cover belum tersedia.'),
                                SpatieMediaLibraryFileUpload::make('cover')
                                    ->label('Foto cover')
                                    ->collection('cover')
                                    ->disk('public')
                                    ->image()
                                    ->imagePreviewHeight('320')
                                    ->panelLayout('integrated')
                                    ->panelAspectRatio('16:9')
                                    ->imageEditor()
                                    ->rules(['dimensions:min_width=2000,min_height=1125'])
                                    ->maxSize(8 * 1024)
                                    ->validationMessages(array_merge(
                                        CmsValidation::required('Foto cover'),
                                        CmsValidation::imageUpload(2000, 1125, 8),
                                    ))
                                    ->helperText('Format horizontal 16:9. Disarankan 2400×1350, minimal 2000×1125, maks. 8 MB.')
                                    ->required()
                                    ->columnSpanFull(),
                                SpatieMediaLibraryFileUpload::make('gallery')
                                    ->label('Foto galeri')
                                    ->collection('gallery')
                                    ->disk('public')
                                    ->image()
                                    ->imagePreviewHeight('140')
                                    ->panelLayout('grid')
                                    ->panelAspectRatio('16:9')
                                    ->itemPanelAspectRatio('16:9')
                                    ->multiple()
                                    ->reorderable()
                                    ->imageEditor()
                                    ->rules(['dimensions:min_width=1600,min_height=900'])
                                    ->maxSize(15 * 1024)
                                    ->validationMessages(CmsValidation::imageUpload(1600, 900, 15))
                                    ->helperText('Thumbnail horizontal 16:9. Disarankan 1920×1080 atau 2400×1350, maks. 15 MB per file.')
                                    ->columnSpanFull(),
                            ]),
                    ]),
            ]);
    }
}
