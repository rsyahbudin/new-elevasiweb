<?php

namespace App\Filament\Resources\Articles\Schemas;

use App\Enums\ProjectStatus;
use App\Support\CmsImageSpec;
use App\Support\CmsValidation;
use Filament\Forms\Components\RichEditor;
use Filament\Forms\Components\Select;
use Filament\Forms\Components\SpatieMediaLibraryFileUpload;
use Filament\Forms\Components\Textarea;
use Filament\Forms\Components\TextInput;
use Filament\Schemas\Components\Grid;
use Filament\Schemas\Components\Section;
use Filament\Schemas\Components\Tabs;
use Filament\Schemas\Components\Tabs\Tab;
use Filament\Schemas\Schema;
use Filament\Support\Icons\Heroicon;
use Illuminate\Support\Str;

class ArticleForm
{
    public static function configure(Schema $schema): Schema
    {
        $coverSpec = CmsImageSpec::preset('article_cover');
        $bodyToolbar = [
            ['bold', 'italic', 'underline'],
            ['h2', 'h3'],
            ['bulletList', 'orderedList'],
            ['blockquote', 'link'],
            ['undo', 'redo'],
        ];

        return $schema
            ->components([
                Grid::make(1)
                    ->schema([
                        Section::make('Detail')
                            ->columns(2)
                            ->schema([
                                TextInput::make('slug')
                                    ->label('Slug URL')
                                    ->required()
                                    ->validationMessages(CmsValidation::required('Slug URL'))
                                    ->maxLength(255)
                                    ->helperText('Dibuat otomatis dari judul Indonesia saat artikel baru.'),
                                Select::make('status')
                                    ->label('Status')
                                    ->options(ProjectStatus::class)
                                    ->default(ProjectStatus::Draft)
                                    ->required()
                                    ->validationMessages(CmsValidation::required('Status'))
                                    ->helperText('Published = tampil di situs & navbar (jika ada artikel lain).'),
                                SpatieMediaLibraryFileUpload::make('cover')
                                    ->label('Foto cover')
                                    ->collection('cover')
                                    ->image()
                                    ->imageEditor()
                                    ->panelAspectRatio('16:9')
                                    ->rules($coverSpec['rules'])
                                    ->maxSize(CmsImageSpec::MAX_KB)
                                    ->validationMessages($coverSpec['messages'])
                                    ->helperText($coverSpec['helper'])
                                    ->columnSpanFull(),
                            ]),

                        Tabs::make('Konten artikel')
                            ->tabs([
                                Tab::make('Bahasa Indonesia')
                                    ->icon(Heroicon::OutlinedLanguage)
                                    ->schema([
                                        TextInput::make('title_id')
                                            ->label('Judul')
                                            ->required()
                                            ->validationMessages(CmsValidation::required('Judul'))
                                            ->maxLength(255)
                                            ->live(onBlur: true)
                                            ->afterStateUpdated(function ($state, callable $set, string $operation) {
                                                if ($operation === 'create') {
                                                    $set('slug', Str::slug($state));
                                                }
                                            }),
                                        Textarea::make('excerpt_id')
                                            ->label('Ringkasan')
                                            ->rows(3)
                                            ->required()
                                            ->validationMessages(CmsValidation::required('Ringkasan'))
                                            ->helperText('Tampil di daftar artikel & meta SEO.'),
                                        RichEditor::make('body_id')
                                            ->label('Isi artikel')
                                            ->required()
                                            ->validationMessages(CmsValidation::required('Isi artikel'))
                                            ->toolbarButtons($bodyToolbar)
                                            ->helperText('Bold, italic, heading, bullet/numbered list, blockquote, dan link. Tampilan situs disesuaikan otomatis.')
                                            ->columnSpanFull(),
                                    ]),
                                Tab::make('English')
                                    ->icon(Heroicon::OutlinedGlobeAlt)
                                    ->schema([
                                        TextInput::make('title_en')
                                            ->label('Title')
                                            ->maxLength(255),
                                        Textarea::make('excerpt_en')
                                            ->label('Excerpt')
                                            ->rows(3),
                                        RichEditor::make('body_en')
                                            ->label('Body')
                                            ->toolbarButtons($bodyToolbar)
                                            ->helperText('Optional. Leave blank to use Indonesian content on /en.')
                                            ->columnSpanFull(),
                                    ]),
                            ])
                            ->persistTabInQueryString('article_lang')
                            ->columnSpanFull(),
                    ]),
            ]);
    }
}
