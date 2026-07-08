<?php

namespace App\Http\Controllers;

use App\Models\Category;
use App\Models\Project;
use App\Models\SiteSetting;
use App\Models\Testimonial;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;
use Inertia\Response;

class HomeController extends Controller
{
    public function __invoke(): Response
    {
        $hero = SiteSetting::translated('hero', default: []);
        $heroCoverImagePath = $hero['cover_image'] ?? $hero['coverImage'] ?? null;
        $heroCoverImageUrl = null;

        if (is_string($heroCoverImagePath) && $heroCoverImagePath !== '') {
            $heroCoverImageUrl = str_starts_with($heroCoverImagePath, 'http')
                ? $heroCoverImagePath
                : Storage::disk('public')->url($heroCoverImagePath);
        }

        $hero = [
            'location' => $hero['location'] ?? null,
            'established' => $hero['established'] ?? null,
            'headlineLine1' => $hero['headlineLine1'] ?? $hero['headline_line1'] ?? null,
            'headlineAccent' => $hero['headlineAccent'] ?? $hero['headline_accent'] ?? null,
            'headlineWord' => $hero['headlineWord'] ?? $hero['headline_word'] ?? null,
            'lede' => $hero['lede'] ?? null,
            'coverImage' => $heroCoverImageUrl,
            'coverCaption' => $hero['coverCaption'] ?? $hero['cover_caption'] ?? null,
            'marqueeText' => $hero['marqueeText'] ?? $hero['marquee_text'] ?? null,
            'badgeLabel' => $hero['badgeLabel'] ?? $hero['badge_label'] ?? null,
        ];

        $featured = Project::published()
            ->with('category')
            ->limit(6)
            ->get()
            ->map(fn (Project $project) => [
                'slug' => $project->slug,
                'title' => $project->title,
                'category' => $project->category->name,
                'location' => $project->location_city,
                'year' => $project->year_completed,
                'caption' => $project->cover_caption ?? $project->title,
                'coverImage' => $project->getFirstMediaUrl('cover', 'medium') ?: null,
            ]);

        $categoryNames = Category::query()->get()->map->name->implode(' ✦ ');
        $projectCount = Project::published()->count();
        $marqueeText = $hero['marqueeText'] ?: "{$categoryNames} ✦ {$projectCount}+ Completed Projects ✦";

        $testimonial = Testimonial::visible()->with('project')->latest()->first();

        return Inertia::render('Home', [
            'hero' => $hero,
            'featured' => $featured,
            'marqueeText' => $marqueeText,
            'services' => collect(SiteSetting::translated('services'))
                ->map(fn ($service) => [
                    'number' => $service['number'],
                    'name' => $service['name'],
                    'description' => $service['description'],
                ])
                ->values(),
            'testimonial' => $testimonial ? [
                'quote' => $testimonial->quote,
                'attribution' => $testimonial->project
                    ? "{$testimonial->client_name}, {$testimonial->project->location_city}"
                    : $testimonial->client_name,
            ] : null,
        ]);
    }
}
