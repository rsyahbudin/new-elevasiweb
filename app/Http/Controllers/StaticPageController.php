<?php

namespace App\Http\Controllers;

use App\Models\SiteSetting;
use Inertia\Inertia;
use Inertia\Response;

class StaticPageController extends Controller
{
    public function tentang(): Response
    {
        return Inertia::render('Tentang', [
            'content' => SiteSetting::translated('tentang'),
        ]);
    }

    public function layanan(): Response
    {
        $services = collect(SiteSetting::translated('services'))
            ->map(fn ($service) => [
                'number' => $service['number'],
                'name' => $service['name'],
                'detail' => $service['detail'],
            ])
            ->values();

        return Inertia::render('Layanan', [
            'services' => $services,
        ]);
    }
}
