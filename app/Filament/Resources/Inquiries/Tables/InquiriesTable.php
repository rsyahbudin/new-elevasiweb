<?php

namespace App\Filament\Resources\Inquiries\Tables;

use Filament\Actions\Action;
use Filament\Actions\BulkActionGroup;
use Filament\Actions\DeleteBulkAction;
use Filament\Actions\ViewAction;
use Filament\Tables\Columns\TextColumn;
use Filament\Tables\Filters\TernaryFilter;
use Filament\Tables\Table;

class InquiriesTable
{
    public static function configure(Table $table): Table
    {
        return $table
            ->defaultSort('created_at', 'desc')
            ->columns([
                TextColumn::make('name')
                    ->label('Nama')
                    ->searchable()
                    ->weight(fn ($record) => $record->read_at === null ? 'bold' : 'normal'),
                TextColumn::make('contact')
                    ->label('Kontak')
                    ->searchable(),
                TextColumn::make('message')
                    ->label('Pesan')
                    ->limit(50)
                    ->tooltip(fn ($record) => $record->message),
                TextColumn::make('source_page')
                    ->label('Sumber')
                    ->placeholder('—')
                    ->toggleable(isToggledHiddenByDefault: true),
                TextColumn::make('created_at')
                    ->label('Masuk')
                    ->dateTime()
                    ->sortable(),
                TextColumn::make('read_at')
                    ->label('Status')
                    ->badge()
                    ->getStateUsing(fn ($record) => $record->read_at ? 'Dibaca' : 'Baru')
                    ->color(fn (string $state) => $state === 'Baru' ? 'success' : 'gray'),
            ])
            ->filters([
                TernaryFilter::make('read_at')
                    ->label('Status baca')
                    ->nullable()
                    ->trueLabel('Sudah dibaca')
                    ->falseLabel('Belum dibaca')
                    ->queries(
                        true: fn ($query) => $query->whereNotNull('read_at'),
                        false: fn ($query) => $query->whereNull('read_at'),
                    ),
            ])
            ->recordActions([
                ViewAction::make()->label('Lihat'),
                Action::make('whatsapp')
                    ->label('WhatsApp')
                    ->icon('heroicon-o-chat-bubble-left')
                    ->url(fn ($record) => 'https://wa.me/'.preg_replace('/\D/', '', (string) $record->contact))
                    ->openUrlInNewTab()
                    ->visible(fn ($record) => filled(preg_replace('/\D/', '', (string) $record->contact))),
            ])
            ->toolbarActions([
                BulkActionGroup::make([
                    DeleteBulkAction::make(),
                ]),
            ]);
    }
}
