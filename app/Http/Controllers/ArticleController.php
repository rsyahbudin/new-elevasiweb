<?php

namespace App\Http\Controllers;

use App\Filament\Pages\ManageSiteSettings;
use App\Models\Article;
use App\Models\SiteSetting;
use App\Support\ArticleBodyRenderer;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class ArticleController extends Controller
{
    private const PER_PAGE = 12;

    public function index(Request $request): Response
    {
        $articles = Article::published()
            ->ordered()
            ->paginate(self::PER_PAGE)
            ->withQueryString()
            ->through(function (Article $article) {
                $cover = $article->coverImageSources('medium');

                return [
                    'slug' => $article->slug,
                    'title' => $article->title,
                    'excerpt' => $article->excerpt,
                    'publishedAt' => $article->published_at?->translatedFormat('d M Y'),
                    'coverImage' => $cover['src'] ?? null,
                    'coverSrcSet' => $cover['srcSet'] ?? null,
                ];
            });

        $labels = SiteSetting::translatedMerged('articles', ManageSiteSettings::articlesDefaults());

        return Inertia::render('Articles/Index', [
            'articles' => $articles,
            'meta' => [
                'total' => Article::published()->count(),
            ],
            'labels' => [
                'pageTitle' => $labels['index_page_title'] ?? null,
                'pageDescription' => $labels['index_meta_description'] ?? null,
                'heading' => $labels['index_heading'] ?? null,
                'headingAccent' => $labels['index_heading_accent'] ?? null,
                'empty' => $labels['index_empty'] ?? null,
            ],
        ]);
    }

    public function show(string $slug): Response
    {
        $article = Article::published()->where('slug', $slug)->first();

        abort_if(! $article, 404);

        $labels = SiteSetting::translatedMerged('articles', ManageSiteSettings::articlesDefaults());
        $cover = $article->coverImageSources('medium');

        $richContentField = ArticleBodyRenderer::richContentFieldForLocale($article, app()->getLocale());
        $body = $article->getTranslation('body', app()->getLocale(), false);

        if (ArticleBodyRenderer::isEmpty($body)) {
            $body = $article->getTranslation('body', 'id', false);
            $richContentField = 'body_id';
        }

        return Inertia::render('Articles/Show', [
            'article' => [
                'slug' => $article->slug,
                'title' => $article->title,
                'excerpt' => $article->excerpt,
                'bodyHtml' => ArticleBodyRenderer::toHtml($body, $article, $richContentField),
                'publishedAt' => $article->published_at?->translatedFormat('d M Y'),
                'coverImage' => $cover['src'] ?? null,
                'coverSrcSet' => $cover['srcSet'] ?? null,
                'coverFullUrl' => $cover['fullUrl'] ?? null,
            ],
            'labels' => [
                'allArticles' => $labels['detail_all_articles'] ?? null,
                'publishedOn' => $labels['detail_published_on'] ?? null,
            ],
        ]);
    }
}
