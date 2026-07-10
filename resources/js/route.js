import { route as ziggyRoute } from 'ziggy-js';

/**
 * Wraps Ziggy's route() so every existing call site (e.g. route('projects.index'))
 * keeps working unchanged while transparently resolving to the "id."-prefixed
 * route when the current page is in the Indonesian locale. Routes are registered
 * twice server-side (see routes/web.php) because Laravel's optional route
 * parameters only work at the end of a URI, so a single "{locale?}/proyek"
 * route can't match a bare "/proyek".
 */
export function createLocaleAwareRoute(getLocale, getZiggyConfig) {
    return (name, params, absolute, config) => {
        const locale = getLocale();
        const resolvedName = locale === 'id' && !name.startsWith('id.') ? `id.${name}` : name;

        return ziggyRoute(resolvedName, params, absolute, config ?? getZiggyConfig());
    };
}
