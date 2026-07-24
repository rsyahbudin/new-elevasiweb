<?php

namespace App\Http\Controllers;

use App\Filament\Pages\ManageSiteSettings;
use App\Models\GalleryItem;
use App\Models\SiteSetting;
use Inertia\Inertia;
use Inertia\Response;

class GalleryController extends Controller
{
    public function index(): Response
    {
        $items = GalleryItem::published()
            ->ordered()
            ->get()
            ->map(function (GalleryItem $item, int $index) {
                $sources = $item->imageSources('medium');

                return [
                    'id' => $item->id,
                    'label' => $item->title ?: 'Image '.($index + 1),
                    'url' => $sources['url'] ?? null,
                    'srcSet' => $sources['srcSet'] ?? null,
                    'fullUrl' => $sources['fullUrl'] ?? null,
                ];
            })
            ->filter(fn (array $item) => $item['url'] !== null)
            ->values();

        $labels = SiteSetting::translatedMerged('gallery', ManageSiteSettings::galleryDefaults());

        return Inertia::render('Gallery/Index', [
            'items' => $items,
            'meta' => [
                'total' => $items->count(),
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
}
