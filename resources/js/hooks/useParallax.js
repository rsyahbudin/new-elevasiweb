import { useEffect } from 'react';
import { whenIdle } from '../lib/defer';
import { loadGsap, prefersReducedMotion } from '../lib/gsap';

/**
 * Smooth scrub parallax on [data-parallax] elements (value = intensity, default 0.08).
 */
export function useParallax(containerRef) {
    useEffect(() => {
        const container = containerRef.current;
        if (!container || prefersReducedMotion()) {
            return undefined;
        }

        const elements = Array.from(container.querySelectorAll('[data-parallax]'));
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
                    const travel = Math.max(24, Math.round(speed * 320));

                    gsap.fromTo(
                        el,
                        { y: -travel / 2 },
                        {
                            y: travel / 2,
                            ease: 'none',
                            scrollTrigger: {
                                trigger: host,
                                start: 'top bottom',
                                end: 'bottom top',
                                scrub: 0.65,
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
