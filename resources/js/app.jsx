import '../css/app.css';
import { createInertiaApp, router } from '@inertiajs/react';
import { resolvePageComponent } from 'laravel-vite-plugin/inertia-helpers';
import { createRoot } from 'react-dom/client';
import { createLocaleAwareRoute } from './route';

createInertiaApp({
    title: (title) => (title ? `${title} — Elevasi Design & Build` : 'Elevasi Design & Build'),
    resolve: (name) =>
        resolvePageComponent(`./Pages/${name}.jsx`, import.meta.glob('./Pages/**/*.jsx')),
    setup({ el, App, props }) {
        const initialLocale = props.initialPage?.props?.locale;

        window.route = createLocaleAwareRoute(
            () => router.page?.props?.locale ?? initialLocale,
            () => window.Ziggy,
        );

        createRoot(el).render(<App {...props} />);
    },
    progress: {
        color: '#1f7a46',
    },
});
