<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Seller;
use Barryvdh\DomPDF\Facade\Pdf;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;

class SellerReportController extends Controller
{
    // ============================ SRS-09 ===============================
    // Laporan daftar akun penjual (status)
    public function sellersReportPdf()
    {
        $sellers = Seller::with('user')
            ->orderByRaw("CASE WHEN status = 'ACTIVE' THEN 0 ELSE 1 END")
            ->orderBy('id')
            ->get();

        $adminName   = Auth::user()->name ?? 'Tidak diketahui';
        $generatedAt = now();

        $html = view('admin.reports.sellers_by_status', [
            'sellers'     => $sellers,
            'generatedAt' => $generatedAt,
            'adminName'   => $adminName,
        ])->render();

        return Pdf::loadHTML($html)
            ->setPaper('a4', 'portrait')
            ->download('laporan_penjual_berdasarkan_status.pdf');
    }

    // ============================ SRS-10 ===============================
    // Laporan daftar toko per provinsi
    public function sellersByProvincePdf()
    {
        $sellers = Seller::with('user')
            ->orderBy('picProvince')
            ->orderBy('id')
            ->get();

        $adminName   = Auth::user()->name ?? 'Tidak diketahui';
        $generatedAt = now();

        $html = view('admin.reports.sellers_by_province', [
            'sellers'     => $sellers,
            'generatedAt' => $generatedAt,
            'adminName'   => $adminName,
        ])->render();

        return Pdf::loadHTML($html)
            ->setPaper('a4', 'portrait')
            ->download('laporan_toko_per_provinsi.pdf');
    }

    // ============================ SRS-11 ===============================
    // Laporan daftar produk + rating (urut menurun), include:
    // produk, kategori, harga, rating rata-rata, nama toko, propinsi TOKO
    public function productsByRatingPdf()
    {
        $adminName   = Auth::user()->name ?? 'Tidak diketahui';
        $generatedAt = now();

        $products = DB::table('products')
            ->leftJoin('reviews', 'reviews.product_id', '=', 'products.id')
            ->leftJoin('sellers', 'sellers.id', '=', 'products.seller_id')
            ->select(
                'products.id',
                'products.name as product_name',
                'products.category as product_category',
                'products.price as product_price',
                'sellers.storeName as store_name',
                'sellers.picProvince as store_province', // lokasi propinsi TOKO
                DB::raw('COALESCE(AVG(reviews.rating), 0) as avg_rating')
            )
            ->groupBy(
                'products.id',
                'products.name',
                'products.category',
                'products.price',
                'sellers.storeName',
                'sellers.picProvince'
            )
            ->orderByDesc('avg_rating')
            ->get();

        $html = view('admin.reports.products_by_rating', [
            'products'    => $products,
            'generatedAt' => $generatedAt,
            'adminName'   => $adminName,
        ])->render();

        return Pdf::loadHTML($html)
            ->setPaper('a4', 'portrait')
            ->download('laporan_produk_berdasarkan_rating.pdf');
    }
}
