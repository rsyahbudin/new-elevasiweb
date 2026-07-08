<?php

namespace App\Http\Middleware;

use App\Models\SiteSetting;
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

        $contact = SiteSetting::translated('contact', $locale, []);
        $whatsappNumber = preg_replace('/\D/', '', $contact['whatsapp_number'] ?? '');
        $whatsappMessage = $contact['whatsapp_message'] ?? '';

        return [
            ...parent::share($request),
            'locale' => $locale,
            'altLocaleUrl' => $this->urlForLocale($request, $otherLocale),
            'url' => '/'.ltrim($request->path(), '/'),
            't' => Lang::get('site', [], $locale),
            'ziggy' => fn () => [...(new Ziggy)->toArray(), 'location' => $request->url()],
            'settings' => [
                'whatsappUrl' => $whatsappNumber
                    ? 'https://wa.me/'.$whatsappNumber.($whatsappMessage ? '?text='.rawurlencode($whatsappMessage) : '')
                    : null,
                'whatsappDisplay' => $whatsappNumber ? '+'.$whatsappNumber : null,
                'email' => $contact['email'] ?? null,
                'address' => $contact['address'] ?? null,
                'instagramUrl' => $contact['instagram_url'] ?? null,
                'linkedinUrl' => $contact['linkedin_url'] ?? null,
            ],
        ];
    }

    private function urlForLocale(Request $request, string $locale): string
    {
        $path = trim($request->path(), '/');
        $path = preg_replace('#^en(/|$)#', '', $path);

        $prefix = $locale === 'en' ? '/en' : '';
        $suffix = $path !== '' ? '/'.$path : '';

        return ($prefix.$suffix) ?: '/';
    }
}
