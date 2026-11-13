<?php

use App\Http\Controllers\Admin\AboutController;
use App\Http\Controllers\Admin\BookingController;
use App\Http\Controllers\Admin\LineupController;
use App\Http\Controllers\Admin\LoginController;
use App\Http\Controllers\Admin\MainVideoController;
use App\Http\Controllers\Admin\SongController;
use App\Http\Controllers\Admin\SoundCloudLinkController;
use App\Http\Controllers\Admin\YouTubeLinkController;
use App\Http\Controllers\SongPdfController;
use Illuminate\Support\Facades\Route;

Route::get('/', function () {
    return view('welcome');
});

Route::get('/songs.pdf', SongPdfController::class)->name('songs.pdf');

Route::redirect('/admin', '/admin/songs');

Route::middleware('guest')->group(function () {
    Route::get('/admin/login', [LoginController::class, 'create'])->name('admin.login');
    Route::post('/admin/login', [LoginController::class, 'store'])
        ->middleware('throttle:5,1')
        ->name('admin.login.store');
});

Route::middleware(['auth', 'admin'])->prefix('admin')->name('admin.')->group(function () {
    Route::post('/logout', [LoginController::class, 'destroy'])->name('logout');
    Route::resource('songs', SongController::class)->except(['show']);
    Route::get('/about', [AboutController::class, 'edit'])->name('about.edit');
    Route::put('/about', [AboutController::class, 'update'])->name('about.update');
    Route::resource('soundcloud', SoundCloudLinkController::class)->except(['show']);
    Route::resource('lineup', LineupController::class)->except(['show']);
    Route::get('/booking', [BookingController::class, 'edit'])->name('booking.edit');
    Route::put('/booking', [BookingController::class, 'update'])->name('booking.update');
    Route::resource('youtube', YouTubeLinkController::class)->except(['show']);
    Route::get('/video', [MainVideoController::class, 'edit'])->name('video.edit');
    Route::post('/video', [MainVideoController::class, 'update'])->name('video.update');
    Route::delete('/video', [MainVideoController::class, 'destroy'])->name('video.destroy');
});
