import { useRef } from 'react';
import { Head, Link, router, usePage } from '@inertiajs/react';
import SiteLayout from '../../Layouts/SiteLayout';
import Placeholder from '../../Components/Placeholder';
import { useScrollReveal } from '../../hooks/useScrollReveal';
import { useParallax } from '../../hooks/useParallax';

export default function ProjectsIndex({ projects, filters, activeCategory, meta }) {
    const { props } = usePage();
    const { t } = props;
    const containerRef = useRef(null);

    useScrollReveal(containerRef);
    useParallax(containerRef);

    const pickFilter = (slug) => {
        router.get(route('projects.index'), slug ? { category: slug } : {}, {
            preserveState: true,
            preserveScroll: false,
        });
    };

    return (
        <main className="px-5 pb-10 pt-36 md:px-10 md:pt-[170px]" ref={containerRef}>
            <Head title={t.meta.projectsTitle} />

            <div className="flex flex-wrap items-end justify-between gap-4 border-b border-[rgba(27,28,26,0.12)] pb-8" data-reveal="0">
                <h1 className="m-0 text-[clamp(56px,8vw,132px)] font-semibold uppercase leading-[0.95] tracking-[-0.035em]">
                    {t.projectsIndex.heading} <span className="serif-italic">{t.projectsIndex.headingAccent}</span>
                </h1>
                <span className="font-mono text-[13px] text-[rgba(27,28,26,0.5)]">( {String(meta.total).padStart(2, '0')} )</span>
            </div>

            <div className="flex flex-wrap gap-2.5 py-7 pb-12" data-reveal="0">
                <button
                    type="button"
                    className={`inline-block rounded-full border px-5 py-2.5 text-[13px] font-medium uppercase tracking-[0.05em] ${
                        !activeCategory
                            ? 'border-[rgb(27,28,26)] bg-[rgb(27,28,26)] text-[rgb(243,243,240)]'
                            : 'border-[rgba(27,28,26,0.25)]'
                    }`}
                    onClick={() => pickFilter(null)}
                >
                    {t.projectsIndex.all} <span className="font-mono text-[11px] opacity-55">({meta.total})</span>
                </button>
                {filters.map((f) => (
                    <button
                        key={f.slug}
                        type="button"
                        className={`inline-block rounded-full border px-5 py-2.5 text-[13px] font-medium uppercase tracking-[0.05em] ${
                            activeCategory === f.slug
                                ? 'border-[rgb(27,28,26)] bg-[rgb(27,28,26)] text-[rgb(243,243,240)]'
                                : 'border-[rgba(27,28,26,0.25)]'
                        }`}
                        onClick={() => pickFilter(f.slug)}
                    >
                        {f.name} <span className="font-mono text-[11px] opacity-55">({f.count})</span>
                    </button>
                ))}
            </div>

            <div className="grid grid-cols-1 gap-6 md:grid-cols-3 md:gap-[26px]">
                {projects.data.map((project, i) => (
                    <Link
                        key={project.slug}
                        href={route('projects.show', project.slug)}
                        className="block"
                        data-reveal={(i % 3) * 80}
                    >
                        <Placeholder caption={project.caption} parallax={0.05} className="aspect-[4/3]" size="xs" />
                        <div className="flex items-baseline justify-between px-0.5 pb-0 pt-3.5">
                            <span className="text-[17px] font-semibold">{project.title}</span>
                            <span className="font-mono text-[11px] uppercase text-[rgba(27,28,26,0.5)]">{project.year}</span>
                        </div>
                        <div className="px-0.5 pt-1 text-[12.5px] uppercase tracking-[0.04em] text-[rgba(27,28,26,0.5)]">
                            {project.category} — {project.location}
                        </div>
                    </Link>
                ))}
            </div>

            {projects.data.length === 0 && (
                <p style={{ padding: '80px 0', textAlign: 'center', color: 'rgba(27,28,26,0.5)' }}>
                    {t.projectsIndex.empty}
                </p>
            )}

            {projects.last_page > 1 && (
                <nav className="flex items-center justify-center gap-2 pb-14 pt-16 font-mono text-[13px]" data-reveal="0" aria-label="Pagination">
                    {projects.links
                        .filter((link) => link.label !== '&laquo; Previous' && link.label !== 'Next &raquo;')
                        .map((link) => (
                            <Link
                                key={link.label}
                                href={link.url || '#'}
                                className={`h-[38px] w-[38px] rounded-full border text-center leading-[38px] ${
                                    link.active
                                        ? 'border-[rgb(27,28,26)] bg-[rgb(27,28,26)] text-[rgb(243,243,240)]'
                                        : 'border-[rgba(27,28,26,0.2)] text-[rgba(27,28,26,0.6)]'
                                }`}
                                preserveScroll={false}
                                dangerouslySetInnerHTML={{ __html: link.label }}
                            />
                        ))}
                    {projects.next_page_url && (
                        <Link href={projects.next_page_url} className="pl-2 text-[rgba(27,28,26,0.6)]">
                            →
                        </Link>
                    )}
                </nav>
            )}
        </main>
    );
}

ProjectsIndex.layout = (page) => <SiteLayout>{page}</SiteLayout>;
