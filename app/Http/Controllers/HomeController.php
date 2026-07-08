<?php

namespace App\Http\Controllers;

use App\Models\Category;
use App\Models\Project;
use App\Models\SiteSetting;
use App\Models\Testimonial;
use Inertia\Inertia;
use Inertia\Response;

class HomeController extends Controller
{
    public function __invoke(): Response
    {
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
            ]);

        $categoryNames = Category::query()->get()->map->name->implode(' ✦ ');
        $projectCount = Project::published()->count();
        $marqueeText = "{$categoryNames} ✦ {$projectCount}+ Completed Projects ✦";

        $testimonial = Testimonial::visible()->with('project')->latest()->first();

        return Inertia::render('Home', [
            'hero' => SiteSetting::translated('hero'),
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
