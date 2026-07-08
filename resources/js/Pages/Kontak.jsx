import { useRef } from 'react';
import { Head, useForm, usePage } from '@inertiajs/react';
import SiteLayout from '../Layouts/SiteLayout';
import { useScrollReveal } from '../hooks/useScrollReveal';

export default function Kontak({ settings }) {
    const { props } = usePage();
    const { t } = props;
    const containerRef = useRef(null);
    useScrollReveal(containerRef);

    const { data, setData, post, processing, errors, wasSuccessful, reset } = useForm({
        name: '',
        contact: '',
        message: '',
        company: '', // honeypot — left blank by humans, filled by bots
    });

    const submit = (e) => {
        e.preventDefault();
        post(route('kontak.store'), {
            preserveScroll: true,
            onSuccess: () => reset('name', 'contact', 'message'),
        });
    };

    return (
        <main className="px-5 pb-10 pt-36 md:px-10 md:pt-[170px]" ref={containerRef}>
            <Head title={t.nav.contact} />

            <div className="mb-14 border-b border-[rgba(27,28,26,0.12)] pb-8" data-reveal="0">
                <span className="mono-label">( {t.kontak.eyebrow} )</span>
                <h1 className="m-0 mt-5 text-[clamp(56px,8vw,120px)] font-semibold uppercase leading-[0.95] tracking-[-0.035em]">{t.kontak.heading}</h1>
            </div>

            <div className="grid grid-cols-1 gap-10 md:grid-cols-2 md:gap-[60px]">
                <div data-reveal="0">
                    <div className="mb-8">
                        <div className="mb-2 font-mono text-[11px] uppercase tracking-[0.08em] text-[rgba(27,28,26,0.45)]">WhatsApp</div>
                        <div className="text-base font-medium">
                            <a href={settings.whatsappUrl} target="_blank" rel="noopener noreferrer">
                                {settings.whatsappDisplay}
                            </a>
                        </div>
                    </div>
                    <div className="mb-8">
                        <div className="mb-2 font-mono text-[11px] uppercase tracking-[0.08em] text-[rgba(27,28,26,0.45)]">Email</div>
                        <div className="text-base font-medium">
                            <a href={`mailto:${settings.email}`}>{settings.email}</a>
                        </div>
                    </div>
                    <div className="mb-8">
                        <div className="mb-2 font-mono text-[11px] uppercase tracking-[0.08em] text-[rgba(27,28,26,0.45)]">{t.kontak.address}</div>
                        <div className="text-base font-medium">{settings.address}</div>
                    </div>
                </div>

                <form onSubmit={submit} data-reveal="100">
                    <div className="absolute left-[-9999px] h-px w-px overflow-hidden" aria-hidden="true">
                        <label htmlFor="company">Company</label>
                        <input
                            type="text"
                            id="company"
                            name="company"
                            tabIndex={-1}
                            autoComplete="off"
                            value={data.company}
                            onChange={(e) => setData('company', e.target.value)}
                        />
                    </div>

                    <div className="mb-5">
                        <label htmlFor="name" className="mb-2 block text-xs uppercase tracking-[0.06em] text-[rgba(27,28,26,0.55)]">{t.kontak.name}</label>
                        <input
                            type="text"
                            id="name"
                            className="w-full rounded border border-[rgba(27,28,26,0.2)] bg-transparent px-4 py-3.5 text-[15px] focus:border-[rgb(31,122,70)] focus:outline-none"
                            value={data.name}
                            onChange={(e) => setData('name', e.target.value)}
                            required
                        />
                        {errors.name && <div className="mt-1.5 text-[13px] text-[#b3261e]">{errors.name}</div>}
                    </div>

                    <div className="mb-5">
                        <label htmlFor="contact" className="mb-2 block text-xs uppercase tracking-[0.06em] text-[rgba(27,28,26,0.55)]">{t.kontak.contactField}</label>
                        <input
                            type="text"
                            id="contact"
                            className="w-full rounded border border-[rgba(27,28,26,0.2)] bg-transparent px-4 py-3.5 text-[15px] focus:border-[rgb(31,122,70)] focus:outline-none"
                            value={data.contact}
                            onChange={(e) => setData('contact', e.target.value)}
                            required
                        />
                        {errors.contact && <div className="mt-1.5 text-[13px] text-[#b3261e]">{errors.contact}</div>}
                    </div>

                    <div className="mb-5">
                        <label htmlFor="message" className="mb-2 block text-xs uppercase tracking-[0.06em] text-[rgba(27,28,26,0.55)]">{t.kontak.message}</label>
                        <textarea
                            id="message"
                            className="w-full rounded border border-[rgba(27,28,26,0.2)] bg-transparent px-4 py-3.5 text-[15px] focus:border-[rgb(31,122,70)] focus:outline-none"
                            rows={5}
                            value={data.message}
                            onChange={(e) => setData('message', e.target.value)}
                            required
                        />
                        {errors.message && <div className="mt-1.5 text-[13px] text-[#b3261e]">{errors.message}</div>}
                    </div>

                    <button type="submit" className="rounded-full bg-[rgb(27,28,26)] px-9 py-4 text-sm font-semibold uppercase tracking-[0.06em] text-[rgb(243,243,240)] transition hover:bg-[rgb(31,122,70)] disabled:cursor-not-allowed disabled:opacity-50" disabled={processing}>
                        {t.kontak.submit}
                    </button>

                    {wasSuccessful && <div className="mt-4 text-[15px] text-[rgb(31,122,70)]">{t.kontak.success}</div>}
                </form>
            </div>
        </main>
    );
}

Kontak.layout = (page) => <SiteLayout>{page}</SiteLayout>;
