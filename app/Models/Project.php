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
        'title', 'slug', 'category_id', 'location_city', 'area_size', 'year_completed',
        'scope_of_work', 'description', 'cover_caption', 'status', 'published_at', 'sort_order',
    ];

    protected $casts = [
        'status' => ProjectStatus::class,
        'published_at' => 'datetime',
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
        return $query->where('status', ProjectStatus::Published)
            ->orderByDesc('published_at');
    }

    public function scopeInCategory(Builder $query, ?string $categorySlug): Builder
    {
        if (! $categorySlug) {
            return $query;
        }

        return $query->whereHas('category', fn (Builder $q) => $q->where('slug', $categorySlug));
    }

    public function registerMediaCollections(): void
    {
        $this->addMediaCollection('cover')->singleFile();
        $this->addMediaCollection('gallery');
    }

    public function registerMediaConversions(?Media $media = null): void
    {
        $this->addMediaConversion('thumbnail')
            ->width(480)
            ->height(360)
            ->format('webp')
            ->nonQueued();

        $this->addMediaConversion('medium')
            ->width(1024)
            ->height(768)
            ->format('webp')
            ->queued();

        $this->addMediaConversion('large')
            ->width(1920)
            ->height(1440)
            ->format('webp')
            ->queued();
    }
}
