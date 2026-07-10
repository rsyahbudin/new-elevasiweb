import { useEffect, useState } from 'react';
import { Link, router, usePage } from '@inertiajs/react';
import GoogleAnalytics from '../Components/GoogleAnalytics';
import SplashScreen from '../Components/SplashScreen';
import WhatsAppButton from '../Components/WhatsAppButton';
import { usePageTransition } from '../hooks/usePageTransition';
import { WhatsAppInquiryProvider } from '../contexts/WhatsAppInquiryContext';
import OptimizedImage from '../Components/OptimizedImage';
import logo from '../../images/elevasi-logo.gif';

function NavCta({ cms, className, onClick }) {
    const label = cms.nav.cta;

    const baseClass =
        'inline-flex w-full items-center justify-center rounded-full bg-[rgb(31,122,70)] px-6 py-3.5 text-sm font-semibold uppercase tracking-[0.06em] text-[rgb(243,243,240)] transition hover:bg-[rgb(27,28,26)] md:w-auto md:px-5 md:py-2.5 md:text-xs';

    return (
        <WhatsAppButton className={`${baseClass} ${className ?? ''}`} onClick={onClick} showArrow={false}>
            {label} →
        </WhatsAppButton>
    );
}

export default function SiteLayout({ children }) {
    const { props } = usePage();
    const { locale, altLocaleUrl, settings, cms, url } = props;
    const [isMobileNavOpen, setIsMobileNavOpen] = useState(false);
    const pageRef = usePageTransition();

    const isProjectsArea = url.startsWith('/proyek') || url.startsWith('/id/proyek');
    const isStudioArea = url === '/tentang' || url === '/id/tentang';
    const isContactPage = url === '/kontak' || url === '/id/kontak';
    const closeMobileNav = () => setIsMobileNavOpen(false);
    const homeUrl = locale === 'id' ? '/id' : '/';
    const goHome = () => {
        closeMobileNav();
        router.visit(homeUrl);
    };

    const navLinkClass = (active) =>
        `text-xs font-medium uppercase tracking-[0.08em] transition ${
            active ? 'text-[rgb(31,122,70)]' : 'text-[rgb(27,28,26)] hover:text-[rgb(31,122,70)]'
        }`;

    useEffect(() => {
        setIsMobileNavOpen(false);
    }, [url]);

    useEffect(() => {
        document.body.style.overflow = isMobileNavOpen ? 'hidden' : '';
        return () => {
            document.body.style.overflow = '';
        };
    }, [isMobileNavOpen]);

    return (
        <WhatsAppInquiryProvider copy={cms.inquiry} onOpen={closeMobileNav}>
            <SplashScreen />
            <GoogleAnalytics />
            <header className="pointer-events-none fixed inset-x-0 top-0 z-50 px-3 pt-3 sm:px-4 sm:pt-4 md:px-6 md:pt-5">
                <div className="pointer-events-auto mx-auto flex max-w-5xl items-center gap-2.5 rounded-full border border-[rgba(27,28,26,0.1)] bg-[rgba(243,243,240,0.82)] px-3 py-2.5 shadow-[0_12px_40px_rgba(27,28,26,0.07)] backdrop-blur-xl sm:gap-3 sm:px-3.5 md:gap-6 md:px-5 md:py-2.5">
                    <button
                        type="button"
                        onClick={goHome}
                        className="flex min-w-0 shrink-0 items-center bg-transparent p-0 border-0 cursor-pointer"
                        aria-label="Go to home page"
                    >
                        <OptimizedImage
                            src={logo}
                            alt="Elevasi Design & Build"
                            className="h-12 w-auto sm:h-[52px] md:h-14"
                            loading="eager"
                            fetchPriority="low"
                        />
                    </button>

                    <nav className="hidden flex-1 items-center justify-center gap-7 md:flex">
                        <Link href={route('projects.index')} className={navLinkClass(isProjectsArea)}>
                            {cms.nav.work}
                        </Link>
                        <Link href={route('tentang')} className={navLinkClass(isStudioArea)}>
                            {cms.nav.studio}
                        </Link>
                    </nav>

                    <div className="ml-auto flex shrink-0 items-center gap-1.5 md:gap-3">
                        <span className="hidden gap-0.5 rounded-full border border-[rgba(27,28,26,0.12)] bg-[rgba(255,255,255,0.35)] p-0.5 text-[10px] text-[rgba(27,28,26,0.45)] md:inline-flex">
                            <Link
                                href={locale === 'en' ? url : altLocaleUrl}
                                className={`inline-block rounded-full px-2 py-1 ${locale === 'en' ? 'bg-[rgb(27,28,26)] text-[rgb(243,243,240)]' : ''}`}
                            >
                                EN
                            </Link>
                            <Link
                                href={locale === 'id' ? url : altLocaleUrl}
                                className={`inline-block rounded-full px-2 py-1 ${locale === 'id' ? 'bg-[rgb(27,28,26)] text-[rgb(243,243,240)]' : ''}`}
                            >
                                ID
                            </Link>
                        </span>

                        <div className="hidden md:contents">
                            <NavCta cms={cms} />
                        </div>

                        <button
                            type="button"
                            className="inline-flex h-10 w-10 shrink-0 flex-col items-center justify-center gap-[5px] rounded-full border border-[rgba(27,28,26,0.12)] bg-[rgba(255,255,255,0.45)] md:hidden"
                            aria-expanded={isMobileNavOpen}
                            aria-controls="site-nav"
                            onClick={() => setIsMobileNavOpen((open) => !open)}
                        >
                            <span className={`block h-0.5 w-4 bg-[rgb(27,28,26)] transition duration-200 ${isMobileNavOpen ? 'translate-y-[7px] rotate-45' : ''}`} />
                            <span className={`block h-0.5 w-4 bg-[rgb(27,28,26)] transition duration-200 ${isMobileNavOpen ? 'opacity-0' : ''}`} />
                            <span className={`block h-0.5 w-4 bg-[rgb(27,28,26)] transition duration-200 ${isMobileNavOpen ? '-translate-y-[7px] -rotate-45' : ''}`} />
                            <span className="sr-only">Toggle navigation menu</span>
                        </button>
                    </div>
                </div>
            </header>

            <div
                id="site-nav"
                className={`fixed inset-0 z-40 flex flex-col bg-[rgb(243,243,240)] px-5 pb-8 pt-[100px] transition duration-300 md:hidden ${
                    isMobileNavOpen ? 'pointer-events-auto opacity-100' : 'pointer-events-none opacity-0'
                }`}
                aria-hidden={!isMobileNavOpen}
            >
                <nav className="flex flex-1 flex-col justify-center gap-2">
                    <Link
                        href={route('projects.index')}
                        className={`border-b border-[rgba(27,28,26,0.08)] py-5 text-[clamp(32px,9vw,48px)] font-semibold uppercase leading-none tracking-[-0.03em] ${
                            isProjectsArea ? 'text-[rgb(31,122,70)]' : 'text-[rgb(27,28,26)]'
                        }`}
                        onClick={closeMobileNav}
                    >
                        {cms.nav.work}
                    </Link>
                    <Link
                        href={route('tentang')}
                        className={`border-b border-[rgba(27,28,26,0.08)] py-5 text-[clamp(32px,9vw,48px)] font-semibold uppercase leading-none tracking-[-0.03em] ${
                            isStudioArea ? 'text-[rgb(31,122,70)]' : 'text-[rgb(27,28,26)]'
                        }`}
                        onClick={closeMobileNav}
                    >
                        {cms.nav.studio}
                    </Link>
                </nav>

                <div className="mt-auto space-y-5 border-t border-[rgba(27,28,26,0.1)] pt-6 pb-[env(safe-area-inset-bottom)]">
                    <NavCta cms={cms} onClick={closeMobileNav} />

                    <div className="flex items-center justify-between">
                        <span className="inline-flex gap-0.5 rounded-full border border-[rgba(27,28,26,0.15)] p-0.5 text-xs">
                            <Link
                                href={locale === 'en' ? url : altLocaleUrl}
                                className={`rounded-full px-3 py-1.5 ${locale === 'en' ? 'bg-[rgb(27,28,26)] text-[rgb(243,243,240)]' : ''}`}
                                onClick={closeMobileNav}
                            >
                                EN
                            </Link>
                            <Link
                                href={locale === 'id' ? url : altLocaleUrl}
                                className={`rounded-full px-3 py-1.5 ${locale === 'id' ? 'bg-[rgb(27,28,26)] text-[rgb(243,243,240)]' : ''}`}
                                onClick={closeMobileNav}
                            >
                                ID
                            </Link>
                        </span>
                        <span className="font-mono text-[10px] uppercase tracking-[0.1em] text-[rgba(27,28,26,0.4)]">
                            Elevasi
                        </span>
                    </div>
                </div>
            </div>

            <main id="page-content" ref={pageRef}>
                {children}
            </main>

            <footer className={`mt-10 overflow-hidden rounded-t-3xl bg-[rgb(27,28,26)] text-[rgb(243,243,240)] ${isContactPage ? 'pt-10' : ''}`}>
                {!isContactPage && (
                    <div className="relative px-5 pb-20 pt-20 text-center md:px-10 md:pb-[100px] md:pt-[110px]">
                        {cms.footer.ctaImage && (
                            <>
                                <OptimizedImage
                                    src={cms.footer.ctaImage}
                                    srcSet={cms.footer.ctaImageSrcSet}
                                    alt=""
                                    className="absolute inset-0 h-full w-full object-cover"
                                    sizes="100vw"
                                    loading="lazy"
                                    aria-hidden="true"
                                />
                                <div className="absolute inset-0 bg-[rgba(27,28,26,0.72)]" aria-hidden="true" />
                            </>
                        )}
                        <div className="relative z-10">
                            <div className="mb-7 font-mono text-xs uppercase tracking-[0.08em] text-[rgba(243,243,240,0.45)]">( {cms.footer.eyebrow} )</div>
                            <div className="text-[clamp(42px,7vw,120px)] font-semibold uppercase leading-[1] tracking-[-0.035em]">
                                {cms.footer.titleLine1}
                                <br />
                                <span className="serif-italic">{cms.footer.titleLine2}</span>
                            </div>
                            <div className="mt-10 flex justify-center md:mt-12">
                                <WhatsAppButton
                                    className="w-full max-w-sm rounded-full bg-[rgb(31,122,70)] px-8 py-4 text-sm font-semibold uppercase tracking-[0.06em] transition hover:bg-[rgb(243,243,240)] hover:text-[rgb(27,28,26)] sm:w-auto sm:max-w-none"
                                    source="/footer"
                                >
                                    {cms.footer.whatsapp}
                                </WhatsAppButton>
                            </div>
                        </div>
                    </div>
                )}

                <div className="relative z-10 flex flex-col gap-4 border-t border-[rgba(243,243,240,0.15)] px-5 pt-7 pb-9 text-xs uppercase tracking-[0.06em] text-[rgba(243,243,240,0.5)] sm:flex-row sm:flex-wrap sm:items-center sm:justify-between md:px-10">
                    <span className="text-sm font-bold tracking-[0.02em] text-[rgb(243,243,240)]">
                        ELEVASI <span>Design &amp; Build</span>
                    </span>
                    <span className="flex flex-wrap gap-4 sm:gap-6">
                        {settings.instagramUrl && (
                            <a href={settings.instagramUrl} target="_blank" rel="noopener noreferrer" className="text-[rgba(243,243,240,0.6)] transition hover:text-[rgb(243,243,240)]">{cms.footer.instagramLabel}</a>
                        )}
                        <WhatsAppButton
                            className="text-[rgba(243,243,240,0.6)] transition hover:text-[rgb(243,243,240)]"
                            source="/footer-link"
                            showArrow={false}
                        >
                            {cms.footer.whatsappLabel}
                        </WhatsAppButton>
                    </span>
                    <span>{cms.footer.copyright}</span>
                </div>
            </footer>
        </WhatsAppInquiryProvider>
    );
}
