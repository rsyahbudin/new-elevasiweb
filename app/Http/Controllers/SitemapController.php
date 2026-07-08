<?php

namespace App\Http\Controllers;

use App\Models\Project;
use Illuminate\Http\Response;

class SitemapController extends Controller
{
    public function __invoke(): Response
    {
        $base = rtrim(config('app.url'), '/');
        $now = now()->toAtomString();

        $static = [
            ['loc' => '/', 'changefreq' => 'weekly', 'priority' => '1.0'],
            ['loc' => '/proyek', 'changefreq' => 'weekly', 'priority' => '0.9'],
            ['loc' => '/tentang', 'changefreq' => 'monthly', 'priority' => '0.7'],
            ['loc' => '/kontak', 'changefreq' => 'monthly', 'priority' => '0.8'],
            ['loc' => '/en', 'changefreq' => 'weekly', 'priority' => '0.9'],
            ['loc' => '/en/proyek', 'changefreq' => 'weekly', 'priority' => '0.8'],
            ['loc' => '/en/tentang', 'changefreq' => 'monthly', 'priority' => '0.6'],
            ['loc' => '/en/kontak', 'changefreq' => 'monthly', 'priority' => '0.7'],
        ];

        $projects = Project::published()
            ->get(['slug', 'updated_at', 'published_at'])
            ->flatMap(function (Project $project) use ($base) {
                $lastmod = ($project->updated_at ?? $project->published_at)?->toAtomString();

                return [
                    [
                        'loc' => "/proyek/{$project->slug}",
                        'changefreq' => 'monthly',
                        'priority' => '0.8',
                        'lastmod' => $lastmod,
                    ],
                    [
                        'loc' => "/en/proyek/{$project->slug}",
                        'changefreq' => 'monthly',
                        'priority' => '0.7',
                        'lastmod' => $lastmod,
                    ],
                ];
            });

        $urls = collect($static)
            ->map(fn (array $item) => [
                ...$item,
                'lastmod' => $item['lastmod'] ?? $now,
            ])
            ->concat($projects);

        $xml = view('sitemap', [
            'base' => $base,
            'urls' => $urls,
        ])->render();

        return response($xml, 200)->header('Content-Type', 'application/xml; charset=UTF-8');
    }
}
