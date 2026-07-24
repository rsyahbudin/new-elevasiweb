<?php

namespace App\Http\Controllers;

use App\Models\Article;
use App\Models\GalleryItem;
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
            ['loc' => '/id', 'changefreq' => 'weekly', 'priority' => '0.9'],
            ['loc' => '/id/proyek', 'changefreq' => 'weekly', 'priority' => '0.8'],
            ['loc' => '/id/tentang', 'changefreq' => 'monthly', 'priority' => '0.6'],
            ['loc' => '/id/kontak', 'changefreq' => 'monthly', 'priority' => '0.7'],
        ];

        if (GalleryItem::published()->exists()) {
            $static[] = ['loc' => '/galeri', 'changefreq' => 'weekly', 'priority' => '0.8'];
            $static[] = ['loc' => '/id/galeri', 'changefreq' => 'weekly', 'priority' => '0.7'];
        }

        if (Article::published()->exists()) {
            $static[] = ['loc' => '/artikel', 'changefreq' => 'weekly', 'priority' => '0.8'];
            $static[] = ['loc' => '/id/artikel', 'changefreq' => 'weekly', 'priority' => '0.7'];
        }

        $projects = Project::published()
            ->get(['slug', 'updated_at', 'published_at'])
            ->flatMap(function (Project $project) {
                $lastmod = ($project->updated_at ?? $project->published_at)?->toAtomString();

                return [
                    [
                        'loc' => "/proyek/{$project->slug}",
                        'changefreq' => 'monthly',
                        'priority' => '0.8',
                        'lastmod' => $lastmod,
                    ],
                    [
                        'loc' => "/id/proyek/{$project->slug}",
                        'changefreq' => 'monthly',
                        'priority' => '0.7',
                        'lastmod' => $lastmod,
                    ],
                ];
            });

        $articles = Article::published()
            ->get(['slug', 'updated_at', 'published_at'])
            ->flatMap(function (Article $article) {
                $lastmod = ($article->updated_at ?? $article->published_at)?->toAtomString();

                return [
                    [
                        'loc' => "/artikel/{$article->slug}",
                        'changefreq' => 'monthly',
                        'priority' => '0.7',
                        'lastmod' => $lastmod,
                    ],
                    [
                        'loc' => "/id/artikel/{$article->slug}",
                        'changefreq' => 'monthly',
                        'priority' => '0.6',
                        'lastmod' => $lastmod,
                    ],
                ];
            });

        $urls = collect($static)
            ->map(fn (array $item) => [
                ...$item,
                'lastmod' => $item['lastmod'] ?? $now,
            ])
            ->concat($projects)
            ->concat($articles);

        $xml = view('sitemap', [
            'base' => $base,
            'urls' => $urls,
        ])->render();

        return response($xml, 200)->header('Content-Type', 'application/xml; charset=UTF-8');
    }
}
