import { useEffect } from 'react';

const OFFSCREEN_MARGIN = 100;
const DEFAULT_SPEED = 0.08;

/**
 * Drives a lightweight parallax offset (translateY only, GPU-composited) on
 * every [data-parallax] element inside `containerRef`, batched behind a
 * single rAF per scroll event. Disabled under prefers-reduced-motion per
 * PRD US-2 (non-essential animation).
 */
export function useParallax(containerRef) {
    useEffect(() => {
        const container = containerRef.current;
        if (!container) return undefined;
        if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return undefined;

        const elements = Array.from(container.querySelectorAll('[data-parallax]'));
        if (elements.length === 0) return undefined;

        let raf = null;

        const apply = () => {
            raf = null;
            const vh = window.innerHeight;

            elements.forEach((el) => {
                const host = el.parentElement;
                const rect = host.getBoundingClientRect();
                if (rect.bottom < -OFFSCREEN_MARGIN || rect.top > vh + OFFSCREEN_MARGIN) return;

                const speed = parseFloat(el.dataset.parallax) || DEFAULT_SPEED;
                const offset = (rect.top + rect.height / 2 - vh / 2) * speed;
                el.style.transform = `translateY(${offset.toFixed(1)}px)`;
            });
        };

        const onScroll = () => {
            if (raf) return;
            raf = requestAnimationFrame(apply);
        };

        window.addEventListener('scroll', onScroll, { passive: true });
        apply();

        return () => {
            window.removeEventListener('scroll', onScroll);
            if (raf) cancelAnimationFrame(raf);
        };
    }, [containerRef]);
}
