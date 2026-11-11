<?php

namespace App\Http\Controllers;

use App\Actions\Inquiries\BuildWhatsAppInquiryMessage;
use App\Actions\Inquiries\SubmitInquiry;
use App\Filament\Pages\ManageSiteSettings;
use App\Http\Requests\StoreInquiryRequest;
use App\Models\Project;
use App\Models\SiteSetting;
use App\Support\ContactSettings;
use App\Support\ReferralOptions;
use App\Support\StoredImageSources;
use Illuminate\Http\RedirectResponse;
use Inertia\Inertia;
use Inertia\Response;
use Symfony\Component\HttpFoundation\Response as HttpResponse;

class KontakController extends Controller
{
    public function show(): Response
    {
        $contact = SiteSetting::translatedMerged('contact', ManageSiteSettings::contactDefaults());

        $pageImagePath = $contact['page_image'] ?? null;
        $pageImageSources = StoredImageSources::resolve(
            is_string($pageImagePath) ? $pageImagePath : null,
            'large',
        );

        $recentProjects = Project::published()
            ->ordered()
            ->with('category')
            ->limit(6)
            ->get()
            ->map(function (Project $project) {
                $cover = $project->coverImageSources('medium');

                return [
                    'slug' => $project->slug,
                    'title' => $project->title,
                    'coverImage' => $cover['src'] ?? null,
                    'coverSrcSet' => $cover['srcSet'] ?? null,
                    'caption' => $project->cover_caption ?? $project->title,
                ];
            });

        $companyProfile = ContactSettings::companyProfile();
        $contactPersons = ContactSettings::contactPersons();

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
                'pageImage' => $pageImageSources['src'] ?? null,
                'pageImageSrcSet' => $pageImageSources['srcSet'] ?? null,
                'companyProfileUrl' => $companyProfile['url'],
                'companyProfileLabel' => $companyProfile['label'],
                'companyProfileFilename' => $companyProfile['filename'],
                'contactPersons' => collect($contactPersons)
                    ->map(fn (array $person) => [
                        'index' => $person['index'],
                        'name' => $person['name'],
                        'role' => $person['role'],
                        'whatsappDisplay' => '+'.$person['whatsapp_number'],
                    ])
                    ->values()
                    ->all(),
                'labels' => [
                    'responseTime' => $contact['section_response_time_label'] ?? null,
                    'serviceArea' => $contact['section_service_area_label'] ?? null,
                    'prepare' => $contact['section_prepare_label'] ?? null,
                    'process' => $contact['section_process_label'] ?? null,
                    'recentWork' => $contact['section_recent_work_label'] ?? null,
                    'followInstagram' => $contact['section_follow_instagram_label'] ?? null,
                    'address' => $contact['section_address_label'] ?? null,
                    'instagram' => $contact['section_instagram_label'] ?? null,
                    'team' => $contact['section_team_label'] ?? null,
                    'download' => $contact['section_download_label'] ?? null,
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

        $personIndex = $request->validated('contact_person');
        $person = ContactSettings::resolvePerson(
            is_numeric($personIndex) ? (int) $personIndex : null,
        );

        if ($person === null) {
            return back()->withErrors([
                'contact' => __('WhatsApp number is not configured.'),
            ]);
        }

        $referralKey = $request->validated('referral_source');
        $referralOption = is_string($referralKey) ? ReferralOptions::find($referralKey) : null;

        $inquiry = $submitInquiry->handle([
            'name' => $request->validated('name'),
            'contact' => $request->validated('contact'),
            'message' => $request->validated('message'),
            'referral_source' => $referralOption['label'] ?? null,
            'referral_detail' => $request->validated('referral_detail'),
            'source_page' => $request->validated('source_page') ?? url()->previous(),
            'ip_address' => $request->ip(),
        ]);

        $message = $buildWhatsAppInquiryMessage->handle($inquiry, app()->getLocale());
        $whatsappUrl = 'https://wa.me/'.$person['whatsapp_number'].'?text='.rawurlencode($message);

        return Inertia::location($whatsappUrl);
    }
}
