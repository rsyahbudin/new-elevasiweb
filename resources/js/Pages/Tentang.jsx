import { useRef } from 'react';
import SiteLayout from '../Layouts/SiteLayout';
import ProcessSteps from '../Components/ProcessSteps';
import Seo from '../Components/Seo';
import { useCountUp } from '../hooks/useCountUp';
import { useScrollReveal } from '../hooks/useScrollReveal';

function parseStatValue(value) {
    const text = String(value ?? '');
    const match = text.match(/^(\d+)/);

    if (!match) {
        return { numeric: null, suffix: text, display: text };
    }

    return {
        numeric: Number.parseInt(match[1], 10),
        suffix: text.slice(match[1].length),
        display: text,
    };
}

function StatItem({ value, label }) {
    const parsed = parseStatValue(value);
    const shouldAnimate = parsed.numeric !== null && parsed.numeric <= 100;
    const { ref, value: count } = useCountUp(parsed.numeric ?? 0, { enabled: shouldAnimate });

    return (
        <div ref={ref} className="border-t border-[rgba(27,28,26,0.12)] px-2 py-8 md:py-10">
            <div className="text-[clamp(40px,6vw,72px)] font-semibold leading-none tracking-[-0.03em]">
                {shouldAnimate ? `${count}${parsed.suffix}` : parsed.display}
            </div>
            <div className="mt-3 font-mono text-[11px] uppercase tracking-[0.08em] text-[rgba(27,28,26,0.45)]">
                {label}
            </div>
        </div>
    );
}

export default function Tentang({ content }) {
    const containerRef = useRef(null);

    useScrollReveal(containerRef);

    const labels = content.labels ?? {};
    const stats = content.stats ?? [];
    const process = content.process ?? [];
    const values = content.values ?? [];

    return (
        <main className="px-5 pb-16 pt-36 md:px-10 md:pb-24 md:pt-[170px]" ref={containerRef}>
            <Seo
                title={content.title}
                description={content.manifesto || undefined}
            />

            <div className="mb-14 border-b border-[rgba(27,28,26,0.12)] pb-8" data-reveal="0">
                <span className="mono-label">( {labels.eyebrow} )</span>
                <h1 className="m-0 mt-5 max-w-[12ch] text-[clamp(56px,8vw,120px)] font-semibold uppercase leading-[0.95] tracking-[-0.035em]">
                    {content.title}
                </h1>
                {content.manifesto && (
                    <p className="mt-8 max-w-[720px] text-[clamp(22px,3vw,36px)] leading-[1.35] tracking-[-0.02em] text-[rgba(27,28,26,0.8)] [text-wrap:balance]">
                        <span className="serif-italic">{content.manifesto}</span>
                    </p>
                )}
            </div>

            <div className="max-w-[720px] text-[17px] leading-[1.7] text-[rgba(27,28,26,0.75)] [text-wrap:pretty] md:text-lg" data-reveal="100">
                {(content.body ?? []).map((paragraph, i) => (
                    <p key={i} className="mb-6 last:mb-0" data-reveal={100 + i * 60}>
                        {paragraph}
                    </p>
                ))}
            </div>

            {stats.length > 0 && (
                <section className="mt-16 md:mt-24" data-reveal="0">
                    <div className="grid grid-cols-2 gap-x-8 md:grid-cols-4">
                        {stats.map((stat, index) => (
                            <StatItem
                                key={`${stat.label ?? 'stat'}-${index}`}
                                value={stat.value}
                                label={stat.label}
                            />
                        ))}
                    </div>
                </section>
            )}

            {process.length > 0 && (
                <section className="mt-20 md:mt-28">
                    <div className="mb-10 grid gap-6 md:mb-14 md:grid-cols-[minmax(0,280px)_1fr] md:items-end md:gap-12" data-reveal="0">
                        <span className="mono-label">( {labels.process} )</span>
                        {content.processIntro && (
                            <p className="max-w-[52ch] text-[16px] leading-[1.65] text-[rgba(27,28,26,0.62)] md:text-[17px]">
                                {content.processIntro}
                            </p>
                        )}
                    </div>
                    <ProcessSteps steps={process} />
                </section>
            )}

            {values.length > 0 && (
                <section className="mt-20 md:mt-28">
                    <div className="mb-10 md:mb-14" data-reveal="0">
                        <span className="mono-label">( {labels.values} )</span>
                    </div>
                    <div className="divide-y divide-[rgba(27,28,26,0.12)] border-y border-[rgba(27,28,26,0.12)]">
                        {values.map((value, i) => (
                            <article
                                key={value.title}
                                className="grid gap-3 py-8 md:grid-cols-[minmax(0,34%)_1fr] md:items-start md:gap-x-12 md:gap-y-4 md:py-10"
                                data-reveal={i * 70}
                            >
                                <h3 className="max-w-[12ch] text-[clamp(26px,3.4vw,40px)] font-semibold uppercase leading-[1.05] tracking-[-0.03em] text-[rgb(31,122,70)] [text-wrap:balance]">
                                    {value.title}
                                </h3>
                                <p className="max-w-[52ch] text-[15px] leading-[1.7] text-[rgba(27,28,26,0.62)] md:pt-1 md:text-[16px]">
                                    {value.description}
                                </p>
                            </article>
                        ))}
                    </div>
                </section>
            )}
        </main>
    );
}

Tentang.layout = (page) => <SiteLayout>{page}</SiteLayout>;
