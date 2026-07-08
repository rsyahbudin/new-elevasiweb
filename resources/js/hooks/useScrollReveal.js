import { useEffect } from 'react';

const FALLBACK_MS = 1200;
const OBSERVER_THRESHOLD = 0.12;
const VIEWPORT_OFFSET = 80;

/**
 * Reveals every [data-reveal] element inside `containerRef` as it enters the
 * viewport, staggered by its `data-reveal` delay (ms).
 *
 * Pass `deps` whenever the revealed content can change without remounting the
 * page (e.g. Inertia filter/pagination with preserveState) so newly rendered
 * cards are observed again instead of staying invisible.
 *
 * @param {React.RefObject<HTMLElement|null>} containerRef
 * @param {unknown[]} [deps]
 */
export function useScrollReveal(containerRef, deps = []) {
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
        // eslint-disable-next-line react-hooks/exhaustive-deps -- caller-controlled refresh key
    }, [containerRef, ...deps]);
}
