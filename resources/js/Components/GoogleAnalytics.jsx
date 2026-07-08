import { useEffect } from 'react';
import { usePage } from '@inertiajs/react';
import { ensureGtag, trackPageView } from '../lib/analytics';

export default function GoogleAnalytics() {
    const { url, settings } = usePage().props;
    const measurementId = settings?.gaMeasurementId;

    useEffect(() => {
        if (!measurementId) {
            return;
        }

        ensureGtag(measurementId);
        trackPageView(url, document.title);
    }, [measurementId, url]);

    return null;
}
