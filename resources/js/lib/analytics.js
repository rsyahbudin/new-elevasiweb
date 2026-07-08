const PAGE_VIEW_KEY = '__elevasiLastGaPage';

function canTrack() {
    return typeof window !== 'undefined' && typeof window.gtag === 'function';
}

/**
 * @param {string} measurementId
 */
export function ensureGtag(measurementId) {
    if (!measurementId || typeof window === 'undefined' || typeof document === 'undefined') {
        return;
    }

    window.dataLayer = window.dataLayer || [];
    if (typeof window.gtag !== 'function') {
        window.gtag = function gtag() {
            window.dataLayer.push(arguments);
        };
    }

    if (!document.getElementById('ga-gtag')) {
        const script = document.createElement('script');
        script.id = 'ga-gtag';
        script.async = true;
        script.src = `https://www.googletagmanager.com/gtag/js?id=${encodeURIComponent(measurementId)}`;
        document.head.appendChild(script);

        window.gtag('js', new Date());
        window.gtag('config', measurementId, {
            send_page_view: false,
            anonymize_ip: true,
        });
    }
}

/**
 * Track a page view for Inertia SPA navigations.
 * @param {string} [url]
 * @param {string} [title]
 */
export function trackPageView(url, title) {
    if (!canTrack()) {
        return;
    }

    const pagePath = url || `${window.location.pathname}${window.location.search}`;
    if (window[PAGE_VIEW_KEY] === pagePath) {
        return;
    }
    window[PAGE_VIEW_KEY] = pagePath;

    window.gtag('event', 'page_view', {
        page_path: pagePath,
        page_location: window.location.href,
        page_title: title || document.title,
    });
}

/**
 * @param {string} eventName
 * @param {Record<string, unknown>} [params]
 */
export function trackEvent(eventName, params = {}) {
    if (!canTrack() || !eventName) {
        return;
    }

    window.gtag('event', eventName, params);
}
