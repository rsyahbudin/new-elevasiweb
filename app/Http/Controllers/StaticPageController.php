<?php

namespace App\Http\Controllers;

use App\Filament\Pages\ManageSiteSettings;
use App\Models\Project;
use App\Models\SiteSetting;
use Inertia\Inertia;
use Inertia\Response;

class StaticPageController extends Controller
{
    public function tentang(): Response
    {
        $content = SiteSetting::translatedMerged('tentang', ManageSiteSettings::tentangDefaults());
        $projectCount = Project::published()->count();

        if (! empty($content['stats'][0])) {
            $content['stats'][0]['value'] = "{$projectCount}+";
        }

        $content['labels'] = [
            'eyebrow' => $content['section_eyebrow'] ?? null,
            'process' => $content['section_process_label'] ?? null,
            'values' => $content['section_values_label'] ?? null,
        ];

        $content['processIntro'] = $content['process_intro'] ?? null;

        return Inertia::render('Tentang', [
            'content' => $content,
        ]);
    }

    public function layanan(): \Illuminate\Http\RedirectResponse
    {
        return redirect()->to(route('home').'#services');
    }
}
