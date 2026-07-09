import { useEffect, useRef } from 'react';
import { router, usePage } from '@inertiajs/react';
import { loadGsap, prefersReducedMotion, refreshScrollTriggers } from '../lib/gsap';

let exitHandlerBound = false;

function shouldAnimateVisit(visit) {
    if (!visit) {
        return false;
    }

    if (visit.prefetch) {
        return false;
    }

    if (Array.isArray(visit.only) && visit.only.length > 0) {
        return false;
    }

    return true;
}

function bindExitTransition() {
    if (exitHandlerBound || typeof window === 'undefined') {
        return;
    }

    exitHandlerBound = true;

    router.on('before', (event) => {
        if (prefersReducedMotion() || !shouldAnimateVisit(event.detail.visit)) {
            return;
        }

        const page = document.getElementById('page-content');
        if (!page) {
            return;
        }

        event.pause();

        loadGsap().then((gsap) => {
            gsap.to(page, {
                autoAlpha: 0,
                y: -20,
                duration: 0.42,
                ease: 'power2.in',
                onComplete: () => event.resume(),
            });
        });
    });

    router.on('finish', () => {
        refreshScrollTriggers();
    });
}

export function usePageTransition() {
    const pageRef = useRef(null);
    const { url } = usePage();
    const isFirstRender = useRef(true);

    useEffect(() => {
        bindExitTransition();
    }, []);

    useEffect(() => {
        if (prefersReducedMotion()) {
            return undefined;
        }

        const page = pageRef.current;
        if (!page) {
            return undefined;
        }

        let ctx;

        (async () => {
            const gsap = await loadGsap();

            if (!pageRef.current) {
                return;
            }

            if (isFirstRender.current) {
                isFirstRender.current = false;
                gsap.set(page, { autoAlpha: 1, y: 0 });
                refreshScrollTriggers();
                return;
            }

            ctx = gsap.context(() => {
                gsap.fromTo(
                    page,
                    { autoAlpha: 0, y: 28 },
                    {
                        autoAlpha: 1,
                        y: 0,
                        duration: 0.95,
                        ease: 'power3.out',
                        onComplete: () => refreshScrollTriggers(),
                    },
                );
            }, page);
        })();

        return () => {
            ctx?.revert();
        };
    }, [url]);

    return pageRef;
}
