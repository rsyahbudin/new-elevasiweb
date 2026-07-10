<?php

use App\Http\Controllers\HomeController;
use App\Http\Controllers\KontakController;
use App\Http\Controllers\ProjectController;
use App\Http\Controllers\SitemapController;
use App\Http\Controllers\StaticPageController;
use Illuminate\Support\Facades\Route;

Route::get('/sitemap.xml', SitemapController::class)->name('sitemap');
Route::get('/robots.txt', function () {
    $sitemap = rtrim(config('app.url'), '/').'/sitemap.xml';

    return response(
        "User-agent: *\nAllow: /\n\nDisallow: /admin\nDisallow: /livewire\n\nSitemap: {$sitemap}\n",
        200,
        ['Content-Type' => 'text/plain; charset=UTF-8'],
    );
})->name('robots');

Route::permanentRedirect('/en', '/');
Route::get('/en/{path}', function (string $path) {
    return redirect('/'.$path, 301);
})->where('path', '.*');

/*
 * Registered twice — once with no prefix (default "en" locale) and once
 * under "/id" — because Laravel's optional route parameters only work at
 * the end of a URI, so "{locale?}/proyek" can't match a bare "/proyek".
 * The "id." name prefix lets the client-side route() helper (see
 * resources/js/app.jsx) transparently pick the right variant per request.
 */
$registerPublicRoutes = function (): void {
    Route::get('/', HomeController::class)->name('home');

    Route::get('/proyek', [ProjectController::class, 'index'])->name('projects.index');
    Route::get('/proyek/{slug}', [ProjectController::class, 'show'])->name('projects.show');

    Route::get('/tentang', [StaticPageController::class, 'tentang'])->name('tentang');
    Route::get('/layanan', [StaticPageController::class, 'layanan'])->name('layanan');

    Route::get('/kontak', [KontakController::class, 'show'])->name('kontak');
    Route::post('/kontak', [KontakController::class, 'store'])
        ->middleware('throttle:5,1')
        ->name('kontak.store');
};

$registerPublicRoutes();

Route::prefix('id')->name('id.')->group($registerPublicRoutes);
