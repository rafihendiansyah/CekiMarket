<?php

namespace App\Http\Controllers\Seller;

use App\Http\Controllers\Controller;
use App\Models\Product;
use App\Models\Review;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;
use Inertia\Response;

class SellerDashboardController extends Controller
{
    public function index(): Response|\Illuminate\Http\RedirectResponse
    {
        $user = Auth::user();
        
        if (!$user || $user->role !== 'penjual') {
            abort(403, 'Hanya penjual yang boleh mengakses dashboard ini.');
        }

        $seller = $user->seller;

        // Jika belum ada data toko, redirect ke lengkapi data toko
        if (!$seller) {
            return redirect()
                ->route('seller.register')
                ->with('error', 'Lengkapi data toko terlebih dahulu sebelum mengakses dashboard penjual.');
        }

        // Jika status PENDING, kirim flag untuk menampilkan popup
        if ($seller->status === 'PENDING') {
            return Inertia::render('Seller/Dashboard', [
                'stockChart'    => ['labels' => [], 'data' => []],
                'ratingChart'   => ['labels' => [], 'data' => [], 'counts' => []],
                'provinceChart' => ['labels' => [], 'data' => []],
                'products'      => [],
                'storeName'     => $seller->storeName,
                'showPendingModal' => true,
            ]);
        }

        // Jika status REJECTED, kirim flag untuk menampilkan popup
        if ($seller->status === 'REJECTED') {
            return Inertia::render('Seller/Dashboard', [
                'stockChart'    => ['labels' => [], 'data' => []],
                'ratingChart'   => ['labels' => [], 'data' => [], 'counts' => []],
                'provinceChart' => ['labels' => [], 'data' => []],
                'products'      => [],
                'storeName'     => $seller->storeName,
                'showRejectedModal' => true,
                'submissionCount' => $seller->submission_count ?? 1,
            ]);
        }

        // Produk milik penjual - ambil semua untuk dashboard (termasuk INACTIVE untuk statistik)
        $allProducts = Product::where('seller_id', $seller->id)->get([
            'id',
            'name',
            'stock',
            'price',
            'status',
        ]);
        
        // Produk ACTIVE saja untuk chart (sesuai SRS 08)
        $activeProducts = $allProducts->where('status', 'ACTIVE');
        
        // Hitung total review dari semua produk
        $totalReviews = Review::whereIn('product_id', $allProducts->pluck('id'))->count();

        $productIds = $allProducts->pluck('id');

        // Rata-rata rating per produk
        $ratingStats = Review::whereIn('product_id', $productIds)
            ->selectRaw('product_id, AVG(rating) as avg_rating, COUNT(*) as review_count')
            ->groupBy('product_id')
            ->get()
            ->keyBy('product_id');

        // Chart stok per produk - hanya produk ACTIVE
        $stockChart = [
            'labels' => $activeProducts->pluck('name'),
            'data'   => $activeProducts->pluck('stock')->map(fn ($v) => (int) $v),
        ];

        // Chart rating per produk - hanya produk ACTIVE
        $ratingChart = [
            'labels' => $activeProducts->pluck('name'),
            'data'   => $activeProducts->map(function ($product) use ($ratingStats) {
                $stat = $ratingStats[$product->id] ?? null;
                return $stat ? round((float) $stat->avg_rating, 2) : 0;
            }),
            'counts' => $activeProducts->map(function ($product) use ($ratingStats) {
                $stat = $ratingStats[$product->id] ?? null;
                return $stat ? (int) $stat->review_count : 0;
            }),
        ];

        // Sebaran pemberi rating berdasarkan provinsi
        // Catatan: saat ini tabel reviews tidak menyimpan provinsi pengulas.
        // Kita kirim data kosong agar UI menampilkan pesan "belum ada data".
        $provinceChart = [
            'labels' => [],
            'data'   => [],
        ];

        return Inertia::render('Seller/Dashboard', [
            'stockChart'    => $stockChart,
            'ratingChart'   => $ratingChart,
            'provinceChart' => $provinceChart,
            'storeName'     => $seller->storeName,
            'totalReviews'  => $totalReviews,
            'products'      => $allProducts->map(function ($p) use ($ratingStats) {
                $stat = $ratingStats[$p->id] ?? null;
                return [
                    'id'           => $p->id,
                    'name'         => $p->name,
                    'stock'        => (int) $p->stock,
                    'price'        => (float) $p->price,
                    'status'       => $p->status,
                    'avg_rating'   => $stat ? round((float) $stat->avg_rating, 2) : 0,
                    'review_count' => $stat ? (int) $stat->review_count : 0,
                ];
            }),
        ]);
    }
}

