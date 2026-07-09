import { useEffect, useRef, useState } from 'react';
import { Link } from '@inertiajs/react';
import SiteLayout from '../Layouts/SiteLayout';
import Placeholder from '../Components/Placeholder';
import OptimizedImage from '../Components/OptimizedImage';
import Seo from '../Components/Seo';
import { useScrollReveal } from '../hooks/useScrollReveal';
import { useParallax } from '../hooks/useParallax';

function Hero({ hero }) {
    return (
        <>
            <section className="px-5 pb-0 pt-36 md:px-10 md:pt-[170px]">
                <div className="flex flex-wrap items-baseline justify-between gap-2 border-b border-[rgba(27,28,26,0.12)] pb-3.5 font-mono text-[11px] uppercase tracking-[0.08em] text-[rgba(27,28,26,0.5)] md:text-xs" data-reveal="0">
                    <span>{hero.eyebrow}</span>
                    <span>{hero.location}</span>
                    <span>{hero.established}</span>
                </div>

                <h1 className="mt-8 max-w-[14ch] text-[clamp(52px,9.5vw,168px)] font-semibold uppercase leading-[0.98] tracking-[-0.035em]" data-reveal="100">
                    {hero.headlineLine1}
                    <br />
                    <span className="inline-flex items-center gap-[3vw]">
                        <span className="serif-italic text-[rgb(31,122,70)]">{hero.headlineAccent}</span>
                        <span>
                            {hero.headlineWord}
                            <span className="serif-italic">.</span>
                        </span>
                    </span>
                </h1>

                <div className="mb-12 mt-10 flex flex-col items-start justify-between gap-5 md:mb-14 md:mt-12 md:flex-row md:items-end md:gap-10" data-reveal="200">
                    <p className="m-0 max-w-[420px] text-base leading-relaxed text-[rgba(27,28,26,0.65)] md:text-[17px]">{hero.lede}</p>
                    <Link href={route('projects.index')} className="flex items-center gap-3 text-sm font-semibold uppercase tracking-[0.06em]">
                        <span className="inline-block h-11 w-11 rounded-full border border-[rgba(27,28,26,0.25)] text-center text-base leading-[44px]">↓</span>
                        {hero.viewWork}
                    </Link>
                </div>
            </section>

            <section className="px-5 md:px-10">
                <div data-reveal="0" data-reveal-variant="clip" className="relative overflow-hidden rounded-sm">
                    {hero.coverImage ? (
                        <div className="relative h-[62vh] overflow-hidden md:h-[76vh]">
                            <OptimizedImage
                                src={hero.coverImage}
                                srcSet={hero.coverSrcSet}
                                alt={hero.coverCaption || 'Hero cover image'}
                                className="h-full w-full object-cover"
                                data-parallax="0.12"
                                loading="eager"
                                fetchPriority="high"
                                sizes="100vw"
                            />
                        </div>
                    ) : (
                        <Placeholder caption={hero.coverCaption} parallax={0.12} className="h-[62vh] md:h-[76vh]" />
                    )}
                    <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[rgba(27,28,26,0.12)] via-transparent to-transparent" />
                    {hero.badgeLabel && (
                        <div className="absolute bottom-4 left-4 rounded-full border border-[rgba(243,243,240,0.45)] bg-[rgba(27,28,26,0.45)] px-4 py-2 text-[10px] uppercase tracking-[0.12em] text-[rgb(243,243,240)] backdrop-blur-sm md:bottom-6 md:left-6 md:text-xs">
                            {hero.badgeLabel}
                        </div>
                    )}
                </div>
            </section>
        </>
    );
}

function Marquee({ text }) {
    const renderSegments = (prefix) =>
        Array.from({ length: 8 }, (_, i) => (
            <span
                key={`${prefix}-${i}`}
                className="inline-flex shrink-0 items-center whitespace-nowrap px-10 text-sm uppercase tracking-[0.14em] text-[rgba(27,28,26,0.55)] md:px-12 md:text-[15px]"
            >
                {text}
                <span className="mx-10 text-[rgba(27,28,26,0.28)] md:mx-12" aria-hidden="true">
                    ✦
                </span>
            </span>
        ));

    return (
        <section className="mt-20 overflow-hidden border-y border-[rgba(27,28,26,0.1)] py-5 md:mt-[90px] md:py-6">
            <div className="marquee-track flex w-max">
                <div className="flex shrink-0 items-center">{renderSegments('a')}</div>
                <div className="flex shrink-0 items-center" aria-hidden="true">
                    {renderSegments('b')}
                </div>
            </div>
        </section>
    );
}

function FeaturedWork({ featured, home }) {
    return (
        <section className="px-5 pb-10 pt-20 md:px-10 md:pb-10 md:pt-[110px]">
            <div className="mb-10 flex flex-wrap items-baseline justify-between gap-4 md:mb-14" data-reveal="0">
                <h2 className="m-0 text-[clamp(40px,5vw,80px)] font-semibold uppercase tracking-[-0.03em]">
                    {home.workHeading} <span className="serif-italic">{home.workHeadingAccent}</span>
                </h2>
                <span className="font-mono text-xs text-[rgba(27,28,26,0.5)]">( {home.workRange} )</span>
            </div>

            <div className="grid grid-cols-1 items-start gap-7 md:grid-cols-2">
                {featured.map((project, i) => (
                    <Link
                        key={project.slug}
                        href={route('projects.show', project.slug)}
                        className={`group block ${i % 2 === 1 ? 'md:mt-20' : ''}`}
                        data-reveal={(i % 2) * 100}
                    >
                        {project.coverImage ? (
                            <div className="overflow-hidden rounded-[2px]">
                                <OptimizedImage
                                    src={project.coverImage}
                                    srcSet={project.coverSrcSet}
                                    sizes="(min-width: 768px) 50vw, 100vw"
                                    alt={project.caption || project.title}
                                    className="aspect-[var(--ratio)] h-full w-full object-cover transition duration-500 group-hover:scale-[1.015]"
                                    style={{ '--ratio': i % 3 === 0 ? '4 / 4.6' : '4 / 3' }}
                                    loading="lazy"
                                />
                            </div>
                        ) : (
                            <Placeholder
                                caption={project.caption}
                                parallax={0.07}
                                className="aspect-[var(--ratio)] transition duration-500 group-hover:scale-[1.015]"
                                style={{ '--ratio': i % 3 === 0 ? '4 / 4.6' : '4 / 3' }}
                            />
                        )}
                        <div className="flex items-baseline justify-between px-0.5 pb-0 pt-4">
                            <span className="text-lg font-semibold tracking-[-0.01em] transition group-hover:text-[rgb(31,122,70)] md:text-xl">{project.title}</span>
                            <span className="font-mono text-xs uppercase text-[rgba(27,28,26,0.5)]">
                                {project.category} · {project.year}
                            </span>
                        </div>
                        <div className="px-0.5 pt-1 text-[13px] text-[rgba(27,28,26,0.5)]">{project.location}</div>
                    </Link>
                ))}
            </div>

            <div className="mt-14 text-center md:mt-[72px]" data-reveal="0">
                <Link
                    href={route('projects.index')}
                    className="inline-block rounded-full border border-[rgba(27,28,26,0.3)] px-8 py-4 text-sm font-semibold uppercase tracking-[0.08em] transition hover:bg-[rgb(27,28,26)] hover:text-[rgb(243,243,240)]"
                >
                    {home.workAllProjects} →
                </Link>
            </div>
        </section>
    );
}

function Services({ services, home }) {
    const [openIndex, setOpenIndex] = useState(null);

    const toggleService = (index) => {
        setOpenIndex((current) => (current === index ? null : index));
    };

    const relatedProjectsUrl = (categorySlug) => {
        if (!categorySlug) {
            return route('projects.index');
        }

        return `${route('projects.index')}?category=${categorySlug}`;
    };

    return (
        <section id="services" className="scroll-mt-28 px-5 py-20 md:px-10 md:py-[110px]">
            <div className="mono-label mb-7" data-reveal="0">
                ( {home.servicesEyebrow} )
            </div>
            <div className="flex flex-col">
                {services.map((service, i) => {
                    const isOpen = openIndex === i;

                    return (
                        <div
                            className="border-t border-[rgba(27,28,26,0.12)]"
                            key={service.number}
                            data-reveal={i * 60}
                        >
                            <button
                                type="button"
                                onClick={() => toggleService(i)}
                                className="group grid w-full cursor-pointer grid-cols-[40px_1fr_40px] gap-4 px-2 py-6 text-left transition hover:bg-[rgb(236,236,232)] md:grid-cols-[80px_1fr_1fr_40px] md:items-center md:gap-6 md:py-[34px]"
                                aria-expanded={isOpen}
                            >
                                <span className="font-mono text-[13px] text-[rgb(31,122,70)]">{service.number}</span>
                                <span className="text-[clamp(24px,3vw,44px)] font-semibold uppercase tracking-[-0.02em] transition group-hover:translate-x-1">
                                    {service.name}
                                </span>
                                <span className="col-start-2 max-w-[420px] text-sm leading-[1.55] text-[rgba(27,28,26,0.55)] md:col-auto">
                                    {service.description}
                                </span>
                                <span className={`text-xl transition group-hover:text-[rgb(31,122,70)] ${isOpen ? 'rotate-45 text-[rgb(31,122,70)]' : 'text-[rgba(27,28,26,0.4)]'}`}>
                                    +
                                </span>
                            </button>

                            <div
                                className={`grid overflow-hidden transition-all duration-500 ease-out ${
                                    isOpen ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'
                                }`}
                            >
                                <div className="min-h-0">
                                    <div className="px-2 pb-8 pt-0 md:px-[104px] md:pb-10">
                                        <p className="m-0 max-w-[640px] text-[15px] leading-[1.7] text-[rgba(27,28,26,0.7)]">
                                            {service.detail}
                                        </p>
                                        <Link
                                            href={relatedProjectsUrl(service.categorySlug)}
                                            className="mt-5 inline-flex items-center gap-2 text-sm font-semibold uppercase tracking-[0.06em] text-[rgb(31,122,70)] transition hover:translate-x-1"
                                        >
                                            {home.servicesViewProjects} →
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>
        </section>
    );
}

function Testimonials({ testimonials, home }) {
    const items = testimonials ?? [];
    const count = items.length;
    const [index, setIndex] = useState(0);
    const [paused, setPaused] = useState(false);
    const touchStartX = useRef(null);

    useEffect(() => {
        if (count <= 1 || paused) {
            return undefined;
        }

        if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
            return undefined;
        }

        const timer = window.setInterval(() => {
            setIndex((current) => (current + 1) % count);
        }, 6000);

        return () => window.clearInterval(timer);
    }, [count, paused]);

    if (count === 0) {
        return null;
    }

    const goTo = (nextIndex) => {
        setIndex(((nextIndex % count) + count) % count);
    };

    const active = items[index];

    return (
        <section
            className="px-5 pb-24 pt-10 text-center md:px-10 md:pb-[130px]"
            onMouseEnter={() => setPaused(true)}
            onMouseLeave={() => setPaused(false)}
            onFocusCapture={() => setPaused(true)}
            onBlurCapture={(event) => {
                if (!event.currentTarget.contains(event.relatedTarget)) {
                    setPaused(false);
                }
            }}
        >
            <div className="mono-label mb-8 md:mb-9" data-reveal="0">
                ( {home.testimonialEyebrow} )
            </div>

            <div
                className="relative mx-auto max-w-[980px]"
                data-reveal="100"
                onTouchStart={(event) => {
                    touchStartX.current = event.changedTouches[0]?.clientX ?? null;
                }}
                onTouchEnd={(event) => {
                    if (count <= 1 || touchStartX.current === null) {
                        return;
                    }

                    const delta = (event.changedTouches[0]?.clientX ?? 0) - touchStartX.current;
                    touchStartX.current = null;

                    if (Math.abs(delta) < 40) {
                        return;
                    }

                    goTo(index + (delta < 0 ? 1 : -1));
                }}
            >
                <blockquote
                    key={active.id}
                    className="animate-[fadeIn_500ms_ease] text-[clamp(28px,3.6vw,52px)] leading-[1.25] text-[rgb(27,28,26)] [text-wrap:balance]"
                >
                    &ldquo;{active.quote}&rdquo;
                </blockquote>
                <div className="mt-8 text-[13px] uppercase tracking-[0.08em] text-[rgba(27,28,26,0.55)]">
                    — {active.attribution}
                </div>
            </div>

            {count > 1 && (
                <div className="mt-10 flex items-center justify-center gap-4 md:mt-12" data-reveal="200">
                    <button
                        type="button"
                        onClick={() => goTo(index - 1)}
                        className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-[rgba(27,28,26,0.2)] text-sm transition hover:border-[rgb(27,28,26)] hover:bg-[rgb(27,28,26)] hover:text-[rgb(243,243,240)]"
                        aria-label="Testimoni sebelumnya"
                    >
                        ←
                    </button>

                    <div className="flex items-center gap-2">
                        {items.map((item, i) => (
                            <button
                                key={item.id}
                                type="button"
                                onClick={() => goTo(i)}
                                className={`h-2 rounded-full transition ${
                                    i === index
                                        ? 'w-6 bg-[rgb(31,122,70)]'
                                        : 'w-2 bg-[rgba(27,28,26,0.2)] hover:bg-[rgba(27,28,26,0.4)]'
                                }`}
                                aria-label={`Testimoni ${i + 1}`}
                                aria-current={i === index}
                            />
                        ))}
                    </div>

                    <button
                        type="button"
                        onClick={() => goTo(index + 1)}
                        className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-[rgba(27,28,26,0.2)] text-sm transition hover:border-[rgb(27,28,26)] hover:bg-[rgb(27,28,26)] hover:text-[rgb(243,243,240)]"
                        aria-label="Testimoni berikutnya"
                    >
                        →
                    </button>
                </div>
            )}
        </section>
    );
}

export default function Home({ hero, home, featured, marqueeText, services, testimonials }) {
    const containerRef = useRef(null);

    useScrollReveal(containerRef);
    useParallax(containerRef);

    useEffect(() => {
        if (window.location.hash === '#services') {
            document.getElementById('services')?.scrollIntoView({ behavior: 'smooth' });
        }
    }, []);

    return (
        <main ref={containerRef}>
            <Seo
                title={hero.pageTitle}
                description={hero.metaDescription}
                image={hero.coverImage}
                preloadImage
            />
            <Hero hero={hero} />
            <Marquee text={marqueeText} />
            <FeaturedWork featured={featured} home={home} />
            <Services services={services} home={home} />
            <Testimonials testimonials={testimonials} home={home} />
        </main>
    );
}

Home.layout = (page) => <SiteLayout>{page}</SiteLayout>;
