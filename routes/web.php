<?php

use App\Http\Controllers\ProfileController;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\SellerRegistrationController;
use App\Http\Controllers\PlatformAdminSellerController;
use App\Http\Controllers\SellerProductController;
use App\Http\Controllers\ProductCatalogController;
use App\Http\Controllers\ProductReviewController;
use App\Http\Controllers\Admin\AdminDashboardController;
use App\Http\Controllers\Admin\SellerReportController;

/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
*/

// Halaman utama & dashboard → katalog produk (public)
Route::get('/', [ProductCatalogController::class, 'index'])->name('home');
Route::get('/dashboard', [ProductCatalogController::class, 'index'])->name('dashboard');

// Halaman detail produk (public)
Route::get('/products/{product}', [ProductCatalogController::class, 'show'])
    ->name('products.show');

// Simpan komentar + rating pengunjung (public, tanpa login)
Route::post('/products/{product}/reviews', [ProductReviewController::class, 'store'])
    ->name('products.reviews.store');

// Route yang BUTUH login
Route::middleware('auth')->group(function () {
    // Profile (bawaan Breeze)
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');

    // Dashboard Platform Admin - SRS 07
    Route::get('/admin/dashboard', [AdminDashboardController::class, 'index'])
        ->name('admin.dashboard');

    // Form registrasi penjual (data toko - SRS 01)
    Route::get('/seller/register', [SellerRegistrationController::class, 'create'])
        ->name('seller.register');
    Route::post('/seller/register', [SellerRegistrationController::class, 'store'])
        ->name('seller.register.store');

    // Panel Platform Admin - SRS 02
    Route::get('/admin/sellers', [PlatformAdminSellerController::class, 'index'])
        ->name('admin.sellers.index');
    Route::get('/admin/sellers/{seller}', [PlatformAdminSellerController::class, 'show'])
        ->name('admin.sellers.show');
    Route::post('/admin/sellers/{seller}/approve', [PlatformAdminSellerController::class, 'approve'])
        ->name('admin.sellers.approve');
    Route::post('/admin/sellers/{seller}/reject', [PlatformAdminSellerController::class, 'reject'])
        ->name('admin.sellers.reject');

    // Manajemen produk penjual - SRS 03
    Route::get('/seller/products', [SellerProductController::class, 'index'])
        ->name('seller.products.index');
    Route::get('/seller/products/create', [SellerProductController::class, 'create'])
        ->name('seller.products.create');
    Route::post('/seller/products', [SellerProductController::class, 'store'])
        ->name('seller.products.store');
    Route::get('/seller/products/{product}/edit', [SellerProductController::class, 'edit'])
        ->name('seller.products.edit');
    Route::post('/seller/products/{product}', [SellerProductController::class, 'update'])
        ->name('seller.products.update');
    Route::delete('/seller/products/{product}', [SellerProductController::class, 'destroy'])
        ->name('seller.products.destroy');
    Route::post('/seller/products/{product}/toggle-status', [SellerProductController::class, 'toggleStatus'])
        ->name('seller.products.toggle-status');

    // Laporan Penjual berdasarkan Status (SRS-09)
    Route::get(
        '/admin/reports/sellers/status',
        [SellerReportController::class, 'sellersReportPdf']
    )->name('admin.reports.sellers.status');

    // Laporan Penjual berdasarkan Provinsi (SRS-10)
    Route::get(
        '/admin/reports/sellers/province',
        [SellerReportController::class, 'sellersByProvincePdf']
    )->name('admin.reports.sellers.province');

    // Laporan produk berdasarkan rating - SRS 11
    Route::get(
        '/admin/reports/products-by-rating', 
        [SellerReportController::class, 'productsByRatingPdf']
    )->name('admin.reports.products.rating');


});

// Auth routes (login, register, dll)
require __DIR__.'/auth.php';
