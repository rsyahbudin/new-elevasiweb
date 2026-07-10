import { useEffect } from 'react';
import { whenIdle } from '../lib/defer';
import { loadGsap, prefersReducedMotion } from '../lib/gsap';

function shouldSkipParallax() {
    if (typeof window === 'undefined') {
        return true;
    }

    if (prefersReducedMotion()) {
        return true;
    }

    const coarsePointer = window.matchMedia('(pointer: coarse)').matches;
    const narrowViewport = window.matchMedia('(max-width: 768px)').matches;

    return coarsePointer || narrowViewport;
}

/**
 * Smooth scrub parallax on [data-parallax] placeholder fills only (not photos).
 */
export function useParallax(containerRef) {
    useEffect(() => {
        const container = containerRef.current;
        if (!container || shouldSkipParallax()) {
            return undefined;
        }

        const elements = Array.from(container.querySelectorAll('[data-parallax]')).filter(
            (el) => el.tagName !== 'IMG' && !el.querySelector('img'),
        );

        if (elements.length === 0) {
            return undefined;
        }

        let ctx;
        let cancelled = false;

        (async () => {
            await whenIdle();
            const gsap = await loadGsap();

            if (cancelled) {
                return;
            }

            ctx = gsap.context(() => {
                elements.forEach((el) => {
                    const host = el.parentElement;
                    if (!host) {
                        return;
                    }

                    const speed = parseFloat(el.dataset.parallax) || 0.08;
                    const travel = Math.max(16, Math.round(speed * 200));

                    gsap.fromTo(
                        el,
                        { y: -travel / 2, force3D: true },
                        {
                            y: travel / 2,
                            ease: 'none',
                            force3D: true,
                            scrollTrigger: {
                                trigger: host,
                                start: 'top bottom',
                                end: 'bottom top',
                                scrub: true,
                                invalidateOnRefresh: true,
                            },
                        },
                    );
                });
            }, container);
        })();

        return () => {
            cancelled = true;
            ctx?.revert();
        };
    }, [containerRef]);
}
