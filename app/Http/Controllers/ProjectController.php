<?php

namespace App\Http\Controllers;

use App\Models\Category;
use App\Models\Project;
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
            ->with('category')
            ->inCategory($activeCategory)
            ->paginate(self::PER_PAGE)
            ->withQueryString()
            ->through(fn (Project $project) => [
                'slug' => $project->slug,
                'title' => $project->title,
                'category' => $project->category->name,
                'location' => $project->location_city,
                'year' => $project->year_completed,
                'caption' => $project->cover_caption ?? $project->title,
            ]);

        $filters = Category::query()
            ->withCount(['projects' => fn ($query) => $query->published()])
            ->get()
            ->map(fn (Category $category) => [
                'slug' => $category->slug,
                'name' => $category->name,
                'count' => $category->projects_count,
            ]);

        return Inertia::render('Projects/Index', [
            'projects' => $projects,
            'filters' => $filters,
            'activeCategory' => $activeCategory,
            'meta' => [
                'total' => Project::published()->inCategory($activeCategory)->count(),
            ],
        ]);
    }

    public function show(string $slug): Response
    {
        $project = Project::published()->with('category')->where('slug', $slug)->first();

        abort_if(! $project, 404);

        $allPublishedIds = Project::published()->pluck('id')->all();
        $currentPosition = array_search($project->id, $allPublishedIds, true);
        $nextId = $allPublishedIds[($currentPosition + 1) % count($allPublishedIds)];
        $next = $nextId === $project->id ? null : Project::find($nextId);

        $galleryLabels = [
            'interior, main space',
            'material detail',
            'section through courtyard',
            'stair detail',
            'evening exterior',
            'joinery close-up',
        ];

        [$description1, $description2] = array_pad(explode("\n\n", $project->description, 2), 2, '');

        return Inertia::render('Projects/Show', [
            'project' => [
                'slug' => $project->slug,
                'title' => $project->title,
                'category' => $project->category->name,
                'location' => $project->location_city,
                'year' => $project->year_completed,
                'scope' => $project->scope_of_work,
                'coverCaption' => $project->cover_caption ?? $project->title,
                'description1' => $description1,
                'description2' => $description2,
            ],
            'gallery' => collect($galleryLabels)->map(fn (string $label) => [
                'label' => "{$label} — {$project->title}",
            ])->values(),
            'next' => $next ? ['slug' => $next->slug, 'title' => $next->title] : null,
        ]);
    }
}
