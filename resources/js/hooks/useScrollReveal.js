import { useEffect } from 'react';

const FALLBACK_MS = 1200;
const OBSERVER_THRESHOLD = 0.12;
const VIEWPORT_OFFSET = 80;

/**
 * Reveals every [data-reveal] element inside `containerRef` as it enters the
 * viewport, staggered by its `data-reveal` delay (ms). Mirrors the Claude
 * Design prototype's behaviour 1:1, including the fallback that forces
 * visibility if the observer never fires (e.g. element already on-screen
 * with zero intersection ratio at mount).
 */
export function useScrollReveal(containerRef) {
    useEffect(() => {
        const container = containerRef.current;
        if (!container) return undefined;

        const elements = Array.from(container.querySelectorAll('[data-reveal]'));
        if (elements.length === 0) return undefined;
        const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

        if (prefersReducedMotion) {
            elements.forEach((el) => el.classList.add('is-visible'));
            return undefined;
        }

        const timers = [];
        const revealed = new WeakSet();

        const reveal = (el) => {
            if (revealed.has(el)) return;
            revealed.add(el);

            const delay = parseInt(el.dataset.reveal, 10) || 0;
            timers.push(
                setTimeout(() => {
                    el.classList.add('is-visible');
                }, delay),
            );
        };

        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (!entry.isIntersecting) return;
                    reveal(entry.target);
                    observer.unobserve(entry.target);
                });
            },
            { threshold: OBSERVER_THRESHOLD },
        );

        elements.forEach((el) => {
            el.classList.remove('is-visible');
            observer.observe(el);

            const rect = el.getBoundingClientRect();
            if (rect.top <= window.innerHeight - VIEWPORT_OFFSET && rect.bottom >= VIEWPORT_OFFSET) {
                reveal(el);
            }

            timers.push(
                setTimeout(() => {
                    reveal(el);
                }, FALLBACK_MS),
            );
        });

        return () => {
            observer.disconnect();
            timers.forEach(clearTimeout);
        };
    }, [containerRef]);
}
