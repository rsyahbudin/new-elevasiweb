<?php

namespace App\Http\Controllers;

use App\Enums\ProjectStatus;
use App\Filament\Pages\ManageSiteSettings;
use App\Models\Category;
use App\Models\Project;
use App\Models\SiteSetting;
use App\Models\Testimonial;
use App\Support\StoredImageSources;
use Inertia\Inertia;
use Inertia\Response;

class HomeController extends Controller
{
    public function __invoke(): Response
    {
        $heroRaw = SiteSetting::translatedMerged('hero', ManageSiteSettings::heroDefaults());
        $heroCoverImagePath = $heroRaw['cover_image'] ?? $heroRaw['coverImage'] ?? null;
        $heroCoverSources = StoredImageSources::resolve(
            is_string($heroCoverImagePath) ? $heroCoverImagePath : null,
            'large',
        );

        $hero = [
            'location' => $heroRaw['location'] ?? null,
            'established' => $heroRaw['established'] ?? null,
            'eyebrow' => $heroRaw['eyebrow'] ?? null,
            'viewWork' => $heroRaw['view_work'] ?? null,
            'pageTitle' => $heroRaw['page_title'] ?? null,
            'metaDescription' => $heroRaw['meta_description'] ?? null,
            'headlineLine1' => $heroRaw['headlineLine1'] ?? $heroRaw['headline_line1'] ?? null,
            'headlineAccent' => $heroRaw['headlineAccent'] ?? $heroRaw['headline_accent'] ?? null,
            'headlineWord' => $heroRaw['headlineWord'] ?? $heroRaw['headline_word'] ?? null,
            'lede' => $heroRaw['lede'] ?? null,
            'coverImage' => $heroCoverSources['src'] ?? null,
            'coverSrcSet' => $heroCoverSources['srcSet'] ?? null,
            'coverCaption' => $heroRaw['coverCaption'] ?? $heroRaw['cover_caption'] ?? null,
            'marqueeText' => $heroRaw['marqueeText'] ?? $heroRaw['marquee_text'] ?? null,
            'badgeLabel' => trim((string) ($heroRaw['badgeLabel'] ?? $heroRaw['badge_label'] ?? '')) ?: null,
        ];

        $home = SiteSetting::translatedMerged('home', ManageSiteSettings::homeDefaults());

        $publishedQuery = Project::query()
            ->where('status', ProjectStatus::Published)
            ->with('category');

        $hasHomeSelection = (clone $publishedQuery)->where('show_on_home', true)->exists();

        $featured = ($hasHomeSelection ? $publishedQuery->forHome() : $publishedQuery->ordered())
            ->limit(6)
            ->get()
            ->map(function (Project $project) {
                $cover = $project->coverImageSources('medium');

                return [
                    'slug' => $project->slug,
                    'title' => $project->title,
                    'category' => $project->category->name,
                    'location' => $project->location_city,
                    'year' => $project->year_completed,
                    'caption' => $project->cover_caption ?? $project->title,
                    'coverImage' => $cover['src'] ?? null,
                    'coverSrcSet' => $cover['srcSet'] ?? null,
                ];
            });

        $categoryNames = Category::query()->get()->map->name->implode(' ✦ ');
        $projectCount = Project::published()->count();
        $marqueeText = $hero['marqueeText'] ?: "{$categoryNames} ✦ {$projectCount}+ Completed Projects ✦";

        $testimonials = Testimonial::visible()
            ->with('project')
            ->latest()
            ->limit(10)
            ->get()
            ->map(fn (Testimonial $testimonial) => [
                'id' => $testimonial->id,
                'quote' => $testimonial->quote,
                'attribution' => $testimonial->project
                    ? "{$testimonial->client_name}, {$testimonial->project->location_city}"
                    : $testimonial->client_name,
            ])
            ->values();

        return Inertia::render('Home', [
            'hero' => $hero,
            'home' => [
                'workHeading' => $home['work_heading'] ?? null,
                'workHeadingAccent' => $home['work_heading_accent'] ?? null,
                'workRange' => $home['work_range'] ?? null,
                'workAllProjects' => $home['work_all_projects'] ?? null,
                'servicesEyebrow' => $home['services_eyebrow'] ?? null,
                'servicesViewProjects' => $home['services_view_projects'] ?? null,
                'testimonialEyebrow' => $home['testimonial_eyebrow'] ?? null,
            ],
            'featured' => $featured,
            'marqueeText' => $marqueeText,
            'services' => collect(SiteSetting::translatedMerged('services', ManageSiteSettings::servicesDefaults()))
                ->map(fn ($service) => [
                    'number' => $service['number'],
                    'name' => $service['name'],
                    'description' => $service['description'],
                    'detail' => $service['detail'] ?? $service['description'],
                    'categorySlug' => $service['category_slug'] ?? null,
                ])
                ->values(),
            'testimonials' => $testimonials,
        ]);
    }
}
