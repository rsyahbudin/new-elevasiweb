<?php

namespace App\Http\Controllers;

use App\Filament\Pages\ManageSiteSettings;
use App\Models\Category;
use App\Models\Project;
use App\Models\SiteSetting;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class ProjectController extends Controller
{
    private const PER_PAGE = 12;

    public function index(Request $request): Response
    {
        $activeCategory = $request->query('category');

        $projects = Project::published()
            ->ordered()
            ->with('category')
            ->inCategory($activeCategory)
            ->paginate(self::PER_PAGE)
            ->withQueryString()
            ->through(fn (Project $project) => [
                'slug' => $project->slug,
                'title' => $project->title,
                'category' => $project->category->name,
                'location' => $project->location_city,
                'area' => $project->area_size,
                'year' => $project->year_completed,
                'caption' => $project->cover_caption ?? $project->title,
                'coverImage' => $project->getFirstMediaUrl('cover', 'medium') ?: null,
            ]);

        $filters = Category::query()
            ->withCount(['projects' => fn ($query) => $query->published()])
            ->get()
            ->map(fn (Category $category) => [
                'slug' => $category->slug,
                'name' => $category->name,
                'count' => $category->projects_count,
            ]);

        $allPublishedCount = Project::published()->count();
        $filteredCount = Project::published()->inCategory($activeCategory)->count();
        $labels = SiteSetting::translatedMerged('projects', ManageSiteSettings::projectsDefaults());

        return Inertia::render('Projects/Index', [
            'projects' => $projects,
            'filters' => $filters,
            'activeCategory' => $activeCategory,
            'meta' => [
                'total' => $filteredCount,
                'all' => $allPublishedCount,
            ],
            'labels' => [
                'pageTitle' => $labels['index_page_title'] ?? null,
                'pageDescription' => $labels['index_meta_description'] ?? null,
                'heading' => $labels['index_heading'] ?? null,
                'headingAccent' => $labels['index_heading_accent'] ?? null,
                'allFilter' => $labels['index_all_filter'] ?? null,
                'empty' => $labels['index_empty'] ?? null,
            ],
        ]);
    }

    public function show(string $slug): Response
    {
        $project = Project::published()->with('category')->where('slug', $slug)->first();

        abort_if(! $project, 404);

        $allPublishedIds = Project::published()->ordered()->pluck('id')->all();
        $currentPosition = array_search($project->id, $allPublishedIds, true);
        $nextId = $allPublishedIds[($currentPosition + 1) % count($allPublishedIds)];
        $next = $nextId === $project->id ? null : Project::find($nextId);

        [$description1, $description2] = array_pad(explode("\n\n", $project->description, 2), 2, '');

        $labels = SiteSetting::translatedMerged('projects', ManageSiteSettings::projectsDefaults());

        return Inertia::render('Projects/Show', [
            'project' => [
                'slug' => $project->slug,
                'title' => $project->title,
                'category' => $project->category->name,
                'client' => $project->client_name,
                'location' => $project->location_city,
                'area' => $project->area_size,
                'year' => $project->year_completed,
                'scope' => $project->scope_of_work,
                'coverCaption' => $project->cover_caption ?? $project->title,
                'coverImage' => $project->getFirstMediaUrl('cover', 'large') ?: null,
                'description1' => $description1,
                'description2' => $description2,
            ],
            'gallery' => $project->getMedia('gallery')
                ->map(fn ($media, int $index) => [
                    'label' => $media->getCustomProperty('caption')
                        ?: "{$project->title} — image ".($index + 1),
                    'url' => $media->getAvailableUrl(['large', 'medium']),
                ])
                ->values(),
            'next' => $next ? ['slug' => $next->slug, 'title' => $next->title] : null,
            'labels' => [
                'allProjects' => $labels['detail_all_projects'] ?? null,
                'category' => $labels['detail_category'] ?? null,
                'client' => $labels['detail_client'] ?? null,
                'location' => $labels['detail_location'] ?? null,
                'yearCompleted' => $labels['detail_year_completed'] ?? null,
                'scope' => $labels['detail_scope'] ?? null,
                'area' => $labels['detail_area'] ?? null,
                'aboutProject' => $labels['detail_about_project'] ?? null,
                'nextProject' => $labels['detail_next_project'] ?? null,
                'ctaLabel' => $labels['detail_cta_label'] ?? null,
                'ctaNote' => $labels['detail_cta_note'] ?? null,
            ],
        ]);
    }
}
