<?php

namespace App\Http\Middleware;

use App\Filament\Pages\ManageSiteSettings;
use App\Models\Article;
use App\Models\GalleryItem;
use App\Models\SiteSetting;
use App\Support\StoredImageSources;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Lang;
use Inertia\Middleware;
use Tighten\Ziggy\Ziggy;

class HandleInertiaRequests extends Middleware
{
    protected $rootView = 'app';

    public function version(Request $request): ?string
    {
        return parent::version($request);
    }

    /**
     * @return array<string, mixed>
     */
    public function share(Request $request): array
    {
        $locale = app()->getLocale();
        $otherLocale = $locale === 'en' ? 'id' : 'en';

        $contact = SiteSetting::translatedMerged('contact', ManageSiteSettings::contactDefaults(), $locale);
        $navigation = SiteSetting::translatedMerged('navigation', ManageSiteSettings::navigationDefaults(), $locale);
        $footerRaw = SiteSetting::get('footer', ManageSiteSettings::footerDefaults());
        $footer = SiteSetting::translatedMerged('footer', ManageSiteSettings::footerDefaults(), $locale);
        $whatsappNumber = preg_replace('/\D/', '', $contact['whatsapp_number'] ?? '');
        $footerCtaImagePath = is_array($footerRaw) ? ($footerRaw['cta_image'] ?? null) : null;
        $footerCtaSources = StoredImageSources::resolve(
            is_string($footerCtaImagePath) ? $footerCtaImagePath : null,
            'medium',
        );

        $heroRaw = SiteSetting::get('hero', ManageSiteSettings::heroDefaults());
        $heroCoverPath = is_array($heroRaw) ? ($heroRaw['cover_image'] ?? null) : null;
        $heroCoverSources = StoredImageSources::resolve(
            is_string($heroCoverPath) ? $heroCoverPath : null,
            'large',
        );
        $defaultOgImage = $heroCoverSources['src'] ?? null;

        $seoDefaults = [
            'id' => 'Elevasi Design & Build — kontraktor profesional di Jakarta untuk desain 3D, RAB, konstruksi, interior, dan furniture. Satu tim dari konsep hingga serah terima.',
            'en' => 'Elevasi Design & Build — Jakarta design-build contractor for 3D design, BOQ, construction, interior, and furniture. One team from concept to handover.',
        ];
        $heroMeta = is_array($heroRaw) ? ($heroRaw['meta_description'] ?? []) : [];
        $defaultDescription = (! empty($heroMeta[$locale]) ? $heroMeta[$locale] : null)
            ?? ($heroMeta['en'] ?? null)
            ?? ($heroMeta['id'] ?? null)
            ?? $seoDefaults[$locale]
            ?? $seoDefaults['en']
            ?? $seoDefaults['id'];

        $analytics = SiteSetting::get('analytics', ManageSiteSettings::analyticsDefaults()) ?? [];
        $gaMeasurementId = trim((string) (
            config('services.google_analytics.measurement_id')
            ?: ($analytics['ga_measurement_id'] ?? '')
        ));

        $hero = SiteSetting::translatedMerged('hero', ManageSiteSettings::heroDefaults(), $locale);
        $services = collect(SiteSetting::translatedMerged('services', ManageSiteSettings::servicesDefaults(), $locale))
            ->map(fn (array $service) => [
                'number' => $service['number'] ?? '',
                'name' => $service['name'] ?? '',
            ])
            ->take(4)
            ->values()
            ->all();

        return [
            ...parent::share($request),
            'locale' => $locale,
            'altLocaleUrl' => $this->urlForLocale($request, $otherLocale),
            'url' => '/'.ltrim($request->path(), '/'),
            't' => Lang::get('site', [], $locale),
            'seo' => [
                'appUrl' => rtrim(config('app.url'), '/'),
                'siteName' => config('app.name', 'Elevasi Design & Build'),
                'defaultDescription' => $defaultDescription,
                'defaultImage' => $defaultOgImage,
                'organizationJsonLd' => [
                    '@context' => 'https://schema.org',
                    '@type' => 'HomeAndConstructionBusiness',
                    'name' => config('app.name', 'Elevasi Design & Build'),
                    'description' => $defaultDescription,
                    'url' => rtrim(config('app.url'), '/'),
                    'image' => $defaultOgImage,
                    'address' => [
                        '@type' => 'PostalAddress',
                        'addressLocality' => 'Jakarta',
                        'addressCountry' => 'ID',
                    ],
                    'areaServed' => 'ID',
                    'sameAs' => array_values(array_filter([
                        $contact['instagram_url'] ?? null,
                    ])),
                ],
            ],
            'cms' => [
                'nav' => [
                    'work' => $navigation['work'] ?? '',
                    'gallery' => $navigation['gallery'] ?? '',
                    'articles' => $navigation['articles'] ?? '',
                    'studio' => $navigation['studio'] ?? '',
                    'contact' => $navigation['contact'] ?? '',
                    'cta' => $navigation['cta'] ?? '',
                    'ctaWhatsapp' => $contact['page_cta_label'] ?? $navigation['cta'] ?? '',
                    'showGallery' => GalleryItem::published()->exists(),
                    'showArticles' => Article::published()->exists(),
                ],
                'footer' => [
                    'eyebrow' => $footer['eyebrow'] ?? '',
                    'titleLine1' => $footer['title_line1'] ?? '',
                    'titleLine2' => $footer['title_line2'] ?? '',
                    'whatsapp' => $footer['whatsapp'] ?? '',
                    'copyright' => $footer['copyright'] ?? '',
                    'instagramLabel' => $footer['instagram_label'] ?? 'Instagram',
                    'whatsappLabel' => $footer['whatsapp_label'] ?? 'WhatsApp',
                    'ctaImage' => $footerCtaSources['src'] ?? null,
                    'ctaImageSrcSet' => $footerCtaSources['srcSet'] ?? null,
                ],
                'inquiry' => [
                    'title' => $contact['inquiry_dialog_title'] ?? '',
                    'description' => $contact['inquiry_dialog_description'] ?? '',
                    'nameLabel' => $contact['inquiry_dialog_name_label'] ?? '',
                    'contactLabel' => $contact['inquiry_dialog_contact_label'] ?? '',
                    'contactPlaceholder' => $contact['inquiry_dialog_contact_placeholder'] ?? '',
                    'messageLabel' => $contact['inquiry_dialog_message_label'] ?? '',
                    'messagePlaceholder' => $contact['inquiry_dialog_message_placeholder'] ?? '',
                    'submit' => $contact['inquiry_dialog_submit_label'] ?? '',
                    'submitting' => $contact['inquiry_dialog_submitting_label'] ?? '',
                    'cancel' => $contact['inquiry_dialog_cancel_label'] ?? '',
                ],
                'splash' => [
                    'location' => $hero['location'] ?? 'Jakarta, Indonesia',
                    'services' => $services,
                ],
            ],
            'ziggy' => fn () => [...(new Ziggy)->toArray(), 'location' => $request->url()],
            'settings' => [
                'whatsappUrl' => $whatsappNumber ? 'https://wa.me/'.$whatsappNumber : null,
                'whatsappDisplay' => $whatsappNumber ? '+'.$whatsappNumber : null,
                'email' => $contact['email'] ?? null,
                'address' => $contact['address'] ?? null,
                'instagramUrl' => $contact['instagram_url'] ?? null,
                'gaMeasurementId' => $gaMeasurementId !== '' ? $gaMeasurementId : null,
            ],
        ];
    }

    private function urlForLocale(Request $request, string $locale): string
    {
        $path = trim($request->path(), '/');
        $path = preg_replace('#^id(/|$)#', '', $path);

        $prefix = $locale === 'id' ? '/id' : '';
        $suffix = $path !== '' ? '/'.$path : '';

        return ($prefix.$suffix) ?: '/';
    }
}
