import { useMemo, useRef, useState } from 'react';
import { Link } from '@inertiajs/react';
import SiteLayout from '../../Layouts/SiteLayout';
import Placeholder from '../../Components/Placeholder';
import OptimizedImage from '../../Components/OptimizedImage';
import ImageLightbox from '../../Components/ImageLightbox';
import Seo from '../../Components/Seo';
import WhatsAppButton from '../../Components/WhatsAppButton';
import { useScrollReveal } from '../../hooks/useScrollReveal';
import { useParallax } from '../../hooks/useParallax';

export default function ProjectShow({ project, gallery, next, labels }) {
    const containerRef = useRef(null);
    const [lightboxIndex, setLightboxIndex] = useState(null);

    useScrollReveal(containerRef);
    useParallax(containerRef);

    const lightboxImages = useMemo(
        () =>
            [
                project.coverImage
                    ? {
                          url: project.coverImage,
                          srcSet: project.coverSrcSet,
                          fullUrl: project.coverFullUrl || project.coverImage,
                          label: project.coverCaption || project.title,
                      }
                    : null,
                ...gallery.filter((item) => item.url),
            ].filter(Boolean),
        [gallery, project.coverCaption, project.coverFullUrl, project.coverImage, project.coverSrcSet, project.title],
    );

    const metaItems = [
        { label: labels.category, value: project.category },
        project.client ? { label: labels.client, value: project.client } : null,
        { label: labels.location, value: project.location },
        { label: labels.yearCompleted, value: project.year },
        { label: labels.scope, value: project.scope },
        project.area ? { label: labels.area, value: project.area } : null,
    ].filter(Boolean);

    const seoDescription = [project.description1, project.description2]
        .filter(Boolean)
        .join(' ')
        .replace(/\s+/g, ' ')
        .trim()
        .slice(0, 160);

    return (
        <main className="px-5 pb-10 pt-36 md:px-10 md:pt-[170px]" ref={containerRef}>
            <Seo
                title={project.title}
                description={seoDescription || undefined}
                image={project.coverImage || undefined}
                type="article"
                preloadImage={Boolean(project.coverImage)}
            />

            <Link
                href={route('projects.index')}
                className="font-mono text-xs uppercase tracking-[0.08em] text-[rgba(27,28,26,0.55)] transition hover:text-[rgb(31,122,70)]"
                data-reveal="0"
            >
                ← {labels.allProjects}
            </Link>

            <h1 className="mb-8 mt-7 max-w-[12ch] text-[clamp(52px,7.5vw,124px)] font-semibold uppercase leading-[0.98] tracking-[-0.035em] md:mb-10" data-reveal="80">
                {project.title}
            </h1>

            <div
                className={`mb-10 grid grid-cols-2 gap-4 border-y border-[rgba(27,28,26,0.12)] py-6 md:gap-6 ${
                    metaItems.length > 4 ? 'md:grid-cols-3 lg:grid-cols-6' : 'md:grid-cols-4'
                }`}
                data-reveal="160"
            >
                {metaItems.map((item) => (
                    <div key={item.label}>
                        <div className="mb-2 font-mono text-[11px] uppercase tracking-[0.08em] text-[rgba(27,28,26,0.45)]">
                            {item.label}
                        </div>
                        <div className="text-[15px] font-medium">{item.value}</div>
                    </div>
                ))}
            </div>

            <div className="relative mb-6 overflow-hidden rounded-sm md:mb-7" data-reveal="0" data-reveal-variant="clip">
                {project.coverImage ? (
                    <button
                        type="button"
                        className="group block w-full cursor-zoom-in touch-manipulation text-left active:opacity-90"
                        onClick={() => setLightboxIndex(0)}
                        aria-label={`View ${project.coverCaption || project.title}`}
                    >
                        <OptimizedImage
                            src={project.coverImage}
                            srcSet={project.coverSrcSet}
                            sizes="100vw"
                            alt={project.coverCaption || project.title}
                            className="h-[56vh] w-full object-cover transition duration-500 group-hover:scale-[1.01] md:h-[74vh]"
                            loading="eager"
                            fetchPriority="high"
                        />
                    </button>
                ) : (
                    <Placeholder
                        caption={`cover — ${project.coverCaption}`}
                        parallax={0.12}
                        className="h-[56vh] md:h-[74vh]"
                    />
                )}
                <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[rgba(27,28,26,0.12)] via-transparent to-transparent" />
            </div>

            <div className="grid grid-cols-1 gap-8 py-10 md:grid-cols-[1fr_1.4fr] md:gap-[60px] md:py-[50px]">
                <div className="mono-label" data-reveal="0">
                    ( {labels.aboutProject} )
                </div>
                <div className="max-w-[640px] text-lg leading-[1.65] text-[rgba(27,28,26,0.8)] [text-wrap:pretty] md:text-[19px]" data-reveal="100">
                    <p className="mb-5">{project.description1}</p>
                    {project.description2 ? <p className="mb-8">{project.description2}</p> : null}
                    {(labels.ctaLabel || labels.ctaNote) && (
                        <div className="border-t border-[rgba(27,28,26,0.12)] pt-8">
                            {labels.ctaNote ? (
                                <p className="mb-5 text-base leading-relaxed text-[rgba(27,28,26,0.65)] md:text-[17px]">
                                    {labels.ctaNote}
                                </p>
                            ) : null}
                            {labels.ctaLabel ? (
                                <WhatsAppButton
                                    source="project-detail"
                                    className="inline-flex items-center rounded-full border border-[rgb(27,28,26)] bg-[rgb(27,28,26)] px-6 py-3 text-[13px] font-medium uppercase tracking-[0.06em] text-[rgb(243,243,240)] transition hover:bg-[rgb(31,122,70)] hover:border-[rgb(31,122,70)]"
                                >
                                    {labels.ctaLabel}
                                </WhatsAppButton>
                            ) : null}
                        </div>
                    )}
                </div>
            </div>

            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 md:gap-[26px]">
                {gallery.map((g, i) => {
                    const lightboxOffset = project.coverImage ? 1 : 0;

                    return (
                    <div key={g.label} className="group overflow-hidden rounded-[2px]" data-reveal={(i % 2) * 90} style={{ gridColumn: i === 0 ? '1 / -1' : 'auto' }}>
                        {g.url ? (
                            <button
                                type="button"
                                className="block w-full cursor-zoom-in touch-manipulation text-left active:opacity-90"
                                onClick={() => setLightboxIndex(lightboxOffset + i)}
                                aria-label={`View ${g.label}`}
                            >
                                <OptimizedImage
                                    src={g.url}
                                    srcSet={g.srcSet}
                                    sizes={i === 0 ? '100vw' : '(min-width: 768px) 50vw, 100vw'}
                                    alt={g.label}
                                    className="aspect-[var(--ratio)] h-full w-full object-cover transition duration-500 group-hover:scale-[1.015]"
                                    style={{ '--ratio': i === 0 ? '16 / 8' : '4 / 3' }}
                                    loading="lazy"
                                />
                            </button>
                        ) : (
                            <Placeholder
                                caption={g.label}
                                parallax={0.06}
                                className="aspect-[var(--ratio)] transition duration-500 group-hover:scale-[1.015]"
                                style={{ '--ratio': i === 0 ? '16 / 8' : '4 / 3' }}
                            />
                        )}
                    </div>
                    );
                })}
            </div>

            <ImageLightbox
                images={lightboxImages}
                index={lightboxIndex}
                onClose={() => setLightboxIndex(null)}
                onNavigate={setLightboxIndex}
            />

            {next && (
                <Link href={route('projects.show', next.slug)} className="group block py-20 text-center md:py-[120px]" data-reveal="0">
                    <div className="mono-label mb-4">( {labels.nextProject} )</div>
                    <div className="text-[clamp(44px,6vw,96px)] font-semibold uppercase tracking-[-0.03em] transition group-hover:text-[rgb(31,122,70)]">
                        {next.title} <span className="inline-block transition group-hover:translate-x-2">→</span>
                    </div>
                </Link>
            )}
        </main>
    );
}

ProjectShow.layout = (page) => <SiteLayout>{page}</SiteLayout>;
