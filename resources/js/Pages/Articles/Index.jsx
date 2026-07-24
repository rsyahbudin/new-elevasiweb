import { useRef } from 'react';
import { Link } from '@inertiajs/react';
import SiteLayout from '../../Layouts/SiteLayout';
import Placeholder from '../../Components/Placeholder';
import OptimizedImage from '../../Components/OptimizedImage';
import Seo from '../../Components/Seo';
import { useScrollReveal } from '../../hooks/useScrollReveal';

export default function ArticlesIndex({ articles, meta, labels }) {
    const containerRef = useRef(null);

    const articleSignature = (articles.data ?? []).map((article) => article.slug).join('|');

    useScrollReveal(containerRef, [articles.current_page, articleSignature]);

    const pageLinks = (articles.links ?? []).filter(
        (link) => link.url !== null && !link.label.includes('Previous') && !link.label.includes('Next'),
    );

    return (
        <main className="px-5 pb-10 pt-36 md:px-10 md:pt-[170px]" ref={containerRef}>
            <Seo
                title={labels.pageTitle}
                description={
                    labels.pageDescription ||
                    (labels.heading && labels.headingAccent
                        ? `${labels.heading} ${labels.headingAccent} — Elevasi Design & Build.`
                        : undefined)
                }
            />

            <div className="flex flex-wrap items-end justify-between gap-4 border-b border-[rgba(27,28,26,0.12)] pb-8" data-reveal="0">
                <h1 className="m-0 max-w-[12ch] text-[clamp(56px,8vw,132px)] font-semibold uppercase leading-[0.95] tracking-[-0.035em]">
                    {labels.heading} <span className="serif-italic">{labels.headingAccent}</span>
                </h1>
                <span className="font-mono text-[13px] text-[rgba(27,28,26,0.5)]">( {String(meta.total).padStart(2, '0')} )</span>
            </div>

            <div className="grid grid-cols-1 gap-8 py-10 md:grid-cols-2 md:gap-[26px] md:py-12 lg:grid-cols-3">
                {articles.data.map((article, i) => (
                    <Link
                        key={article.slug}
                        href={route('articles.show', article.slug)}
                        className="group block"
                        data-reveal={(i % 3) * 80}
                    >
                        <div className="overflow-hidden rounded-[2px]">
                            {article.coverImage ? (
                                <OptimizedImage
                                    src={article.coverImage}
                                    srcSet={article.coverSrcSet}
                                    sizes="(min-width: 1024px) 33vw, (min-width: 768px) 50vw, 100vw"
                                    alt={article.title}
                                    className="aspect-[4/3] img-zoom-on-hover h-full w-full object-cover"
                                    loading={i < 3 ? 'eager' : 'lazy'}
                                />
                            ) : (
                                <Placeholder
                                    caption={article.title}
                                    parallax={0.05}
                                    className="aspect-[4/3] transition duration-500 group-hover:scale-[1.015]"
                                    size="xs"
                                />
                            )}
                        </div>
                        <div className="flex items-baseline justify-between px-0.5 pb-0 pt-3.5">
                            <span className="text-[17px] font-semibold transition group-hover:text-[rgb(31,122,70)]">{article.title}</span>
                            {article.publishedAt && (
                                <span className="font-mono text-[11px] uppercase text-[rgba(27,28,26,0.5)]">{article.publishedAt}</span>
                            )}
                        </div>
                        {article.excerpt && (
                            <p className="px-0.5 pt-2 text-[15px] leading-relaxed text-[rgba(27,28,26,0.65)] [text-wrap:pretty]">
                                {article.excerpt}
                            </p>
                        )}
                    </Link>
                ))}
            </div>

            {articles.data.length === 0 && (
                <p className="py-20 text-center text-[rgba(27,28,26,0.5)]" data-reveal="0">
                    {labels.empty}
                </p>
            )}

            {articles.last_page > 1 && (
                <nav className="flex items-center justify-center gap-2 pb-14 pt-16 font-mono text-[13px]" data-reveal="0" aria-label="Pagination">
                    {articles.prev_page_url ? (
                        <Link
                            href={articles.prev_page_url}
                            className="pr-2 text-[rgba(27,28,26,0.6)] transition hover:text-[rgb(31,122,70)]"
                            aria-label="Previous page"
                        >
                            ←
                        </Link>
                    ) : (
                        <span className="pr-2 text-[rgba(27,28,26,0.2)]" aria-hidden="true">
                            ←
                        </span>
                    )}
                    {pageLinks.map((link) => (
                        <Link
                            key={link.label}
                            href={link.url}
                            aria-current={link.active ? 'page' : undefined}
                            className={`h-[38px] w-[38px] rounded-full border text-center leading-[38px] transition ${
                                link.active
                                    ? 'border-[rgb(27,28,26)] bg-[rgb(27,28,26)] text-[rgb(243,243,240)]'
                                    : 'border-[rgba(27,28,26,0.2)] text-[rgba(27,28,26,0.6)] hover:border-[rgba(27,28,26,0.5)]'
                            }`}
                            preserveScroll={false}
                            dangerouslySetInnerHTML={{ __html: link.label }}
                        />
                    ))}
                    {articles.next_page_url ? (
                        <Link
                            href={articles.next_page_url}
                            className="pl-2 text-[rgba(27,28,26,0.6)] transition hover:text-[rgb(31,122,70)]"
                            aria-label="Next page"
                        >
                            →
                        </Link>
                    ) : (
                        <span className="pl-2 text-[rgba(27,28,26,0.2)]" aria-hidden="true">
                            →
                        </span>
                    )}
                </nav>
            )}
        </main>
    );
}

ArticlesIndex.layout = (page) => <SiteLayout>{page}</SiteLayout>;
