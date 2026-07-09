<?php

namespace App\Filament\Resources\Projects\Schemas;

use App\Enums\ProjectStatus;
use Filament\Forms\Components\Select;
use Filament\Forms\Components\SpatieMediaLibraryFileUpload;
use Filament\Forms\Components\Textarea;
use Filament\Forms\Components\TextInput;
use Filament\Forms\Components\Toggle;
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
                Tabs::make('Teks proyek')
                    ->tabs([
                        Tab::make('Bahasa Indonesia')
                            ->icon(Heroicon::OutlinedLanguage)
                            ->schema([
                                Section::make('Konten Indonesia')
                                    ->description('Field di tab ini hanya untuk Bahasa Indonesia. Tidak menimpa teks English di tab sebelah.')
                                    ->schema([
                                        TextInput::make('title_id')
                                            ->label('Nama proyek')
                                            ->required()
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
                                            ->maxLength(255)
                                            ->helperText('Contoh: Design + Build, Interior Fit-Out'),
                                        Textarea::make('description_id')
                                            ->label('Deskripsi')
                                            ->rows(6)
                                            ->required()
                                            ->helperText('Pisahkan paragraf dengan baris kosong.'),
                                    ]),
                            ]),
                        Tab::make('English')
                            ->icon(Heroicon::OutlinedGlobeAlt)
                            ->schema([
                                Section::make('English content')
                                    ->description('Fields here are stored separately. Leaving them empty keeps the Indonesian text on the English site.')
                                    ->schema([
                                        TextInput::make('title_en')
                                            ->label('Project name')
                                            ->maxLength(255)
                                            ->helperText('Optional. Does not change the URL slug.'),
                                        TextInput::make('scope_of_work_en')
                                            ->label('Scope of work')
                                            ->maxLength(255),
                                        Textarea::make('description_en')
                                            ->label('Description')
                                            ->rows(6)
                                            ->helperText('Optional. Leave blank to use the Indonesian description on /en.'),
                                    ]),
                            ]),
                    ])
                    ->persistTabInQueryString('project_lang')
                    ->columnSpanFull(),

                Section::make('Penampilan di beranda')
                    ->description('Pengaturan ini sama untuk semua bahasa — tidak perlu diisi ulang per tab.')
                    ->schema([
                        Toggle::make('show_on_home')
                            ->label('Tampilkan di beranda')
                            ->helperText('Centang untuk menampilkan proyek ini di section Karya pilihan di homepage. Maksimal 6 proyek. Urutan mengikuti drag-and-drop di daftar Proyek.')
                            ->default(false),
                    ]),

                Section::make('Detail proyek')
                    ->description('Data teknis proyek — satu set untuk ID dan EN. Urutan tampil diatur dengan drag-and-drop di halaman daftar Proyek.')
                    ->columns(2)
                    ->schema([
                        TextInput::make('slug')
                            ->label('Slug URL')
                            ->required()
                            ->unique(ignoreRecord: true)
                            ->helperText('Otomatis dari nama proyek (ID) saat dibuat. Digunakan di URL publik.'),
                        Select::make('category_id')
                            ->label('Kategori')
                            ->relationship('category', 'id')
                            ->getOptionLabelFromRecordUsing(fn ($record) => $record->name)
                            ->searchable()
                            ->preload()
                            ->required(),
                        TextInput::make('client_name')
                            ->label('Klien')
                            ->placeholder('Contoh: Pak Andi / PT Sejahtera')
                            ->helperText('Opsional. Ditampilkan di halaman detail proyek.'),
                        TextInput::make('location_city')
                            ->label('Kota / lokasi')
                            ->required()
                            ->placeholder('Jakarta Selatan'),
                        TextInput::make('area_size')
                            ->label('Luas area')
                            ->placeholder('240 m²')
                            ->helperText('Opsional. Contoh: 240 m²'),
                        TextInput::make('year_completed')
                            ->label('Tahun selesai')
                            ->numeric()
                            ->required()
                            ->minValue(2000)
                            ->maxValue((int) date('Y') + 2),
                        Select::make('status')
                            ->label('Status')
                            ->options(ProjectStatus::class)
                            ->default(ProjectStatus::Draft)
                            ->required()
                            ->helperText('Draft = belum tampil di situs. Published = tayang publik — tanggal publish diisi otomatis.'),
                    ]),

                Section::make('Foto')
                    ->icon(Heroicon::OutlinedPhoto)
                    ->description('Upload sekali saja — foto dipakai bersama untuk Bahasa Indonesia dan English.')
                    ->schema([
                        TextInput::make('cover_caption')
                            ->label('Caption foto cover')
                            ->helperText('Teks cadangan jika foto cover belum tersedia.'),
                        SpatieMediaLibraryFileUpload::make('cover')
                            ->label('Foto cover')
                            ->collection('cover')
                            ->image()
                            ->imageEditor()
                            ->rules(['dimensions:min_width=2000,min_height=1200'])
                            ->maxSize(8 * 1024)
                            ->helperText('Disarankan 2400×1350 (16:9), minimal 2000×1200, max 8 MB.')
                            ->required(),
                        SpatieMediaLibraryFileUpload::make('gallery')
                            ->label('Gallery')
                            ->collection('gallery')
                            ->image()
                            ->multiple()
                            ->reorderable()
                            ->imageEditor()
                            ->rules(['dimensions:min_width=1400,min_height=1000'])
                            ->maxSize(15 * 1024)
                            ->helperText('Bisa banyak foto. Disarankan 1600×1200 (4:3), minimal 1400×1000, max 15 MB per file.'),
                    ]),
            ]);
    }
}
