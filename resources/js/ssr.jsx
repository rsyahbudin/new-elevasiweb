import { createInertiaApp } from '@inertiajs/react';
import createServer from '@inertiajs/react/server';
import ReactDOMServer from 'react-dom/server';
import { createLocaleAwareRoute } from './route';

createServer((page) =>
    createInertiaApp({
        page,
        title: (title) => (title ? `${title} — Elevasi Design & Build` : 'Elevasi Design & Build'),
        render: ReactDOMServer.renderToString,
        resolve: (name) => {
            const pages = import.meta.glob('./Pages/**/*.jsx', { eager: true });
            return pages[`./Pages/${name}.jsx`];
        },
        setup({ App, props }) {
            global.route = createLocaleAwareRoute(
                () => props.initialPage?.props?.locale,
                () => props.initialPage?.props?.ziggy,
            );

            return <App {...props} />;
        },
    }),
);
