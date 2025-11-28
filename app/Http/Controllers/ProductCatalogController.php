<?php

namespace App\Http\Controllers;

use App\Models\Product;
use Illuminate\Http\Request; // <-- penting
use Inertia\Inertia;
use Inertia\Response;

class ProductCatalogController extends Controller
{
    /**
     * Halaman Home / Dashboard: daftar produk (katalog) + pencarian & filter.
     */
    public function index(Request $request): Response
    {
        // Ambil parameter pencarian dari query string (?q=..., ?category=..., dll)
        $q        = $request->query('q');
        $category = $request->query('category');
        $city     = $request->query('city');
        $province = $request->query('province');

        // Query dasar: produk ACTIVE dari toko ACTIVE
        $query = Product::with('seller')
            ->withAvg('reviews', 'rating')
            ->withCount('reviews')
            ->where('status', 'ACTIVE')
            ->whereHas('seller', function ($q) {
                $q->where('status', 'ACTIVE');
            });

        // 🔍 Pencarian: nama produk, kategori, dan nama toko
        if ($q) {
            $query->where(function ($sub) use ($q) {
                $sub->where('name', 'like', '%' . $q . '%')
                    ->orWhere('category', 'like', '%' . $q . '%')
                    ->orWhereHas('seller', function ($sellerQuery) use ($q) {
                        $sellerQuery->where('storeName', 'like', '%' . $q . '%');
                    });
            });
        }

        // 🔍 Filter kategori
        if ($category) {
            $query->where('category', $category);
        }

        // 🔍 Filter kota
        if ($city) {
            $query->whereHas('seller', function ($s) use ($city) {
                $s->where('picCity', $city);
            });
        }

        // 🔍 Filter provinsi
        if ($province) {
            $query->whereHas('seller', function ($s) use ($province) {
                $s->where('picProvince', $province);
            });
        }

        // Ambil produk setelah semua filter diterapkan
        $products = $query->latest()->get()->map(function (Product $product) {
            $images = $product->images ?? [];
            $firstImage = count($images) > 0 ? '/storage/' . $images[0] : null;

            return [
                'id'            => $product->id,
                'name'          => $product->name,
                'category'      => $product->category,
                'price'         => $product->price,
                'imageUrl'      => $firstImage,
                'storeName'     => $product->seller?->storeName,
                'location'      => trim(($product->seller->picCity ?? '') . ', ' . ($product->seller->picProvince ?? ''), ', '),
                'ratingAverage' => $product->reviews_avg_rating
                    ? round($product->reviews_avg_rating, 1)
                    : null,
                'reviewCount'   => $product->reviews_count,
            ];
        });

        // Daftar kategori unik (untuk dropdown filter)
        $categories = Product::select('category')
            ->distinct()
            ->orderBy('category')
            ->pluck('category');

        // Daftar kota unik dari seller
        $cities = Product::with('seller')
            ->get()
            ->pluck('seller.picCity')
            ->filter()
            ->unique()
            ->values();

        // Daftar provinsi unik dari seller
        $provinces = Product::with('seller')
            ->get()
            ->pluck('seller.picProvince')
            ->filter()
            ->unique()
            ->values();

        return Inertia::render('Dashboard', [
            'products'   => $products,
            'filters'    => [
                'q'        => $q,
                'category' => $category,
                'city'     => $city,
                'province' => $province,
            ],
            'categories' => $categories,
            'cities'     => $cities,
            'provinces'  => $provinces,
        ]);
    }

    /**
     * Halaman detail produk (public).
     */
    public function show(Product $product): Response
    {
        // Hanya tampilkan kalau produk dan toko ACTIVE
        if (
            $product->status !== 'ACTIVE' ||
            !$product->seller ||
            $product->seller->status !== 'ACTIVE'
        ) {
            abort(404);
        }

        // Rata-rata rating & jumlah review
        $avgRating   = round($product->reviews()->avg('rating') ?? 0, 1);
        $reviewCount = $product->reviews()->count();

        // Semua review (komentar)
        $reviews = $product->reviews()
            ->latest()
            ->get()
            ->map(function ($review) {
                return [
                    'id'           => $review->id,
                    'visitor_name' => $review->visitor_name,
                    'rating'       => $review->rating,
                    'comment'      => $review->comment,
                    'date'         => $review->created_at->format('d-m-Y H:i'),
                ];
            });

        $images = [];
        foreach ($product->images ?? [] as $img) {
            $images[] = '/storage/' . $img;
        }

        $seller = $product->seller;

        return Inertia::render('Products/Show', [
            'product' => [
                'id'            => $product->id,
                'name'          => $product->name,
                'category'      => $product->category,
                'price'         => $product->price,
                'stock'         => $product->stock,
                'description'   => $product->description,
                'images'        => $images,
                'status'        => $product->status,
                'ratingAverage' => $avgRating,
                'reviewCount'   => $reviewCount,
            ],
            'store' => [
                'name'      => $seller->storeName,
                'location'  => trim(($seller->picCity ?? '') . ', ' . ($seller->picProvince ?? ''), ', '),
                'picName'   => $seller->picName,
                'picPhone'  => $seller->picPhone,
                'picEmail'  => $seller->picEmail,
            ],
            'reviews' => $reviews,
        ]);
    }
}
