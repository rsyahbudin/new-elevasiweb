<?php

namespace App\Filament\Resources\Inquiries\Schemas;

use Filament\Infolists\Components\TextEntry;
use Filament\Schemas\Components\Section;
use Filament\Schemas\Schema;

class InquiryInfolist
{
    public static function configure(Schema $schema): Schema
    {
        return $schema
            ->components([
                Section::make('Pesan lead')
                    ->schema([
                        TextEntry::make('name')
                            ->label('Nama'),
                        TextEntry::make('contact')
                            ->label('Kontak / WhatsApp')
                            ->url(fn ($record) => filled($record->contact)
                                ? 'https://wa.me/'.preg_replace('/\D/', '', $record->contact)
                                : null)
                            ->openUrlInNewTab(),
                        TextEntry::make('message')
                            ->label('Pesan')
                            ->columnSpanFull()
                            ->prose(),
                        TextEntry::make('inquiry_purpose')
                            ->label('Jenis pekerjaan')
                            ->placeholder('—'),
                        TextEntry::make('inquiry_purpose_detail')
                            ->label('Detail jenis pekerjaan')
                            ->placeholder('—'),
                        TextEntry::make('project_location')
                            ->label('Lokasi')
                            ->placeholder('—'),
                        TextEntry::make('has_drawings')
                            ->label('Sudah punya gambar')
                            ->placeholder('—'),
                        TextEntry::make('target_budget')
                            ->label('Target budget')
                            ->placeholder('—'),
                        TextEntry::make('referral_source')
                            ->label('Tahu dari')
                            ->placeholder('—'),
                        TextEntry::make('referral_detail')
                            ->label('Detail sumber')
                            ->placeholder('—'),
                    ])
                    ->columns(2),
                Section::make('Detail')
                    ->collapsed()
                    ->schema([
                        TextEntry::make('source_page')
                            ->label('Halaman sumber')
                            ->placeholder('—'),
                        TextEntry::make('ip_address')
                            ->label('IP address')
                            ->placeholder('—'),
                        TextEntry::make('read_at')
                            ->label('Dibaca pada')
                            ->dateTime()
                            ->placeholder('Belum dibaca'),
                        TextEntry::make('created_at')
                            ->label('Masuk pada')
                            ->dateTime(),
                    ])
                    ->columns(2),
            ]);
    }
}
