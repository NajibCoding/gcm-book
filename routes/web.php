<?php

declare(strict_types=1);

use App\Http\Controllers\Admin;
use App\Http\Controllers\Customer;
use App\Http\Controllers\ProfileController;
use App\Http\Controllers\Public;
use App\Models\Promo;
use App\Models\Service;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

// Landing page
Route::get('/', function () {
    $promos = Promo::where('is_active', true)
        ->where('valid_from', '<=', now())
        ->where('valid_until', '>=', now())
        ->get();

    $services = Service::where('is_active', true)->get();

    return Inertia::render('Welcome', [
        'promos' => $promos,
        'services' => $services,
    ]);
})->name('home');

// Public booking & services
Route::get('/services', [Public\ServiceController::class, 'index'])->name('services.index');
Route::get('/booking', [Public\BookingController::class, 'create'])->name('booking.create');
Route::post('/booking', [Public\BookingController::class, 'store'])->name('booking.store');
Route::get('/booking/{code}', [Public\BookingController::class, 'show'])->name('booking.show');

// Public promos listing
Route::get('/promos', function () {
    $promos = Promo::where('is_active', true)
        ->where('valid_from', '<=', now())
        ->where('valid_until', '>=', now())
        ->get();

    return Inertia::render('Promos/Index', ['promos' => $promos]);
})->name('promos.index');

// Authenticated customer routes
Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('/dashboard', [Customer\DashboardController::class, 'index'])->name('dashboard');
    Route::get('/bookings', [Customer\BookingHistoryController::class, 'index'])->name('bookings.index');

    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
});

// Admin routes
Route::prefix('admin')
    ->name('admin.')
    ->middleware(['auth', 'role:admin,super-admin'])
    ->group(function () {
        Route::get('/', [Admin\DashboardController::class, 'index'])->name('dashboard');

        // Bookings
        Route::get('/bookings', [Admin\BookingController::class, 'index'])->name('bookings.index');
        Route::get('/bookings/create', [Admin\BookingController::class, 'create'])->name('bookings.create');
        Route::post('/bookings', [Admin\BookingController::class, 'store'])->name('bookings.store');
        Route::get('/bookings/{booking}', [Admin\BookingController::class, 'show'])->name('bookings.show');
        Route::get('/bookings/{booking}/edit', [Admin\BookingController::class, 'edit'])->name('bookings.edit');
        Route::patch('/bookings/{booking}', [Admin\BookingController::class, 'update'])->name('bookings.update');
        Route::put('/bookings/{booking}/details', [Admin\BookingController::class, 'updateDetails'])->name('bookings.update-details');

        // Invoices
        Route::get('/invoices', [Admin\InvoiceController::class, 'index'])->name('invoices.index');
        Route::get('/invoices/create', [Admin\InvoiceController::class, 'create'])->name('invoices.create');
        Route::post('/invoices', [Admin\InvoiceController::class, 'store'])->name('invoices.store');
        Route::get('/invoices/{invoice}', [Admin\InvoiceController::class, 'show'])->name('invoices.show');
        Route::get('/invoices/{invoice}/edit', [Admin\InvoiceController::class, 'edit'])->name('invoices.edit');
        Route::patch('/invoices/{invoice}', [Admin\InvoiceController::class, 'update'])->name('invoices.update');
        Route::delete('/invoices/{invoice}', [Admin\InvoiceController::class, 'destroy'])->name('invoices.destroy');
        Route::get('/invoices/{invoice}/download', [Admin\InvoiceController::class, 'download'])->name('invoices.download');
        Route::post('/invoices/{invoice}/send', [Admin\InvoiceController::class, 'send'])->name('invoices.send');

        // Services
        Route::resource('services', Admin\ServiceController::class)
            ->names('services')
            ->except(['show']);

        // Promos
        Route::resource('promos', Admin\PromoController::class)
            ->names('promos')
            ->except(['show']);

        // Users
        Route::get('/users', [Admin\UserController::class, 'index'])->name('users.index');
        Route::get('/users/{user}', [Admin\UserController::class, 'show'])->name('users.show');
        Route::patch('/users/{user}', [Admin\UserController::class, 'update'])->name('users.update');

        // Queue
        Route::get('/queue', [Admin\QueueController::class, 'index'])->name('queue.index');
        Route::patch('/queue/{booking}/status', [Admin\QueueController::class, 'updateStatus'])->name('queue.update-status');
    });

require __DIR__ . '/auth.php';

