<?php

namespace App\Models;

use App\Enums\ProjectStatus;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\SoftDeletes;
use Spatie\MediaLibrary\HasMedia;
use Spatie\MediaLibrary\InteractsWithMedia;
use Spatie\MediaLibrary\MediaCollections\Models\Media;
use Spatie\Translatable\HasTranslations;

class Project extends Model implements HasMedia
{
    use HasTranslations;
    use HasUuids;
    use InteractsWithMedia;
    use SoftDeletes;

    public array $translatable = ['title', 'description', 'scope_of_work'];

    protected $fillable = [
        'title', 'slug', 'category_id', 'client_name', 'location_city', 'area_size', 'year_completed',
        'scope_of_work', 'description', 'cover_caption', 'status', 'published_at', 'sort_order', 'show_on_home',
    ];

    protected $casts = [
        'status' => ProjectStatus::class,
        'published_at' => 'datetime',
        'show_on_home' => 'boolean',
    ];

    public function getRouteKeyName(): string
    {
        return 'slug';
    }

    public function category(): BelongsTo
    {
        return $this->belongsTo(Category::class);
    }

    public function testimonials(): HasMany
    {
        return $this->hasMany(Testimonial::class);
    }

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

    public function scopeInCategory(Builder $query, ?string $categorySlug): Builder
    {
        if (! $categorySlug) {
            return $query;
        }

        return $query->whereHas('category', fn (Builder $q) => $q->where('slug', $categorySlug));
    }

    public function scopeForHome(Builder $query): Builder
    {
        return $query
            ->where('show_on_home', true)
            ->ordered();
    }

    protected static function booted(): void
    {
        static::saving(function (Project $project) {
            if ($project->status === ProjectStatus::Published) {
                $project->published_at ??= now();
            }
        });
    }

    public function registerMediaCollections(): void
    {
        $this->addMediaCollection('cover')->singleFile()->useDisk('public');
        $this->addMediaCollection('gallery')->useDisk('public');
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

    /**
     * @return array{url: string, srcSet: string|null, fullUrl: string}
     */
    public static function mediaImageSources(Media $media, string $size = 'large'): array
    {
        $urls = [];

        foreach (['thumbnail' => 640, 'medium' => 1024, 'large' => 1920] as $name => $width) {
            if ($media->hasGeneratedConversion($name)) {
                $urls[$name] = ['url' => $media->getUrl($name), 'width' => $width];
            }
        }

        $url = $urls[$size]['url']
            ?? $urls['medium']['url']
            ?? $urls['thumbnail']['url']
            ?? $media->getUrl();

        $srcSet = collect($urls)
            ->map(fn (array $item) => "{$item['url']} {$item['width']}w")
            ->implode(', ');

        return [
            'url' => $url,
            'srcSet' => $srcSet !== '' ? $srcSet : null,
            'fullUrl' => $media->getUrl(),
        ];
    }
}
