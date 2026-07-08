import { useEffect, useState } from 'react';
import { Link, usePage } from '@inertiajs/react';
import logo from '../../images/elevasi-logo.gif';

export default function SiteLayout({ children }) {
    const { props } = usePage();
    const { t, locale, altLocaleUrl, settings, url } = props;
    const [isMobileNavOpen, setIsMobileNavOpen] = useState(false);

    const isProjectsArea = url.startsWith('/proyek') || url.startsWith('/en/projects');
    const closeMobileNav = () => setIsMobileNavOpen(false);
    const homeUrl = locale === 'en' ? '/en' : '/';
    const goHome = () => {
        closeMobileNav();
        window.location.assign(homeUrl);
    };

    useEffect(() => {
        setIsMobileNavOpen(false);
    }, [url]);

    return (
        <>
            <header className="fixed inset-x-0 top-0 z-50 flex items-center justify-between border-b border-[rgba(27,28,26,0.08)] bg-[rgba(243,243,240,0.85)] px-4 py-3 backdrop-blur-md md:px-10 md:py-4">
                <button
                    type="button"
                    onClick={goHome}
                    className="flex shrink-0 items-center bg-transparent p-0 border-0 cursor-pointer"
                    aria-label="Go to home page"
                >
                    <img
                        src={logo}
                        alt="Elevasi Design & Build"
                        className="h-14 w-auto md:h-20 lg:h-24"
                    />
                </button>

                <button
                    type="button"
                    className="relative z-[60] inline-flex h-10 w-10 flex-col items-center justify-center gap-1 rounded-full border border-[rgba(27,28,26,0.2)] md:hidden"
                    aria-expanded={isMobileNavOpen}
                    aria-controls="site-nav"
                    onClick={() => setIsMobileNavOpen((open) => !open)}
                >
                    <span className={`block h-0.5 w-4 bg-[rgb(27,28,26)] transition ${isMobileNavOpen ? 'translate-y-1.5 rotate-45' : ''}`} />
                    <span className={`block h-0.5 w-4 bg-[rgb(27,28,26)] transition ${isMobileNavOpen ? 'opacity-0' : ''}`} />
                    <span className={`block h-0.5 w-4 bg-[rgb(27,28,26)] transition ${isMobileNavOpen ? '-translate-y-1.5 -rotate-45' : ''}`} />
                    <span className="sr-only">Toggle navigation menu</span>
                </button>

                <nav
                    id="site-nav"
                    className={`absolute left-0 right-0 top-full border-b border-[rgba(27,28,26,0.08)] bg-[rgb(243,243,240)] px-4 py-4 shadow-sm transition md:static md:flex md:items-center md:gap-8 md:border-0 md:bg-transparent md:px-0 md:py-0 md:shadow-none ${
                        isMobileNavOpen ? 'block' : 'hidden md:flex'
                    }`}
                >
                    <Link
                        href={route('projects.index')}
                        className={`block border-b border-transparent py-2 text-xs font-medium uppercase tracking-[0.06em] md:inline md:py-0 ${isProjectsArea ? 'text-[rgb(31,122,70)] md:border-[rgb(31,122,70)]' : ''}`}
                        onClick={closeMobileNav}
                    >
                        {t.nav.work}
                    </Link>
                    <Link
                        href={route('tentang')}
                        onClick={closeMobileNav}
                        className="block py-2 text-xs font-medium uppercase tracking-[0.06em] md:inline md:py-0"
                    >
                        {t.nav.studio}
                    </Link>
                    <Link
                        href={route('layanan')}
                        onClick={closeMobileNav}
                        className="block py-2 text-xs font-medium uppercase tracking-[0.06em] md:inline md:py-0"
                    >
                        {t.nav.services}
                    </Link>
                    <Link
                        href={route('kontak')}
                        onClick={closeMobileNav}
                        className="block py-2 text-xs font-medium uppercase tracking-[0.06em] md:inline md:py-0"
                    >
                        {t.nav.contact}
                    </Link>

                    <span className="mt-2 inline-flex gap-0.5 rounded-full border border-[rgba(27,28,26,0.15)] p-0.5 text-xs text-[rgba(27,28,26,0.4)] md:mt-0">
                        <a
                            href={locale === 'en' ? url : altLocaleUrl}
                            className={`inline-block rounded-full px-2.5 py-1 ${locale === 'en' ? 'bg-[rgb(27,28,26)] text-[rgb(243,243,240)]' : ''}`}
                            onClick={closeMobileNav}
                        >
                            EN
                        </a>
                        <a
                            href={locale === 'id' ? url : altLocaleUrl}
                            className={`inline-block rounded-full px-2.5 py-1 ${locale === 'id' ? 'bg-[rgb(27,28,26)] text-[rgb(243,243,240)]' : ''}`}
                            onClick={closeMobileNav}
                        >
                            ID
                        </a>
                    </span>

                    <a
                        href={settings.whatsappUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="mt-3 inline-block rounded-full bg-[rgb(31,122,70)] px-5 py-2.5 text-xs uppercase tracking-[0.04em] text-[rgb(243,243,240)] transition hover:bg-[rgb(27,28,26)] md:mt-0 md:ml-2"
                    >
                        {t.nav.cta} ↗
                    </a>
                </nav>
            </header>

            {children}

            <footer className="mt-10 rounded-t-3xl bg-[rgb(27,28,26)] px-5 pb-9 pt-20 text-[rgb(243,243,240)] md:px-10 md:pb-9 md:pt-[110px]">
                <div className="pb-20 text-center md:pb-[100px]">
                    <div className="mb-7 font-mono text-xs uppercase tracking-[0.08em] text-[rgba(243,243,240,0.45)]">( {t.footer.eyebrow} )</div>
                    <div className="text-[clamp(42px,7vw,120px)] font-semibold uppercase leading-[1] tracking-[-0.035em]">
                        {t.footer.titleLine1}
                        <br />
                        <span className="serif-italic">{t.footer.titleLine2}</span>
                    </div>
                    <div className="mt-10 flex flex-wrap justify-center gap-3.5 md:mt-12">
                        <a
                            href={settings.whatsappUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="whitespace-nowrap rounded-full bg-[rgb(31,122,70)] px-8 py-4 text-sm font-semibold uppercase tracking-[0.06em] transition hover:bg-[rgb(243,243,240)] hover:text-[rgb(27,28,26)]"
                        >
                            {t.footer.whatsapp} ↗
                        </a>
                    </div>
                </div>

                <div className="flex flex-wrap items-center justify-between gap-3 border-t border-[rgba(243,243,240,0.15)] pt-7 text-xs uppercase tracking-[0.06em] text-[rgba(243,243,240,0.5)]">
                    <span className="text-sm font-bold tracking-[0.02em] text-[rgb(243,243,240)]">
                        ELEVASI <span>Design &amp; Build</span>
                    </span>
                    <span className="flex gap-6">
                        <a href={settings.instagramUrl} target="_blank" rel="noopener noreferrer" className="text-[rgba(243,243,240,0.6)] transition hover:text-[rgb(243,243,240)]">Instagram</a>
                        <a href={settings.linkedinUrl} target="_blank" rel="noopener noreferrer" className="text-[rgba(243,243,240,0.6)] transition hover:text-[rgb(243,243,240)]">LinkedIn</a>
                        <a href={settings.whatsappUrl} target="_blank" rel="noopener noreferrer" className="text-[rgba(243,243,240,0.6)] transition hover:text-[rgb(243,243,240)]">WhatsApp</a>
                    </span>
                    <span>{t.footer.copyright}</span>
                </div>
            </footer>
        </>
    );
}
