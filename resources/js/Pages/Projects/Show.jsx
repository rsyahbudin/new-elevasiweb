import { useRef } from 'react';
import { Head, Link, usePage } from '@inertiajs/react';
import SiteLayout from '../../Layouts/SiteLayout';
import Placeholder from '../../Components/Placeholder';
import { useScrollReveal } from '../../hooks/useScrollReveal';
import { useParallax } from '../../hooks/useParallax';

export default function ProjectShow({ project, gallery, next }) {
    const { props } = usePage();
    const { t } = props;
    const containerRef = useRef(null);

    useScrollReveal(containerRef);
    useParallax(containerRef);

    return (
        <main className="px-5 pb-10 pt-36 md:px-10 md:pt-[170px]" ref={containerRef}>
            <Head title={project.title} />

            <Link href={route('projects.index')} className="font-mono text-xs uppercase tracking-[0.08em] text-[rgba(27,28,26,0.55)]" data-reveal="0">
                ← {t.detail.allProjects}
            </Link>

            <h1 className="mb-8 mt-7 max-w-[1200px] text-[clamp(52px,7.5vw,124px)] font-semibold uppercase leading-[0.98] tracking-[-0.035em] md:mb-10" data-reveal="80">
                {project.title}
            </h1>

            <div className="mb-10 grid grid-cols-2 gap-4 border-y border-[rgba(27,28,26,0.12)] py-6 md:grid-cols-4 md:gap-6" data-reveal="160">
                <div>
                    <div className="mb-2 font-mono text-[11px] uppercase tracking-[0.08em] text-[rgba(27,28,26,0.45)]">{t.detail.category}</div>
                    <div className="text-[15px] font-medium">{project.category}</div>
                </div>
                <div>
                    <div className="mb-2 font-mono text-[11px] uppercase tracking-[0.08em] text-[rgba(27,28,26,0.45)]">{t.detail.location}</div>
                    <div className="text-[15px] font-medium">{project.location}</div>
                </div>
                <div>
                    <div className="mb-2 font-mono text-[11px] uppercase tracking-[0.08em] text-[rgba(27,28,26,0.45)]">{t.detail.yearCompleted}</div>
                    <div className="text-[15px] font-medium">{project.year}</div>
                </div>
                <div>
                    <div className="mb-2 font-mono text-[11px] uppercase tracking-[0.08em] text-[rgba(27,28,26,0.45)]">{t.detail.scope}</div>
                    <div className="text-[15px] font-medium">{project.scope}</div>
                </div>
            </div>

            <Placeholder
                caption={`cover — ${project.coverCaption}`}
                parallax={0.12}
                className="mb-6 h-[56vh] md:mb-7 md:h-[74vh]"
                data-reveal="0"
            />

            <div className="grid grid-cols-1 gap-8 py-10 md:grid-cols-[1fr_1.4fr] md:gap-[60px] md:py-[50px]">
                <div className="mono-label" data-reveal="0">
                    ( {t.detail.aboutProject} )
                </div>
                <div className="max-w-[640px] text-lg leading-[1.65] text-[rgba(27,28,26,0.8)] md:text-[19px]" data-reveal="100">
                    <p className="mb-5">{project.description1}</p>
                    <p>{project.description2}</p>
                </div>
            </div>

            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 md:gap-[26px]">
                {gallery.map((g, i) => (
                    <Placeholder
                        key={g.label}
                        caption={g.label}
                        parallax={0.06}
                        data-reveal={(i % 2) * 90}
                        className="aspect-[var(--ratio)] [grid-column:var(--span)]"
                        style={{ '--ratio': i === 0 ? '16 / 8' : '4 / 3', '--span': i === 0 ? '1 / -1' : 'auto' }}
                    />
                ))}
            </div>

            {next && (
                <Link href={route('projects.show', next.slug)} className="block py-20 text-center md:py-[120px]" data-reveal="0">
                    <div className="mono-label mb-4">( {t.detail.nextProject} )</div>
                    <div className="text-[clamp(44px,6vw,96px)] font-semibold uppercase tracking-[-0.03em] transition hover:text-[rgb(31,122,70)]">{next.title} →</div>
                </Link>
            )}
        </main>
    );
}

ProjectShow.layout = (page) => <SiteLayout>{page}</SiteLayout>;
