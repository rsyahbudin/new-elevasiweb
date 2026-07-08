import { useRef } from 'react';
import { Head, Link, usePage } from '@inertiajs/react';
import SiteLayout from '../Layouts/SiteLayout';
import Placeholder from '../Components/Placeholder';
import { useScrollReveal } from '../hooks/useScrollReveal';
import { useParallax } from '../hooks/useParallax';

function Hero({ hero, t }) {
    return (
        <>
            <section className="px-5 pb-0 pt-36 md:px-10 md:pt-[170px]">
                <div className="flex flex-wrap items-baseline justify-between gap-2 border-b border-[rgba(27,28,26,0.12)] pb-3.5 font-mono text-[11px] uppercase tracking-[0.08em] text-[rgba(27,28,26,0.5)] md:text-xs" data-reveal="0">
                    <span>{t.hero.eyebrow}</span>
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
                        {t.hero.viewWork}
                    </Link>
                </div>
            </section>

            <section className="px-5 md:px-10">
                <div data-reveal="0" className="relative overflow-hidden rounded-sm">
                    {hero.coverImage ? (
                        <div className="relative h-[62vh] overflow-hidden md:h-[76vh]">
                            <img
                                src={hero.coverImage}
                                alt={hero.coverCaption || 'Hero cover image'}
                                className="h-full w-full object-cover"
                                data-parallax="0.12"
                                loading="eager"
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
    return (
        <section className="mt-20 overflow-hidden border-y border-[rgba(27,28,26,0.1)] py-5 md:mt-[90px]">
            <div className="flex w-max animate-[marq_28s_linear_infinite] whitespace-nowrap motion-reduce:animate-none">
                <span className="pr-12 text-sm uppercase tracking-[0.14em] text-[rgba(27,28,26,0.55)] md:text-[15px]">{text}&nbsp;</span>
                <span className="pr-12 text-sm uppercase tracking-[0.14em] text-[rgba(27,28,26,0.55)] md:text-[15px]">{text}&nbsp;</span>
            </div>
        </section>
    );
}

function FeaturedWork({ featured, t }) {
    return (
        <section className="px-5 pb-10 pt-20 md:px-10 md:pb-10 md:pt-[110px]">
            <div className="mb-10 flex flex-wrap items-baseline justify-between gap-4 md:mb-14" data-reveal="0">
                <h2 className="m-0 text-[clamp(40px,5vw,80px)] font-semibold uppercase tracking-[-0.03em]">
                    {t.work.heading} <span className="serif-italic">{t.work.headingAccent}</span>
                </h2>
                <span className="font-mono text-xs text-[rgba(27,28,26,0.5)]">( {t.work.range} )</span>
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
                                <img
                                    src={project.coverImage}
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
                    {t.work.allProjects} →
                </Link>
            </div>
        </section>
    );
}

function Services({ services, t }) {
    return (
        <section className="px-5 py-20 md:px-10 md:py-[110px]">
            <div className="mono-label mb-7" data-reveal="0">
                ( {t.services.eyebrow} )
            </div>
            <div className="flex flex-col">
                {services.map((service, i) => (
                    <div className="group grid cursor-pointer grid-cols-[40px_1fr] gap-4 border-t border-[rgba(27,28,26,0.12)] px-2 py-6 transition hover:bg-[rgb(236,236,232)] md:grid-cols-[80px_1fr_1fr_40px] md:items-center md:gap-6 md:py-[34px]" key={service.number} data-reveal={i * 60}>
                        <span className="font-mono text-[13px] text-[rgb(31,122,70)]">{service.number}</span>
                        <span className="text-[clamp(24px,3vw,44px)] font-semibold uppercase tracking-[-0.02em] transition group-hover:translate-x-1">{service.name}</span>
                        <span className="col-start-2 max-w-[420px] text-sm leading-[1.55] text-[rgba(27,28,26,0.55)] md:col-auto">{service.description}</span>
                        <span className="hidden text-xl text-[rgba(27,28,26,0.4)] transition group-hover:translate-x-1 group-hover:text-[rgb(31,122,70)] md:inline">↗</span>
                    </div>
                ))}
            </div>
        </section>
    );
}

function Testimonial({ testimonial, t }) {
    if (!testimonial) return null;

    return (
        <section className="px-5 pb-24 pt-10 text-center md:px-10 md:pb-[130px]">
            <div className="mono-label mb-8 md:mb-9" data-reveal="0">
                ( {t.testimonial.eyebrow} )
            </div>
            <blockquote className="mx-auto max-w-[980px] text-[clamp(28px,3.6vw,52px)] leading-[1.25] text-[rgb(27,28,26)] [text-wrap:balance]" data-reveal="100">
                &ldquo;{testimonial.quote}&rdquo;
            </blockquote>
            <div className="mt-8 text-[13px] uppercase tracking-[0.08em] text-[rgba(27,28,26,0.55)]" data-reveal="200">
                — {testimonial.attribution}
            </div>
        </section>
    );
}

export default function Home({ hero, featured, marqueeText, services, testimonial }) {
    const { props } = usePage();
    const { t } = props;
    const containerRef = useRef(null);

    useScrollReveal(containerRef);
    useParallax(containerRef);

    return (
        <main ref={containerRef}>
            <Head title={t.meta.homeTitle} />
            <Hero hero={hero} t={t} />
            <Marquee text={marqueeText} />
            <FeaturedWork featured={featured} t={t} />
            <Services services={services} t={t} />
            <Testimonial testimonial={testimonial} t={t} />
        </main>
    );
}

Home.layout = (page) => <SiteLayout>{page}</SiteLayout>;
