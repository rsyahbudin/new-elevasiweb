let gsapInstance = null;

export function prefersReducedMotion() {
    return typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

export async function loadGsap() {
    if (gsapInstance) {
        return gsapInstance;
    }

    const { gsap } = await import('gsap');
    const { ScrollTrigger } = await import('gsap/ScrollTrigger');

    gsap.registerPlugin(ScrollTrigger);
    ScrollTrigger.config({
        limitCallbacks: true,
        ignoreMobileResize: true,
    });
    gsapInstance = gsap;

    return gsapInstance;
}

export async function refreshScrollTriggers() {
    if (prefersReducedMotion()) {
        return;
    }

    await loadGsap();
    const { ScrollTrigger } = await import('gsap/ScrollTrigger');
    ScrollTrigger.refresh();
}
