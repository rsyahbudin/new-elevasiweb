<?php

namespace App\Filament\Resources\Projects\Tables;

use App\Enums\ProjectStatus;
use Filament\Actions\BulkActionGroup;
use Filament\Actions\DeleteBulkAction;
use Filament\Actions\EditAction;
use Filament\Actions\ForceDeleteBulkAction;
use Filament\Actions\RestoreBulkAction;
use Filament\Tables\Columns\IconColumn;
use Filament\Tables\Columns\SpatieMediaLibraryImageColumn;
use Filament\Tables\Columns\TextColumn;
use Filament\Tables\Filters\SelectFilter;
use Filament\Tables\Filters\TrashedFilter;
use Filament\Tables\Table;

class ProjectsTable
{
    public static function configure(Table $table): Table
    {
        return $table
            ->defaultSort('sort_order')
            ->description('Urutan tampil di situs: geser baris proyek (↑↓) di tabel ini. Tidak perlu isi angka manual.')
            ->columns([
                SpatieMediaLibraryImageColumn::make('cover')
                    ->collection('cover')
                    ->conversion('thumbnail')
                    ->imageWidth(88)
                    ->imageHeight(66)
                    ->label(''),
                TextColumn::make('title')
                    ->label('Proyek')
                    ->searchable()
                    ->weight('medium'),
                TextColumn::make('category.name')
                    ->label('Kategori')
                    ->badge(),
                IconColumn::make('show_on_home')
                    ->label('Beranda')
                    ->boolean()
                    ->trueIcon('heroicon-o-home')
                    ->falseIcon('heroicon-o-minus')
                    ->trueColor('success')
                    ->tooltip('Tampil di section Karya pilihan di beranda'),
                TextColumn::make('client_name')
                    ->label('Klien')
                    ->searchable()
                    ->placeholder('—')
                    ->toggleable(),
                TextColumn::make('location_city')
                    ->label('Lokasi')
                    ->searchable(),
                TextColumn::make('area_size')
                    ->label('Area')
                    ->toggleable(isToggledHiddenByDefault: true),
                TextColumn::make('year_completed')
                    ->numeric()
                    ->sortable(),
                TextColumn::make('status')
                    ->badge()
                    ->color(fn (ProjectStatus $state) => match ($state) {
                        ProjectStatus::Published => 'success',
                        ProjectStatus::Draft => 'gray',
                    }),
                TextColumn::make('published_at')
                    ->dateTime()
                    ->sortable()
                    ->toggleable(isToggledHiddenByDefault: true),
            ])
            ->filters([
                SelectFilter::make('category')
                    ->relationship('category', 'id')
                    ->getOptionLabelFromRecordUsing(fn ($record) => $record->name),
                SelectFilter::make('status')
                    ->options(ProjectStatus::class),
                SelectFilter::make('show_on_home')
                    ->label('Beranda')
                    ->options([
                        '1' => 'Tampil di beranda',
                        '0' => 'Tidak di beranda',
                    ]),
                TrashedFilter::make(),
            ])
            ->recordActions([
                EditAction::make(),
            ])
            ->toolbarActions([
                BulkActionGroup::make([
                    DeleteBulkAction::make(),
                    ForceDeleteBulkAction::make(),
                    RestoreBulkAction::make(),
                ]),
            ])
            ->reorderable('sort_order');
    }
}
