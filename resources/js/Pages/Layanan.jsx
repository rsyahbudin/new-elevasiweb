import { useRef } from 'react';
import { Head, Link, usePage } from '@inertiajs/react';
import SiteLayout from '../Layouts/SiteLayout';
import { useScrollReveal } from '../hooks/useScrollReveal';

export default function Layanan({ services }) {
    const { props } = usePage();
    const { t } = props;
    const containerRef = useRef(null);

    useScrollReveal(containerRef);

    return (
        <main className="px-5 pb-10 pt-36 md:px-10 md:pt-[170px]" ref={containerRef}>
            <Head title={t.nav.services} />

            <div className="mb-14 border-b border-[rgba(27,28,26,0.12)] pb-8" data-reveal="0">
                <span className="mono-label">( {t.layanan.eyebrow} )</span>
                <h1 className="m-0 mt-5 max-w-[12ch] text-[clamp(56px,8vw,120px)] font-semibold uppercase leading-[0.95] tracking-[-0.035em]">
                    {t.layanan.heading}
                </h1>
            </div>

            <div className="flex flex-col">
                {services.map((service, i) => (
                    <div
                        key={service.number}
                        className="group grid cursor-default grid-cols-[48px_1fr] gap-4 border-t border-[rgba(27,28,26,0.12)] px-2 py-7 transition hover:bg-[rgb(236,236,232)] md:grid-cols-[80px_1fr] md:gap-6 md:py-9"
                        data-reveal={i * 70}
                    >
                        <span className="font-mono text-[13px] text-[rgb(31,122,70)]">{service.number}</span>
                        <div>
                            <h3 className="mb-3 text-[clamp(22px,2.5vw,36px)] font-semibold uppercase tracking-[-0.02em] transition group-hover:translate-x-1">
                                {service.name}
                            </h3>
                            <p className="m-0 max-w-[560px] text-[15px] leading-[1.65] text-[rgba(27,28,26,0.6)]">{service.detail}</p>
                        </div>
                    </div>
                ))}
            </div>

            <div className="mt-16 text-center md:mt-20" data-reveal="0">
                <Link
                    href={route('kontak')}
                    className="inline-block rounded-full border border-[rgba(27,28,26,0.3)] px-8 py-4 text-sm font-semibold uppercase tracking-[0.08em] transition hover:bg-[rgb(27,28,26)] hover:text-[rgb(243,243,240)]"
                >
                    {t.nav.contact} →
                </Link>
            </div>
        </main>
    );
}

Layanan.layout = (page) => <SiteLayout>{page}</SiteLayout>;
