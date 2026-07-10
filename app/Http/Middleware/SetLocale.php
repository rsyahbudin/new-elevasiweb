<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\App;
use Symfony\Component\HttpFoundation\Response;

class SetLocale
{
    public const DEFAULT_LOCALE = 'en';

    public function handle(Request $request, Closure $next): Response
    {
        $locale = $request->is('id') || $request->is('id/*') ? 'id' : self::DEFAULT_LOCALE;

        App::setLocale($locale);

        return $next($request);
    }
}
