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
    public function index(): Response
    {
        $user = Auth::user();
        $seller = $user?->seller;

        if (!$user || !$seller) {
            abort(403, 'Hanya penjual yang boleh mengakses dashboard ini.');
        }

        // Produk milik penjual
        $products = Product::where('seller_id', $seller->id)->get([
            'id',
            'name',
            'stock',
            'price',
        ]);

        $productIds = $products->pluck('id');

        // Rata-rata rating per produk
        $ratingStats = Review::whereIn('product_id', $productIds)
            ->selectRaw('product_id, AVG(rating) as avg_rating, COUNT(*) as review_count')
            ->groupBy('product_id')
            ->get()
            ->keyBy('product_id');

        // Chart stok per produk
        $stockChart = [
            'labels' => $products->pluck('name'),
            'data'   => $products->pluck('stock')->map(fn ($v) => (int) $v),
        ];

        // Chart rating per produk
        $ratingChart = [
            'labels' => $products->pluck('name'),
            'data'   => $products->map(function ($product) use ($ratingStats) {
                $stat = $ratingStats[$product->id] ?? null;
                return $stat ? round((float) $stat->avg_rating, 2) : 0;
            }),
            'counts' => $products->map(function ($product) use ($ratingStats) {
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
            'products'      => $products->map(function ($p) use ($ratingStats) {
                $stat = $ratingStats[$p->id] ?? null;
                return [
                    'id'           => $p->id,
                    'name'         => $p->name,
                    'stock'        => (int) $p->stock,
                    'price'        => (float) $p->price,
                    'avg_rating'   => $stat ? round((float) $stat->avg_rating, 2) : 0,
                    'review_count' => $stat ? (int) $stat->review_count : 0,
                ];
            }),
        ]);
    }
}

