{!! '<'.'?xml version="1.0" encoding="UTF-8"?>' !!}
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:xhtml="http://www.w3.org/1999/xhtml">
@foreach ($urls as $url)
    <url>
        <loc>{{ $base.$url['loc'] }}</loc>
        <lastmod>{{ $url['lastmod'] }}</lastmod>
        <changefreq>{{ $url['changefreq'] }}</changefreq>
        <priority>{{ $url['priority'] }}</priority>
@php
    $path = $url['loc'];
    $isId = str_starts_with($path, '/id');
    $enPath = $isId ? (preg_replace('#^/id(/|$)#', '/', $path) ?: '/') : $path;
    $idPath = $isId ? $path : ($path === '/' ? '/id' : '/id'.$path);
@endphp
        <xhtml:link rel="alternate" hreflang="id" href="{{ $base.$idPath }}" />
        <xhtml:link rel="alternate" hreflang="en" href="{{ $base.$enPath }}" />
        <xhtml:link rel="alternate" hreflang="x-default" href="{{ $base.$enPath }}" />
    </url>
@endforeach
</urlset>
