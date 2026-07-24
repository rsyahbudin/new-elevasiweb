import { useRef } from 'react';
import { Link } from '@inertiajs/react';
import SiteLayout from '../../Layouts/SiteLayout';
import Placeholder from '../../Components/Placeholder';
import OptimizedImage from '../../Components/OptimizedImage';
import Seo from '../../Components/Seo';
import { useScrollReveal } from '../../hooks/useScrollReveal';

export default function ArticleShow({ article, labels }) {
    const containerRef = useRef(null);

    useScrollReveal(containerRef);

    const seoDescription = (article.excerpt || article.paragraphs?.[0] || '')
        .replace(/\s+/g, ' ')
        .trim()
        .slice(0, 160);

    return (
        <main className="px-5 pb-10 pt-36 md:px-10 md:pt-[170px]" ref={containerRef}>
            <Seo
                title={article.title}
                description={seoDescription || undefined}
                image={article.coverImage || undefined}
                type="article"
                preloadImage={Boolean(article.coverImage)}
            />

            <Link
                href={route('articles.index')}
                className="font-mono text-xs uppercase tracking-[0.08em] text-[rgba(27,28,26,0.55)] transition hover:text-[rgb(31,122,70)]"
                data-reveal="0"
            >
                ← {labels.allArticles}
            </Link>

            <h1 className="mb-6 mt-7 max-w-[14ch] text-[clamp(44px,7vw,112px)] font-semibold uppercase leading-[0.98] tracking-[-0.035em] md:mb-8" data-reveal="80">
                {article.title}
            </h1>

            {article.publishedAt && (
                <div className="mono-label mb-8 border-b border-[rgba(27,28,26,0.12)] pb-6 md:mb-10" data-reveal="120">
                    ( {labels.publishedOn} {article.publishedAt} )
                </div>
            )}

            {article.coverImage && (
                <div className="relative mb-8 overflow-hidden rounded-sm md:mb-10" data-reveal="0" data-reveal-variant="clip">
                    <OptimizedImage
                        src={article.coverImage}
                        srcSet={article.coverSrcSet}
                        sizes="100vw"
                        alt={article.title}
                        className="img-zoom-on-hover-sm h-[48vh] w-full object-cover md:h-[62vh]"
                        loading="eager"
                        fetchPriority="high"
                    />
                    <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[rgba(27,28,26,0.12)] via-transparent to-transparent" />
                </div>
            )}

            {!article.coverImage && (
                <Placeholder
                    caption={article.title}
                    parallax={0.08}
                    className="mb-8 h-[40vh] md:mb-10 md:h-[52vh]"
                    data-reveal="0"
                />
            )}

            <div className="mx-auto max-w-[720px] pb-10 md:pb-16">
                {article.excerpt && (
                    <p
                        className="mb-8 text-[clamp(20px,2.5vw,28px)] leading-[1.4] tracking-[-0.02em] text-[rgba(27,28,26,0.8)] [text-wrap:balance] md:mb-10"
                        data-reveal="100"
                    >
                        <span className="serif-italic">{article.excerpt}</span>
                    </p>
                )}

                <div className="text-[17px] leading-[1.7] text-[rgba(27,28,26,0.75)] [text-wrap:pretty] md:text-lg" data-reveal="160">
                    {article.paragraphs.map((paragraph, i) => (
                        <p key={i} className="mb-6 last:mb-0" data-reveal={160 + i * 60}>
                            {paragraph}
                        </p>
                    ))}
                </div>
            </div>
        </main>
    );
}

ArticleShow.layout = (page) => <SiteLayout>{page}</SiteLayout>;
