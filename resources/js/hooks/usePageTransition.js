import { useEffect, useRef } from 'react';
import { usePage } from '@inertiajs/react';
import { loadGsap, prefersReducedMotion, refreshScrollTriggers } from '../lib/gsap';
import { scrollToTop } from '../lib/scrollToTop';

export function usePageTransition() {
    const pageRef = useRef(null);
    const { url } = usePage();
    const isFirstRender = useRef(true);

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

            scrollToTop();

            ctx = gsap.context(() => {
                gsap.fromTo(
                    page,
                    { autoAlpha: 0, y: 28 },
                    {
                        autoAlpha: 1,
                        y: 0,
                        duration: 0.95,
                        ease: 'power3.out',
                        onComplete: () => {
                            scrollToTop();
                            refreshScrollTriggers();
                        },
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
