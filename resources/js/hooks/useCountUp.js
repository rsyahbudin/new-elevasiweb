import { useEffect, useRef, useState } from 'react';

export function useCountUp(target, { duration = 1200, enabled = true } = {}) {
    const [value, setValue] = useState(0);
    const ref = useRef(null);
    const hasRun = useRef(false);

    useEffect(() => {
        if (!enabled || hasRun.current) return undefined;

        const node = ref.current;
        if (!node) return undefined;

        const observer = new IntersectionObserver(
            ([entry]) => {
                if (!entry.isIntersecting || hasRun.current) return;

                hasRun.current = true;
                const start = performance.now();

                const tick = (now) => {
                    const progress = Math.min((now - start) / duration, 1);
                    const eased = 1 - (1 - progress) ** 3;
                    setValue(Math.round(target * eased));

                    if (progress < 1) {
                        requestAnimationFrame(tick);
                    }
                };

                requestAnimationFrame(tick);
            },
            { threshold: 0.35 },
        );

        observer.observe(node);

        return () => observer.disconnect();
    }, [target, duration, enabled]);

    return { ref, value };
}
