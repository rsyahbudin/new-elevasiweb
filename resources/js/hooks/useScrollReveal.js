import { useEffect } from 'react';
import { loadGsap, prefersReducedMotion } from '../lib/gsap';

/**
 * Scroll-triggered reveal for every [data-reveal] inside `containerRef`.
 * `data-reveal` = delay in ms. Optional `data-reveal-variant`: up | scale | clip.
 */
export function useScrollReveal(containerRef, deps = []) {
    useEffect(() => {
        const container = containerRef.current;
        if (!container) {
            return undefined;
        }

        const elements = Array.from(container.querySelectorAll('[data-reveal]'));
        if (elements.length === 0) {
            return undefined;
        }

        if (prefersReducedMotion()) {
            elements.forEach((el) => {
                el.style.opacity = '1';
                el.style.transform = 'none';
                el.style.clipPath = 'none';
            });
            return undefined;
        }

        let ctx;
        let cancelled = false;

        (async () => {
            const gsap = await loadGsap();

            if (cancelled || !containerRef.current) {
                return;
            }

            ctx = gsap.context(() => {
                elements.forEach((el) => {
                    const delay = (parseInt(el.dataset.reveal, 10) || 0) / 1000;
                    const variant = el.dataset.revealVariant || 'up';
                    const from = { opacity: 0 };
                    const to = {
                        opacity: 1,
                        duration: 1.05,
                        delay,
                        ease: 'power3.out',
                    };

                    if (variant === 'scale') {
                        from.scale = 0.94;
                        to.scale = 1;
                    } else if (variant === 'clip') {
                        from.clipPath = 'inset(100% 0 0 0)';
                        to.clipPath = 'inset(0% 0 0 0)';
                        to.duration = 1.2;
                    } else {
                        from.y = 32;
                        to.y = 0;
                    }

                    gsap.fromTo(el, from, {
                        ...to,
                        scrollTrigger: {
                            trigger: el,
                            start: 'top 88%',
                            once: true,
                        },
                    });
                });
            }, container);
        })();

        return () => {
            cancelled = true;
            ctx?.revert();
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps -- caller-controlled refresh key
    }, [containerRef, ...deps]);
}
