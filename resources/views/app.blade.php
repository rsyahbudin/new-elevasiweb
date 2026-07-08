<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}">
    <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
        <meta name="theme-color" content="#F3F3F0">

        <title inertia>{{ config('app.name') }}</title>
        <link rel="icon" type="image/gif" href="{{ Vite::asset('resources/images/elevasi-logo.gif') }}">
        <link rel="apple-touch-icon" href="{{ Vite::asset('resources/images/elevasi-logo.gif') }}">

        @routes
        @viteReactRefresh
        @vite(['resources/css/app.css', 'resources/js/app.jsx'])
        @inertiaHead
    </head>
    <body>
        @inertia
    </body>
</html>
