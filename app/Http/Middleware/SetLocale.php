<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\App;
use Symfony\Component\HttpFoundation\Response;

class SetLocale
{
    public const DEFAULT_LOCALE = 'id';

    public function handle(Request $request, Closure $next): Response
    {
        $locale = $request->is('en') || $request->is('en/*') ? 'en' : self::DEFAULT_LOCALE;

        App::setLocale($locale);

        return $next($request);
    }
}
