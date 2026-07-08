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
                Tabs::make('Teks proyek')
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
                                    ->helperText('Contoh: Design + Build, Interior Fit-Out'),
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
                                    ->helperText('Kosongkan jika ingin memakai teks Bahasa Indonesia di situs.'),
                            ]),
                    ])
                    ->columnSpanFull(),

                Section::make('Detail proyek')
                    ->description('Sama untuk semua bahasa — tidak perlu diisi ulang per bahasa.')
                    ->columns(2)
                    ->schema([
                        TextInput::make('slug')
                            ->label('Slug URL')
                            ->required()
                            ->unique(ignoreRecord: true)
                            ->helperText('Otomatis dari nama proyek saat dibuat. Digunakan di URL publik.'),
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
                            ->helperText('Draft = belum tampil di situs. Published = tayang publik.'),
                        DateTimePicker::make('published_at')
                            ->label('Tanggal publish')
                            ->helperText('Disarankan diisi saat status Published.'),
                        TextInput::make('sort_order')
                            ->label('Urutan tampil')
                            ->numeric()
                            ->default(0)
                            ->required()
                            ->helperText('Angka lebih kecil tampil lebih dulu di daftar proyek.'),
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
