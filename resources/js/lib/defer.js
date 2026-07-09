/**
 * Defers non-critical work until the browser is idle so LCP / first paint stay fast.
 */
export function whenIdle(timeout = 1800) {
    return new Promise((resolve) => {
        if (typeof window === 'undefined') {
            resolve();
            return;
        }

        if ('requestIdleCallback' in window) {
            window.requestIdleCallback(() => resolve(), { timeout });
            return;
        }

        window.setTimeout(resolve, 1);
    });
}
