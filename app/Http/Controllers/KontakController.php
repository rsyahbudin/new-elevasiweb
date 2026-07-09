<?php

namespace App\Http\Controllers;

use App\Actions\Inquiries\BuildWhatsAppInquiryMessage;
use App\Actions\Inquiries\SubmitInquiry;
use App\Filament\Pages\ManageSiteSettings;
use App\Http\Requests\StoreInquiryRequest;
use App\Models\Project;
use App\Models\SiteSetting;
use Illuminate\Http\RedirectResponse;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;
use Inertia\Response;
use Symfony\Component\HttpFoundation\Response as HttpResponse;

class KontakController extends Controller
{
    public function show(): Response
    {
        $contact = SiteSetting::translatedMerged('contact', ManageSiteSettings::contactDefaults());

        $pageImagePath = $contact['page_image'] ?? null;
        $pageImageUrl = null;

        if (is_string($pageImagePath) && $pageImagePath !== '') {
            $pageImageUrl = str_starts_with($pageImagePath, 'http')
                ? $pageImagePath
                : Storage::disk('public')->url($pageImagePath);
        }

        $recentProjects = Project::published()
            ->ordered()
            ->with('category')
            ->limit(6)
            ->get()
            ->map(fn (Project $project) => [
                'slug' => $project->slug,
                'title' => $project->title,
                'coverImage' => $project->getFirstMediaUrl('cover', 'medium') ?: null,
                'caption' => $project->cover_caption ?? $project->title,
            ]);

        return Inertia::render('Kontak', [
            'content' => [
                'pageTitle' => $contact['page_title'] ?? null,
                'eyebrow' => $contact['page_eyebrow'] ?? null,
                'heading' => $contact['page_heading'] ?? null,
                'subheading' => $contact['page_subheading'] ?? null,
                'ctaLabel' => $contact['page_cta_label'] ?? null,
                'serviceArea' => $contact['service_area'] ?? null,
                'responseTime' => $contact['response_time'] ?? null,
                'prepareItems' => $contact['prepare_items'] ?? [],
                'processSteps' => $contact['process_steps'] ?? [],
                'pageImage' => $pageImageUrl,
                'labels' => [
                    'responseTime' => $contact['section_response_time_label'] ?? null,
                    'serviceArea' => $contact['section_service_area_label'] ?? null,
                    'prepare' => $contact['section_prepare_label'] ?? null,
                    'process' => $contact['section_process_label'] ?? null,
                    'recentWork' => $contact['section_recent_work_label'] ?? null,
                    'followInstagram' => $contact['section_follow_instagram_label'] ?? null,
                    'address' => $contact['section_address_label'] ?? null,
                    'instagram' => $contact['section_instagram_label'] ?? null,
                ],
            ],
            'recentProjects' => $recentProjects,
        ]);
    }

    public function store(
        StoreInquiryRequest $request,
        SubmitInquiry $submitInquiry,
        BuildWhatsAppInquiryMessage $buildWhatsAppInquiryMessage,
    ): HttpResponse|RedirectResponse {
        if (filled($request->validated('company'))) {
            return back();
        }

        $contact = SiteSetting::translatedMerged('contact', ManageSiteSettings::contactDefaults());
        $whatsappNumber = preg_replace('/\D/', '', $contact['whatsapp_number'] ?? '');

        if ($whatsappNumber === '') {
            return back()->withErrors([
                'contact' => __('WhatsApp number is not configured.'),
            ]);
        }

        $inquiry = $submitInquiry->handle([
            'name' => $request->validated('name'),
            'contact' => $request->validated('contact'),
            'message' => $request->validated('message'),
            'source_page' => $request->validated('source_page') ?? url()->previous(),
            'ip_address' => $request->ip(),
        ]);

        $message = $buildWhatsAppInquiryMessage->handle($inquiry);
        $whatsappUrl = 'https://wa.me/'.$whatsappNumber.'?text='.rawurlencode($message);

        return Inertia::location($whatsappUrl);
    }
}
