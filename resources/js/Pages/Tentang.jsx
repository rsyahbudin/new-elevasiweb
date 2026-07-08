import { useRef } from 'react';
import { Head, usePage } from '@inertiajs/react';
import SiteLayout from '../Layouts/SiteLayout';
import { useScrollReveal } from '../hooks/useScrollReveal';

export default function Tentang({ content }) {
    const { props } = usePage();
    const { t } = props;
    const containerRef = useRef(null);

    useScrollReveal(containerRef);

    return (
        <main className="px-5 pb-10 pt-36 md:px-10 md:pt-[170px]" ref={containerRef}>
            <Head title={t.nav.studio} />

            <div className="mb-14 border-b border-[rgba(27,28,26,0.12)] pb-8" data-reveal="0">
                <span className="mono-label">( {t.tentang.eyebrow} )</span>
                <h1 className="m-0 mt-5 text-[clamp(56px,8vw,120px)] font-semibold uppercase leading-[0.95] tracking-[-0.035em]">{content.title}</h1>
            </div>

            <div className="max-w-[720px] text-[17px] leading-[1.7] text-[rgba(27,28,26,0.75)] md:text-lg" data-reveal="100">
                {content.body.map((paragraph, i) => (
                    <p key={i} className="mb-6 last:mb-0">{paragraph}</p>
                ))}
            </div>

            <div className="mt-12 grid grid-cols-1 gap-8 md:mt-[60px] md:grid-cols-2 md:gap-10">
                {content.values.map((value, i) => (
                    <div key={value.title} data-reveal={i * 80}>
                        <h3 className="mb-3 text-[22px] font-semibold uppercase tracking-[-0.01em]">{value.title}</h3>
                        <p className="m-0 text-[15px] leading-[1.6] text-[rgba(27,28,26,0.6)]">{value.description}</p>
                    </div>
                ))}
            </div>
        </main>
    );
}

Tentang.layout = (page) => <SiteLayout>{page}</SiteLayout>;
