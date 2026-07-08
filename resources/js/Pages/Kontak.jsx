import { useRef } from 'react';
import { Link, usePage } from '@inertiajs/react';
import SiteLayout from '../Layouts/SiteLayout';
import Placeholder from '../Components/Placeholder';
import ProcessSteps from '../Components/ProcessSteps';
import Seo from '../Components/Seo';
import WhatsAppButton from '../Components/WhatsAppButton';
import { useScrollReveal } from '../hooks/useScrollReveal';

export default function Kontak({ content, recentProjects }) {
    const { props } = usePage();
    const { settings } = props;
    const containerRef = useRef(null);
    useScrollReveal(containerRef);

    const labels = content.labels ?? {};
    const prepareItems = content.prepareItems ?? [];
    const processSteps = content.processSteps ?? [];

    return (
        <main className="px-5 pb-16 pt-36 md:px-10 md:pb-24 md:pt-[170px]" ref={containerRef}>
            <Seo
                title={content.pageTitle}
                description={content.subheading || undefined}
                image={content.pageImage || undefined}
            />

            <section className="relative overflow-hidden rounded-sm bg-[rgb(27,28,26)] px-6 py-14 text-[rgb(243,243,240)] md:px-12 md:py-20" data-reveal="0">
                <div className="relative z-10 max-w-[900px]">
                    <span className="mono-label text-[rgba(243,243,240,0.45)]">( {content.eyebrow} )</span>
                    <h1 className="m-0 mt-5 max-w-[14ch] text-[clamp(40px,7vw,96px)] font-semibold uppercase leading-[0.95] tracking-[-0.035em]">
                        {content.heading}
                    </h1>
                    <p className="mt-6 max-w-[480px] text-base leading-relaxed text-[rgba(243,243,240,0.65)] md:text-[17px]">
                        {content.subheading}
                    </p>
                    <WhatsAppButton
                        source="/kontak-hero"
                        className="mt-10 inline-flex w-full max-w-sm items-center justify-center gap-3 rounded-full bg-[rgb(31,122,70)] px-9 py-4 text-sm font-semibold uppercase tracking-[0.06em] text-[rgb(243,243,240)] transition hover:scale-[1.02] hover:bg-[rgb(243,243,240)] hover:text-[rgb(27,28,26)] sm:w-auto sm:max-w-none"
                    >
                        {content.ctaLabel}
                    </WhatsAppButton>
                </div>
                <div className="pointer-events-none absolute -right-16 -top-16 h-64 w-64 rounded-full bg-[rgba(31,122,70,0.15)] blur-3xl" />
            </section>

            {(content.responseTime || content.serviceArea) && (
                <section className="mt-10 grid grid-cols-1 gap-6 border-b border-[rgba(27,28,26,0.12)] pb-12 md:mt-14 md:grid-cols-2 md:gap-10 md:pb-16">
                    {content.responseTime && (
                        <div data-reveal="60">
                            <div className="mono-label mb-3">( {labels.responseTime} )</div>
                            <p className="m-0 text-[17px] leading-[1.6] text-[rgba(27,28,26,0.75)]">{content.responseTime}</p>
                        </div>
                    )}
                    {content.serviceArea && (
                        <div data-reveal="120">
                            <div className="mono-label mb-3">( {labels.serviceArea} )</div>
                            <p className="m-0 text-[17px] leading-[1.6] text-[rgba(27,28,26,0.75)]">{content.serviceArea}</p>
                        </div>
                    )}
                </section>
            )}

            {prepareItems.length > 0 && (
                <section className="mt-12 md:mt-16">
                    <div className="mono-label mb-8" data-reveal="0">( {labels.prepare} )</div>
                    <div className="grid grid-cols-1 gap-8 md:grid-cols-2 md:gap-x-16 md:gap-y-10">
                        {prepareItems.map((item, i) => (
                            <div key={item.title} className="group border-t border-[rgba(27,28,26,0.12)] pt-6" data-reveal={i * 60}>
                                <div className="mb-2 font-mono text-[13px] text-[rgb(31,122,70)]">{String(i + 1).padStart(2, '0')}</div>
                                <h2 className="m-0 text-xl font-semibold uppercase tracking-[-0.01em] transition group-hover:text-[rgb(31,122,70)] md:text-2xl">
                                    {item.title}
                                </h2>
                                <p className="mt-3 text-[15px] leading-[1.6] text-[rgba(27,28,26,0.6)]">{item.description}</p>
                            </div>
                        ))}
                    </div>
                </section>
            )}

            {content.pageImage && (
                <section className="mt-14 md:mt-20" data-reveal="0">
                    <div className="relative overflow-hidden rounded-sm">
                        <img
                            src={content.pageImage}
                            alt={content.heading}
                            className="aspect-[16/9] w-full object-cover md:aspect-[21/9]"
                            loading="lazy"
                        />
                    </div>
                </section>
            )}

            {processSteps.length > 0 && (
                <section className="mt-14 md:mt-20">
                    <div className="mono-label mb-8 md:mb-10" data-reveal="0">( {labels.process} )</div>
                    <ProcessSteps steps={processSteps} />
                </section>
            )}

            {recentProjects.length > 0 && (
                <section className="mt-14 md:mt-20">
                    <div className="mb-8 flex flex-wrap items-end justify-between gap-4" data-reveal="0">
                        <span className="mono-label">( {labels.recentWork} )</span>
                        {settings.instagramUrl && (
                            <a
                                href={settings.instagramUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-sm font-semibold uppercase tracking-[0.06em] transition hover:text-[rgb(31,122,70)]"
                            >
                                {labels.followInstagram} ↗
                            </a>
                        )}
                    </div>
                    <div className="grid grid-cols-2 gap-3 md:grid-cols-3 md:gap-4">
                        {recentProjects.map((project, i) => (
                            <Link
                                key={project.slug}
                                href={route('projects.show', project.slug)}
                                className="group overflow-hidden rounded-sm"
                                data-reveal={i * 50}
                            >
                                {project.coverImage ? (
                                    <img
                                        src={project.coverImage}
                                        alt={project.caption}
                                        className="aspect-[4/5] w-full object-cover transition duration-500 group-hover:scale-[1.03]"
                                        loading="lazy"
                                    />
                                ) : (
                                    <Placeholder
                                        caption={project.caption}
                                        className="aspect-[4/5] transition duration-500 group-hover:scale-[1.03]"
                                    />
                                )}
                            </Link>
                        ))}
                    </div>
                </section>
            )}

            <section className="mt-14 flex flex-col gap-10 border-t border-[rgba(27,28,26,0.12)] pt-12 md:mt-20 md:flex-row md:justify-between md:gap-20 md:pt-16">
                <div data-reveal="0">
                    <div className="mb-2 font-mono text-[11px] uppercase tracking-[0.08em] text-[rgba(27,28,26,0.45)]">{labels.address}</div>
                    <div className="text-base font-medium">{settings.address}</div>
                </div>
                {settings.instagramUrl && (
                    <div data-reveal="60">
                        <div className="mb-2 font-mono text-[11px] uppercase tracking-[0.08em] text-[rgba(27,28,26,0.45)]">{labels.instagram}</div>
                        <a
                            href={settings.instagramUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-base font-medium transition hover:text-[rgb(31,122,70)]"
                        >
                            {labels.instagram} ↗
                        </a>
                    </div>
                )}
                <div data-reveal="120">
                    <WhatsAppButton
                        source="/kontak-footer"
                        className="inline-flex w-full max-w-sm items-center justify-center rounded-full border border-[rgba(27,28,26,0.3)] px-7 py-3.5 text-sm font-semibold uppercase tracking-[0.06em] transition hover:bg-[rgb(27,28,26)] hover:text-[rgb(243,243,240)] sm:w-auto sm:max-w-none"
                    >
                        {content.ctaLabel}
                    </WhatsAppButton>
                </div>
            </section>
        </main>
    );
}

Kontak.layout = (page) => <SiteLayout>{page}</SiteLayout>;
