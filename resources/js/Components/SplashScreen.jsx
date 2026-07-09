import { useEffect, useRef, useState } from 'react';
import { usePage } from '@inertiajs/react';
import logoWhite from '../../images/Logo-Elevasi-White.png';
import { waitForSiteReady } from '../lib/waitForSiteReady';

function prefersReducedMotion() {
    return typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

export default function SplashScreen() {
    const { cms } = usePage().props;
    const splash = cms?.splash ?? {};
    const location = splash.location ?? 'Jakarta, Indonesia';
    const services = splash.services ?? [];

    const rootRef = useRef(null);
    const [visible, setVisible] = useState(true);

    useEffect(() => {
        if (prefersReducedMotion()) {
            setVisible(false);
            return undefined;
        }

        document.body.classList.add('overflow-hidden');

        let cancelled = false;
        let enterTimeline;
        let exitTimeline;
        const abort = new AbortController();

        const finish = () => {
            setVisible(false);
            document.body.classList.remove('overflow-hidden');
        };

        const playExit = (gsap, { backdrop, leftCurtain, rightCurtain, content }) => {
            if (cancelled || exitTimeline) {
                return;
            }

            exitTimeline = gsap
                .timeline({ onComplete: finish })
                .to(content, {
                    opacity: 0,
                    y: -8,
                    scale: 0.98,
                    duration: 0.65,
                    ease: 'power2.in',
                })
                .call(() => {
                    gsap.set(backdrop, { autoAlpha: 0 });
                    gsap.set([leftCurtain, rightCurtain], { xPercent: 0, autoAlpha: 1 });
                })
                .to(leftCurtain, {
                    xPercent: -100,
                    duration: 1,
                    ease: 'power4.inOut',
                    force3D: true,
                })
                .to(
                    rightCurtain,
                    {
                        xPercent: 100,
                        duration: 1,
                        ease: 'power4.inOut',
                        force3D: true,
                    },
                    '<',
                );
        };

        (async () => {
            const { gsap } = await import('gsap');

            if (cancelled || !rootRef.current) {
                return;
            }

            const root = rootRef.current;
            const backdrop = root.querySelector('[data-splash-backdrop]');
            const leftCurtain = root.querySelector('[data-splash-curtain="left"]');
            const rightCurtain = root.querySelector('[data-splash-curtain="right"]');
            const content = root.querySelector('[data-splash-content]');
            const logo = root.querySelector('[data-splash-logo]');
            const locationEl = root.querySelector('[data-splash-location]');
            const servicesEl = root.querySelector('[data-splash-services]');
            const progress = root.querySelector('[data-splash-progress]');
            const loading = root.querySelector('[data-splash-loading]');

            gsap.set([logo, locationEl, loading, servicesEl].filter(Boolean), { opacity: 0 });
            gsap.set(progress, { scaleX: 0, transformOrigin: 'left center' });
            gsap.set(backdrop, { autoAlpha: 1 });
            gsap.set([leftCurtain, rightCurtain], { xPercent: 0, autoAlpha: 0 });
            gsap.set(content, { opacity: 1, y: 0, scale: 1 });

            const animateProgress = gsap.quickTo(progress, 'scaleX', {
                duration: 0.55,
                ease: 'power2.out',
            });

            let enterDone = false;
            let loadDone = false;

            const maybeExit = () => {
                if (!enterDone || !loadDone || cancelled) {
                    return;
                }

                window.setTimeout(() => {
                    playExit(gsap, { backdrop, leftCurtain, rightCurtain, content });
                }, 280);
            };

            enterTimeline = gsap
                .timeline({
                    defaults: { ease: 'power3.out' },
                    onComplete: () => {
                        enterDone = true;
                        maybeExit();
                    },
                })
                .fromTo(
                    logo,
                    { y: 24, scale: 0.92, opacity: 0 },
                    { y: 0, scale: 1, opacity: 1, duration: 1.1 },
                    0.15,
                );

            if (servicesEl) {
                enterTimeline.fromTo(
                    servicesEl,
                    { y: 6, opacity: 0 },
                    { y: 0, opacity: 1, duration: 0.55 },
                    0.62,
                );
            }

            enterTimeline
                .fromTo(
                    locationEl,
                    { y: 8, opacity: 0 },
                    { y: 0, opacity: 1, duration: 0.65 },
                    servicesEl ? 0.88 : 0.72,
                )
                .fromTo(loading, { opacity: 0 }, { opacity: 1, duration: 0.45 }, servicesEl ? 1.02 : 0.86);

            await waitForSiteReady({
                signal: abort.signal,
                minDuration: 2400,
                maxDuration: 9000,
                onProgress: (value) => {
                    if (cancelled) {
                        return;
                    }

                    animateProgress(value);
                },
            });

            if (cancelled) {
                return;
            }

            animateProgress(1);
            loadDone = true;
            maybeExit();
        })();

        return () => {
            cancelled = true;
            abort.abort();
            enterTimeline?.kill();
            exitTimeline?.kill();
            document.body.classList.remove('overflow-hidden');
        };
    }, []);

    if (!visible) {
        return null;
    }

    return (
        <div
            ref={rootRef}
            className="fixed inset-0 z-[200] overflow-hidden motion-reduce:hidden"
            aria-hidden="true"
            role="presentation"
        >
            <div data-splash-backdrop className="absolute inset-0 bg-ink" />

            <div
                data-splash-curtain="left"
                className="invisible absolute inset-y-0 left-0 z-[1] w-1/2 bg-ink opacity-0 will-change-transform"
            />
            <div
                data-splash-curtain="right"
                className="invisible absolute inset-y-0 right-0 z-[1] w-1/2 bg-ink opacity-0 will-change-transform"
            />

            <div
                data-splash-content
                className="relative z-[2] grid min-h-[100dvh] place-items-center px-5 text-paper sm:px-6"
            >
                <div className="flex w-[min(88vw,300px)] flex-col items-center gap-3 text-center sm:w-[min(84vw,360px)] sm:gap-3.5 md:w-[22rem]">
                    <div className="w-full">
                        <img
                            data-splash-logo
                            src={logoWhite}
                            alt="Elevasi Design & Build"
                            className="block h-auto w-full opacity-0 will-change-transform"
                        />
                    </div>

                    {services.length > 0 && (
                        <p
                            data-splash-services
                            className="text-[9px] uppercase leading-relaxed tracking-[0.12em] text-[rgba(243,243,240,0.75)] opacity-0 sm:text-[10px] sm:tracking-[0.14em]"
                        >
                            {services.map((service, index) => (
                                <span key={service.number ?? index}>
                                    {index > 0 && (
                                        <span className="mx-1.5 text-[rgba(243,243,240,0.35)] sm:mx-2">·</span>
                                    )}
                                    {service.name}
                                </span>
                            ))}
                        </p>
                    )}

                    <p
                        data-splash-location
                        className="font-mono text-[9px] uppercase tracking-[0.16em] text-accent opacity-0 sm:text-[10px]"
                    >
                        {location}
                    </p>

                    <div className="flex w-full flex-col items-center gap-1">
                        <div className="h-px w-full overflow-hidden rounded-full bg-[rgba(243,243,240,0.12)]">
                            <div data-splash-progress className="h-full w-full origin-left scale-x-0 rounded-full bg-accent will-change-transform" />
                        </div>
                        <span
                            data-splash-loading
                            className="font-mono text-[9px] uppercase tracking-[0.12em] text-[rgba(243,243,240,0.45)] opacity-0 sm:text-[10px]"
                        >
                            Loading
                        </span>
                    </div>
                </div>
            </div>
        </div>
    );
}
