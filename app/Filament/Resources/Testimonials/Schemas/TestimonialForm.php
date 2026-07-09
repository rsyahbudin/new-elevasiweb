<?php

namespace App\Filament\Resources\Testimonials\Schemas;

use Filament\Forms\Components\Select;
use Filament\Forms\Components\Textarea;
use Filament\Forms\Components\TextInput;
use Filament\Forms\Components\Toggle;
use Filament\Schemas\Components\Section;
use Filament\Schemas\Components\Tabs;
use Filament\Schemas\Components\Tabs\Tab;
use Filament\Schemas\Schema;
use Filament\Support\Icons\Heroicon;

class TestimonialForm
{
    public static function configure(Schema $schema): Schema
    {
        return $schema
            ->components([
                Section::make('Testimoni klien')
                    ->description('Data klien dan proyek — tidak perlu diisi ulang per bahasa.')
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
                        Toggle::make('is_visible')
                            ->label('Tampilkan di situs')
                            ->default(true)
                            ->required()
                            ->helperText('Nonaktifkan jika ingin menyimpan tanpa menampilkan.'),
                    ])
                    ->columns(2),

                Tabs::make('Kutipan')
                    ->tabs([
                        Tab::make('Bahasa Indonesia')
                            ->icon(Heroicon::OutlinedLanguage)
                            ->schema([
                                Textarea::make('quote_id')
                                    ->label('Kutipan (ID)')
                                    ->required()
                                    ->rows(4)
                                    ->helperText('Teks utama testimoni dalam Bahasa Indonesia.'),
                            ]),
                        Tab::make('English')
                            ->icon(Heroicon::OutlinedGlobeAlt)
                            ->schema([
                                Textarea::make('quote_en')
                                    ->label('Quote (EN)')
                                    ->rows(4)
                                    ->helperText('Optional. Leave blank to use the Indonesian quote on /en.'),
                            ]),
                    ])
                    ->persistTabInQueryString('testimonial_lang')
                    ->columnSpanFull(),
            ]);
    }
}
