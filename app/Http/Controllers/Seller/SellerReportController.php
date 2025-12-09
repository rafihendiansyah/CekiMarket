<?php

namespace App\Http\Controllers\Seller;

use App\Http\Controllers\Controller;
use Barryvdh\DomPDF\Facade\Pdf;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;

class SellerReportController extends Controller
{
    protected function ensureSeller()
    {
        $user = Auth::user();
        $seller = $user?->seller;

        if (!$user || !$seller) {
            abort(403, 'Hanya penjual yang boleh mengakses laporan ini.');
        }

        return [$user, $seller];
    }

    // SRS-12: Laporan produk berdasarkan stok (desc)
    public function productsByStockPdf()
    {
        [$user, $seller] = $this->ensureSeller();
        $generatedAt = now();

        $products = DB::table('products')
            ->leftJoin('reviews', 'reviews.product_id', '=', 'products.id')
            ->select(
                'products.id',
                'products.name as product_name',
                'products.category',
                'products.price',
                'products.stock',
                DB::raw('COALESCE(AVG(reviews.rating), 0) as avg_rating')
            )
            ->where('products.seller_id', $seller->id)
            ->groupBy(
                'products.id',
                'products.name',
                'products.category',
                'products.price',
                'products.stock'
            )
            ->orderByDesc('products.stock')
            ->get();

        $html = view('seller.reports.products_by_stock', [
            'products'    => $products,
            'generatedAt' => $generatedAt,
            'sellerName'  => $user->name ?? 'Tidak diketahui',
        ])->render();

        return Pdf::loadHTML($html)
            ->setPaper('a4', 'portrait')
            ->download('laporan_produk_berdasarkan_stok.pdf');
    }

    // SRS-13: Laporan produk berdasarkan rating (desc)
    public function productsByRatingPdf()
    {
        [$user, $seller] = $this->ensureSeller();
        $generatedAt = now();

        $products = DB::table('products')
            ->leftJoin('reviews', 'reviews.product_id', '=', 'products.id')
            ->select(
                'products.id',
                'products.name as product_name',
                'products.category',
                'products.price',
                'products.stock',
                DB::raw('COALESCE(AVG(reviews.rating), 0) as avg_rating')
            )
            ->where('products.seller_id', $seller->id)
            ->groupBy(
                'products.id',
                'products.name',
                'products.category',
                'products.price',
                'products.stock'
            )
            ->orderByDesc('avg_rating')
            ->get();

        $html = view('seller.reports.products_by_rating', [
            'products'    => $products,
            'generatedAt' => $generatedAt,
            'sellerName'  => $user->name ?? 'Tidak diketahui',
        ])->render();

        return Pdf::loadHTML($html)
            ->setPaper('a4', 'portrait')
            ->download('laporan_produk_berdasarkan_rating_penjual.pdf');
    }

    // SRS-14: Laporan produk segera dipesan (stok < 2)
    public function productsToRestockPdf()
    {
        [$user, $seller] = $this->ensureSeller();
        $generatedAt = now();

        $products = DB::table('products')
            ->select(
                'products.id',
                'products.name as product_name',
                'products.category',
                'products.price',
                'products.stock'
            )
            ->where('products.seller_id', $seller->id)
            ->where('products.stock', '<', 2)
            ->orderBy('products.category')
            ->orderBy('products.name')
            ->get();

        $html = view('seller.reports.products_to_restock', [
            'products'    => $products,
            'generatedAt' => $generatedAt,
            'sellerName'  => $user->name ?? 'Tidak diketahui',
        ])->render();

        return Pdf::loadHTML($html)
            ->setPaper('a4', 'portrait')
            ->download('laporan_produk_segera_dipesan.pdf');
    }
}

