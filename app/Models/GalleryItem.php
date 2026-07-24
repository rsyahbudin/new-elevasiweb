<?php

namespace App\Models;

use App\Enums\ProjectStatus;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Model;
use Spatie\MediaLibrary\HasMedia;
use Spatie\MediaLibrary\InteractsWithMedia;
use Spatie\MediaLibrary\MediaCollections\Models\Media;
use Spatie\Translatable\HasTranslations;

class GalleryItem extends Model implements HasMedia
{
    use HasTranslations;
    use HasUuids;
    use InteractsWithMedia;

    public array $translatable = ['title'];

    protected $fillable = [
        'title',
        'status',
        'published_at',
        'sort_order',
    ];

    protected $casts = [
        'status' => ProjectStatus::class,
        'published_at' => 'datetime',
    ];

    public function scopePublished(Builder $query): Builder
    {
        return $query->where('status', ProjectStatus::Published);
    }

    public function scopeOrdered(Builder $query): Builder
    {
        return $query
            ->orderBy('sort_order')
            ->orderByDesc('published_at');
    }

    protected static function booted(): void
    {
        static::saving(function (GalleryItem $item) {
            if ($item->status === ProjectStatus::Published) {
                $item->published_at ??= now();
            }
        });
    }

    public function registerMediaCollections(): void
    {
        $this->addMediaCollection('image')->singleFile()->useDisk('public');
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
     * @return array{url: string, srcSet: string|null, fullUrl: string}|null
     */
    public function imageSources(string $size = 'medium'): ?array
    {
        $media = $this->getFirstMedia('image');

        if (! $media) {
            return null;
        }

        return Project::mediaImageSources($media, $size);
    }
}
