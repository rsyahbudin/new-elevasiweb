<?php

namespace App\Filament\Widgets;

use App\Filament\Resources\Inquiries\InquiryResource;
use App\Models\Inquiry;
use Filament\Actions\ViewAction;
use Filament\Tables\Columns\TextColumn;
use Filament\Tables\Table;
use Filament\Widgets\TableWidget;

class LatestInquiriesWidget extends TableWidget
{
    protected static ?int $sort = 3;

    protected int|string|array $columnSpan = 'full';

    public function table(Table $table): Table
    {
        return $table
            ->heading('Lead terbaru')
            ->description('Percakapan masuk dari form WhatsApp di situs.')
            ->query(
                Inquiry::query()->latest()->limit(5)
            )
            ->columns([
                TextColumn::make('name')
                    ->label('Nama')
                    ->weight(fn ($record) => $record->read_at === null ? 'bold' : 'normal'),
                TextColumn::make('contact')
                    ->label('Kontak'),
                TextColumn::make('message')
                    ->label('Pesan')
                    ->limit(40)
                    ->tooltip(fn ($record) => $record->message),
                TextColumn::make('created_at')
                    ->label('Masuk')
                    ->since(),
                TextColumn::make('read_at')
                    ->label('Status')
                    ->badge()
                    ->getStateUsing(fn ($record) => $record->read_at ? 'Dibaca' : 'Baru')
                    ->color(fn (string $state) => $state === 'Baru' ? 'success' : 'gray'),
            ])
            ->recordActions([
                ViewAction::make()
                    ->label('Lihat')
                    ->url(fn (Inquiry $record) => InquiryResource::getUrl('view', ['record' => $record])),
            ])
            ->paginated(false);
    }
}
