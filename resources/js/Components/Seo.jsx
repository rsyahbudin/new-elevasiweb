import { Head, usePage } from '@inertiajs/react';

function absoluteUrl(path, appUrl) {
    if (!path) {
        return appUrl;
    }

    if (String(path).startsWith('http://') || String(path).startsWith('https://')) {
        return path;
    }

    const base = String(appUrl || '').replace(/\/$/, '');
    const normalized = path === '/' ? '/' : `/${String(path).replace(/^\/+/, '')}`;

    return `${base}${normalized === '/' ? '/' : normalized}`;
}

export default function Seo({
    title,
    description,
    image,
    type = 'website',
    noIndex = false,
    preloadImage = false,
}) {
    const { props } = usePage();
    const { locale, url, altLocaleUrl, seo: siteSeo } = props;
    const appUrl = siteSeo?.appUrl || '';
    const siteName = siteSeo?.siteName || 'Elevasi Design & Build';
    const metaDescription =
        description ||
        siteSeo?.defaultDescription ||
        'Elevasi Design & Build — kontraktor design-build di Jakarta untuk rumah, kantor, dan ruang komersial.';
    const ogImage = absoluteUrl(image || siteSeo?.defaultImage, appUrl);
    const canonicalPath = !url || url === '/' ? '/' : url;
    const canonical = absoluteUrl(canonicalPath, appUrl);
    const idPath = locale === 'id' ? canonicalPath : altLocaleUrl;
    const enPath = locale === 'en' ? canonicalPath : altLocaleUrl;
    const alternateId = absoluteUrl(idPath, appUrl);
    const alternateEn = absoluteUrl(enPath, appUrl);
    const documentTitle = !title || title === siteName ? undefined : title;
    const ogTitle = documentTitle ? `${documentTitle} — ${siteName}` : siteName;

    return (
        <Head title={documentTitle}>
            <meta head-key="description" name="description" content={metaDescription} />
            {noIndex ? (
                <meta head-key="robots" name="robots" content="noindex,nofollow" />
            ) : (
                <meta head-key="robots" name="robots" content="index,follow" />
            )}

            <link head-key="canonical" rel="canonical" href={canonical} />
            <link head-key="hreflang-id" rel="alternate" hrefLang="id" href={alternateId} />
            <link head-key="hreflang-en" rel="alternate" hrefLang="en" href={alternateEn} />
            <link head-key="hreflang-default" rel="alternate" hrefLang="x-default" href={alternateId} />

            {preloadImage && image ? (
                <link head-key="preload-lcp" rel="preload" as="image" href={absoluteUrl(image, appUrl)} />
            ) : null}

            <meta head-key="og:type" property="og:type" content={type} />
            <meta head-key="og:site_name" property="og:site_name" content={siteName} />
            <meta head-key="og:locale" property="og:locale" content={locale === 'en' ? 'en_US' : 'id_ID'} />
            <meta head-key="og:locale:alt" property="og:locale:alternate" content={locale === 'en' ? 'id_ID' : 'en_US'} />
            <meta head-key="og:title" property="og:title" content={ogTitle} />
            <meta head-key="og:description" property="og:description" content={metaDescription} />
            <meta head-key="og:url" property="og:url" content={canonical} />
            {ogImage ? <meta head-key="og:image" property="og:image" content={ogImage} /> : null}

            <meta head-key="twitter:card" name="twitter:card" content="summary_large_image" />
            <meta head-key="twitter:title" name="twitter:title" content={ogTitle} />
            <meta head-key="twitter:description" name="twitter:description" content={metaDescription} />
            {ogImage ? <meta head-key="twitter:image" name="twitter:image" content={ogImage} /> : null}

            {siteSeo?.organizationJsonLd ? (
                <script type="application/ld+json">{JSON.stringify(siteSeo.organizationJsonLd)}</script>
            ) : null}
        </Head>
    );
}
