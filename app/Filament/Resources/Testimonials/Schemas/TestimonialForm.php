<?php

namespace App\Filament\Resources\Testimonials\Schemas;

use Filament\Forms\Components\Select;
use Filament\Forms\Components\Textarea;
use Filament\Forms\Components\TextInput;
use Filament\Forms\Components\Toggle;
use Filament\Schemas\Components\Section;
use Filament\Schemas\Schema;

class TestimonialForm
{
    public static function configure(Schema $schema): Schema
    {
        return $schema
            ->components([
                Section::make('Testimoni klien')
                    ->description('Muncul di homepage jika status tampil aktif.')
                    ->schema([
                        TextInput::make('client_name')
                            ->label('Nama klien')
                            ->required()
                            ->placeholder('Contoh: Budi Santoso'),
                        Select::make('project_id')
                            ->label('Proyek terkait')
                            ->relationship('project', 'id')
                            ->getOptionLabelFromRecordUsing(fn ($record) => $record->title)
                            ->searchable()
                            ->preload()
                            ->helperText('Opsional. Jika diisi, kota proyek ikut ditampilkan.'),
                        Textarea::make('quote_id')
                            ->label('Kutipan (ID)')
                            ->required()
                            ->rows(4),
                        Textarea::make('quote_en')
                            ->label('Kutipan (EN)')
                            ->rows(4)
                            ->helperText('Opsional. Kosongkan untuk memakai kutipan Indonesia.'),
                        Toggle::make('is_visible')
                            ->label('Tampilkan di situs')
                            ->default(true)
                            ->required()
                            ->helperText('Nonaktifkan jika ingin menyimpan tanpa menampilkan.'),
                    ]),
            ]);
    }
}
