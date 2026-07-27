import { router } from '@inertiajs/react';

let skipNextRouteScrollReset = false;
let isInitialRoute = true;

if (typeof window !== 'undefined') {
    window.addEventListener(
        'popstate',
        () => {
            skipNextRouteScrollReset = true;
        },
        true,
    );
}

export function scrollToTop() {
    if (typeof window === 'undefined') {
        return;
    }

    window.scrollTo(0, 0);
    document.documentElement.scrollTop = 0;
    document.body.scrollTop = 0;
}

async function clearGsapScrollMemory() {
    try {
        const { ScrollTrigger } = await import('gsap/ScrollTrigger');
        ScrollTrigger.clearScrollMemory();
        ScrollTrigger.refresh();
    } catch {
        // GSAP not loaded yet.
    }
}

export function performScrollReset() {
    scrollToTop();

    requestAnimationFrame(() => {
        scrollToTop();
        void clearGsapScrollMemory().then(scrollToTop);
    });

    window.setTimeout(scrollToTop, 0);
    window.setTimeout(scrollToTop, 100);
    window.setTimeout(scrollToTop, 300);
}

export function resetScrollOnRouteChange() {
    if (isInitialRoute) {
        isInitialRoute = false;
        return;
    }

    if (skipNextRouteScrollReset) {
        skipNextRouteScrollReset = false;
        return;
    }

    performScrollReset();
}

let scrollResetBound = false;

export function bindScrollResetOnNavigation() {
    if (scrollResetBound || typeof window === 'undefined') {
        return;
    }

    scrollResetBound = true;

    router.on('finish', (event) => {
        const visit = event.detail?.visit;
        if (visit?.preserveScroll || visit?.prefetch) {
            return;
        }

        performScrollReset();
    });
}
