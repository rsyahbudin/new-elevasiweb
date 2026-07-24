import { useMemo, useRef, useState } from 'react';
import SiteLayout from '../../Layouts/SiteLayout';
import Placeholder from '../../Components/Placeholder';
import OptimizedImage from '../../Components/OptimizedImage';
import ImageLightbox from '../../Components/ImageLightbox';
import Seo from '../../Components/Seo';
import { useScrollReveal } from '../../hooks/useScrollReveal';

export default function GalleryIndex({ items, meta, labels }) {
    const containerRef = useRef(null);
    const [lightboxIndex, setLightboxIndex] = useState(null);

    const itemSignature = items.map((item) => item.id).join('|');

    useScrollReveal(containerRef, [itemSignature]);

    const lightboxImages = useMemo(
        () =>
            items.map((item) => ({
                url: item.url,
                srcSet: item.srcSet,
                fullUrl: item.fullUrl || item.url,
                label: item.label,
            })),
        [items],
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

            <div className="grid grid-cols-1 gap-6 py-10 md:grid-cols-2 md:gap-[26px] md:py-12">
                {items.map((item, i) => (
                    <div
                        key={item.id}
                        className="gallery-scroll-item group overflow-hidden rounded-[2px]"
                        data-reveal={(i % 2) * 90}
                        style={{ gridColumn: i === 0 ? '1 / -1' : 'auto' }}
                    >
                        {item.url ? (
                            <button
                                type="button"
                                className="block w-full cursor-zoom-in touch-manipulation text-left active:opacity-90"
                                onClick={() => setLightboxIndex(i)}
                                aria-label={`View ${item.label}`}
                            >
                                <OptimizedImage
                                    src={item.url}
                                    srcSet={item.srcSet}
                                    sizes={i === 0 ? '100vw' : '(min-width: 768px) 50vw, 100vw'}
                                    alt={item.label}
                                    className="img-zoom-on-hover aspect-[var(--ratio)] h-full w-full object-cover"
                                    style={{ '--ratio': i === 0 ? '16 / 8' : '4 / 3' }}
                                    loading={i < 2 ? 'eager' : 'lazy'}
                                />
                            </button>
                        ) : (
                            <Placeholder
                                caption={item.label}
                                parallax={0.06}
                                className="aspect-[var(--ratio)] transition duration-500 group-hover:scale-[1.015]"
                                style={{ '--ratio': i === 0 ? '16 / 8' : '4 / 3' }}
                            />
                        )}
                        {item.label && (
                            <div className="px-0.5 pt-3 font-mono text-[11px] uppercase tracking-[0.06em] text-[rgba(27,28,26,0.5)]">
                                {item.label}
                            </div>
                        )}
                    </div>
                ))}
            </div>

            {items.length === 0 && (
                <p className="py-20 text-center text-[rgba(27,28,26,0.5)]" data-reveal="0">
                    {labels.empty}
                </p>
            )}

            <ImageLightbox
                images={lightboxImages}
                index={lightboxIndex}
                onClose={() => setLightboxIndex(null)}
                onNavigate={setLightboxIndex}
            />
        </main>
    );
}

GalleryIndex.layout = (page) => <SiteLayout>{page}</SiteLayout>;
