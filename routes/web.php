<?php

use App\Http\Controllers\HomeController;
use App\Http\Controllers\KontakController;
use App\Http\Controllers\ProjectController;
use App\Http\Controllers\StaticPageController;
use Illuminate\Support\Facades\Route;

/*
 * Registered twice — once with no prefix (default "id" locale) and once
 * under "/en" — because Laravel's optional route parameters only work at
 * the end of a URI, so "{locale?}/proyek" can't match a bare "/proyek".
 * The "en." name prefix lets the client-side route() helper (see
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

Route::prefix('en')->name('en.')->group($registerPublicRoutes);
