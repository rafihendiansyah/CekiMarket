<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Product;
use App\Models\ProductReview;
use App\Models\Seller;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;
use Inertia\Response;

class AdminDashboardController extends Controller
{
    public function index(): Response
    {
        $user = Auth::user();

        if (!$user || $user->role !== 'platform_admin') {
            abort(403, 'Hanya Platform Admin yang boleh mengakses dashboard ini.');
        }

        // --------- STATISTIK UTAMA ---------
        $totalReviews = ProductReview::count();

        $uniqueReviewers = ProductReview::whereNotNull('visitor_email')
            ->distinct('visitor_email')
            ->count('visitor_email');

        $activeSellers = Seller::where('status', 'ACTIVE')->count();
        $inactiveSellers = Seller::whereIn('status', ['PENDING', 'REJECTED'])->count();

        // --------- SEBARAN PRODUK PER KATEGORI ---------
        $categoryStatsCollection = Product::where('status', 'ACTIVE')
            ->whereNotNull('category')
            ->selectRaw('category, COUNT(*) as product_count')
            ->groupBy('category')
            ->orderBy('category')
            ->get();

        $categoryStats = $categoryStatsCollection->map(function ($row) {
            return [
                'category'      => $row->category,
                'product_count' => (int) $row->product_count,
            ];
        });

        // --------- SEBARAN TOKO PER PROVINSI ---------
        $provinceStatsCollection = Seller::whereNotNull('picProvince')
            ->selectRaw('picProvince as province, COUNT(*) as seller_count')
            ->groupBy('picProvince')
            ->orderBy('picProvince')
            ->get();

        $provinceStats = $provinceStatsCollection->map(function ($row) {
            return [
                'province'     => $row->province,
                'seller_count' => (int) $row->seller_count,
            ];
        });

        // --------- TOP PENGUNJUNG YANG PERNAH REVIEW ---------
        $visitorStatsCollection = ProductReview::selectRaw(
                'visitor_email, visitor_name, COUNT(*) as review_count'
            )
            ->whereNotNull('visitor_email')
            ->groupBy('visitor_email', 'visitor_name')
            ->orderByDesc('review_count')
            ->limit(10)
            ->get();

        $visitorStats = $visitorStatsCollection->map(function ($row) {
            return [
                'email'        => $row->visitor_email,
                'name'         => $row->visitor_name,
                'review_count' => (int) $row->review_count,
            ];
        });

        // --------- DAFTAR REVIEW TERBARU (UNTUK DETAIL) ---------
        $recentReviewsCollection = ProductReview::with('product')
            ->latest()
            ->get();

        $recentReviews = $recentReviewsCollection->map(function ($r) {
            return [
                'id'            => $r->id,
                'product_name'  => $r->product?->name,
                'rating'        => $r->rating,
                'comment'       => $r->comment,
                'visitor_name'  => $r->visitor_name,
                'visitor_email' => $r->visitor_email,
                'created_at'    => $r->created_at->format('d-m-Y H:i'),
            ];
        });

        // --------- DATA UNTUK CHART ---------
        $categoryChart = [
            'labels' => $categoryStatsCollection->pluck('category'),
            'data'   => $categoryStatsCollection->pluck('product_count')->map(fn ($v) => (int) $v),
        ];

        $provinceChart = [
            'labels' => $provinceStatsCollection->pluck('province'),
            'data'   => $provinceStatsCollection->pluck('seller_count')->map(fn ($v) => (int) $v),
        ];

        $sellerStatusChart = [
            'labels' => ['Aktif', 'Tidak Aktif'],
            'data'   => [(int) $activeSellers, (int) $inactiveSellers],
        ];

        $topVisitorsChart = [
            'labels' => $visitorStatsCollection->pluck('visitor_name'),
            'data'   => $visitorStatsCollection->pluck('review_count')->map(fn ($v) => (int) $v),
        ];

        return Inertia::render('Admin/Dashboard', [
            'stats' => [
                'totalReviews'    => $totalReviews,
                'uniqueReviewers' => $uniqueReviewers,
                'activeSellers'   => $activeSellers,
                'inactiveSellers' => $inactiveSellers,
            ],
            'categoryStats' => $categoryStats,
            'provinceStats' => $provinceStats,
            'visitorStats'  => $visitorStats,
            'recentReviews' => $recentReviews,
            'charts'        => [
                'category'     => $categoryChart,
                'province'     => $provinceChart,
                'sellerStatus' => $sellerStatusChart,
                'topVisitors'  => $topVisitorsChart,
            ],
        ]);
    }
}
