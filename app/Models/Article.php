<?php

namespace App\Models;

use App\Enums\ProjectStatus;
use Filament\Forms\Components\RichEditor\FileAttachmentProviders\SpatieMediaLibraryFileAttachmentProvider;
use Filament\Forms\Components\RichEditor\Models\Concerns\InteractsWithRichContent;
use Filament\Forms\Components\RichEditor\Models\Contracts\HasRichContent;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Model;
use Spatie\MediaLibrary\HasMedia;
use Spatie\MediaLibrary\InteractsWithMedia;
use Spatie\MediaLibrary\MediaCollections\Models\Media;
use Spatie\Translatable\HasTranslations;

class Article extends Model implements HasMedia, HasRichContent
{
    use HasTranslations;
    use HasUuids;
    use InteractsWithMedia;
    use InteractsWithRichContent;

    public const BODY_ID_ATTACHMENTS = 'body-id-attachments';

    public const BODY_EN_ATTACHMENTS = 'body-en-attachments';

    public array $translatable = ['title', 'excerpt', 'body'];

    protected $fillable = [
        'slug',
        'title',
        'excerpt',
        'body',
        'status',
        'published_at',
        'sort_order',
    ];

    protected $casts = [
        'status' => ProjectStatus::class,
        'published_at' => 'datetime',
    ];

    public function getRouteKeyName(): string
    {
        return 'slug';
    }

    public function scopePublished(Builder $query): Builder
    {
        return $query->where('status', ProjectStatus::Published);
    }

    public function scopeOrdered(Builder $query): Builder
    {
        return $query
            ->orderByDesc('published_at')
            ->orderBy('sort_order');
    }

    protected static function booted(): void
    {
        static::saving(function (Article $article) {
            if ($article->status === ProjectStatus::Published) {
                $article->published_at ??= now();
            }
        });
    }

    public function registerMediaCollections(): void
    {
        $this->addMediaCollection('cover')->singleFile()->useDisk('public');
        $this->addMediaCollection(self::BODY_ID_ATTACHMENTS)->useDisk('public');
        $this->addMediaCollection(self::BODY_EN_ATTACHMENTS)->useDisk('public');
    }

    public function setUpRichContent(): void
    {
        $this->registerRichContent('body_id')
            ->fileAttachmentProvider(
                SpatieMediaLibraryFileAttachmentProvider::make()
                    ->collection(self::BODY_ID_ATTACHMENTS),
            );

        $this->registerRichContent('body_en')
            ->fileAttachmentProvider(
                SpatieMediaLibraryFileAttachmentProvider::make()
                    ->collection(self::BODY_EN_ATTACHMENTS),
            );
    }

    public function bodyAttachmentCollection(string $richContentField): string
    {
        return $richContentField === 'body_en'
            ? self::BODY_EN_ATTACHMENTS
            : self::BODY_ID_ATTACHMENTS;
    }

    public function registerMediaConversions(?Media $media = null): void
    {
        $this->addMediaConversion('thumbnail')
            ->width(640)
            ->height(480)
            ->format('webp')
            ->nonQueued();

        $this->addMediaConversion('medium')
            ->width(1024)
            ->height(768)
            ->format('webp')
            ->nonQueued();

        $this->addMediaConversion('large')
            ->width(1920)
            ->height(1440)
            ->format('webp')
            ->nonQueued();
    }

    /**
     * @return array{src: string, srcSet: string|null, fullUrl: string}|null
     */
    public function coverImageSources(string $size = 'medium'): ?array
    {
        $media = $this->getFirstMedia('cover');

        if (! $media) {
            return null;
        }

        $urls = [];

        foreach (['thumbnail' => 640, 'medium' => 1024, 'large' => 1920] as $name => $width) {
            if ($media->hasGeneratedConversion($name)) {
                $urls[$name] = ['url' => $media->getUrl($name), 'width' => $width];
            }
        }

        if ($urls === []) {
            $fallback = $media->getUrl();

            return $fallback ? ['src' => $fallback, 'srcSet' => null, 'fullUrl' => $fallback] : null;
        }

        $src = $urls[$size]['url'] ?? $urls['medium']['url'] ?? $urls['thumbnail']['url'] ?? $media->getUrl();
        $srcSet = collect($urls)
            ->map(fn (array $item) => "{$item['url']} {$item['width']}w")
            ->implode(', ');

        return [
            'src' => $src,
            'srcSet' => $srcSet !== '' ? $srcSet : null,
            'fullUrl' => $media->getUrl(),
        ];
    }
}
