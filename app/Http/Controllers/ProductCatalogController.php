<?php

namespace App\Http\Controllers;

use App\Models\Product;
use Illuminate\Http\Request;
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
        $q         = $request->query('q');
        $category  = $request->query('category');
        $city      = $request->query('city');
        $province  = $request->query('province');
        $condition = $request->query('condition'); // BARU / BEKAS

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

        // 🔍 Filter kategori (support multiple)
        if ($category) {
            $categories = is_array($category) ? $category : [$category];
            if (count($categories) > 0) {
                $query->whereIn('category', $categories);
            }
        }

        // 🔍 Filter kondisi barang (BARU / BEKAS)
        if ($condition) {
            $query->where('condition', $condition);
        }

        // 🔍 Filter kota (support multiple)
        if ($city) {
            $cities = is_array($city) ? $city : [$city];
            if (count($cities) > 0) {
                $query->whereHas('seller', function ($s) use ($cities) {
                    $s->whereIn('picCity', $cities);
                });
            }
        }

        // 🔍 Filter provinsi (support multiple)
        if ($province) {
            $provinces = is_array($province) ? $province : [$province];
            if (count($provinces) > 0) {
                $query->whereHas('seller', function ($s) use ($provinces) {
                    $s->whereIn('picProvince', $provinces);
                });
            }
        }

        // Ambil produk setelah semua filter diterapkan
        $products = $query->latest()->get()->map(function (Product $product) {
            $images = $product->images ?? [];
            $imageUrls = array_map(function ($img) {
                return '/storage/' . $img;
            }, $images);
            $firstImage = count($imageUrls) > 0 ? $imageUrls[0] : null;

            return [
                'id'            => $product->id,
                'name'          => $product->name,
                'category'      => $product->category,
                'condition'     => $product->condition, // BARU / BEKAS
                'price'         => $product->price,
                'imageUrl'      => $firstImage,
                'images'        => $imageUrls, // Semua gambar untuk hover effect
                'storeName'     => $product->seller?->storeName,
                'location'      => trim(($product->seller->picCity ?? '') . ', ' . ($product->seller->picProvince ?? ''), ', '),
                'ratingAverage' => $product->reviews_avg_rating
                    ? round($product->reviews_avg_rating, 1)
                    : null,
                'reviewCount'   => $product->reviews_count,
            ];
        });

        // Daftar kategori dari config (bukan dari database)
        $categories = config('product_categories');

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

        // Normalize filters untuk frontend (pastikan array)
        $normalizedCategory = $category;
        if ($category && !is_array($category)) {
            $normalizedCategory = [$category];
        }
        
        $normalizedCity = $city;
        if ($city && !is_array($city)) {
            $normalizedCity = [$city];
        }
        
        $normalizedProvince = $province;
        if ($province && !is_array($province)) {
            $normalizedProvince = [$province];
        }

        // Data banners promo - otomatis membaca gambar dari public/images/banners/
        $banners = $this->getBanners();

        // Statistik untuk hero section
        $totalProducts = Product::where('status', 'ACTIVE')
            ->whereHas('seller', function ($q) {
                $q->where('status', 'ACTIVE');
            })
            ->count();
        
        $totalSellers = \App\Models\Seller::where('status', 'ACTIVE')->count();
        
        $totalReviews = \App\Models\Review::whereHas('product', function ($q) {
            $q->where('status', 'ACTIVE')
              ->whereHas('seller', function ($sq) {
                  $sq->where('status', 'ACTIVE');
              });
        })->count();
        
        $avgRating = Product::where('status', 'ACTIVE')
            ->whereHas('seller', function ($q) {
                $q->where('status', 'ACTIVE');
            })
            ->withAvg('reviews', 'rating')
            ->get()
            ->filter(fn($p) => $p->reviews_avg_rating > 0)
            ->avg('reviews_avg_rating');

        return Inertia::render('Dashboard', [
            'products'   => $products,
            'filters'    => [
                'q'         => $q,
                'category'  => $normalizedCategory,
                'city'      => $normalizedCity,
                'province'  => $normalizedProvince,
                'condition' => $condition,
            ],
            'categories' => $categories,
            'cities'     => $cities,
            'provinces'  => $provinces,
            'banners'    => $banners,
            'stats'      => [
                'totalProducts' => $totalProducts,
                'totalSellers'  => $totalSellers,
                'totalReviews'  => $totalReviews,
                'avgRating'     => $avgRating ? round($avgRating, 1) : 0,
            ],
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
                'condition'     => $product->condition, // ← tampilkan juga di detail
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

    /**
     * Ambil data banners promo dari folder public/images/banners/
     * Otomatis membaca file: promo1.jpg, promo2.jpg, promo3.jpg, dll
     */
    private function getBanners(): array
    {
        $banners = [];
        $bannerPath = public_path('images/banners');
        
        // Pastikan folder ada
        if (!is_dir($bannerPath)) {
            return $banners;
        }

        // Cari file promo1.jpg, promo2.jpg, promo3.jpg, dll (maksimal 10)
        for ($i = 1; $i <= 10; $i++) {
            $imageName = "promo{$i}.jpg";
            $imagePath = $bannerPath . '/' . $imageName;
            
            // Cek apakah file ada
            if (file_exists($imagePath)) {
                $banners[] = [
                    'image' => asset("images/banners/{$imageName}"),
                    'alt' => "Promo {$i}",
                    'url' => null, // Bisa diubah jika ingin menambahkan link
                ];
            }
        }

        // Juga cek format lain: promo1.png, promo1.webp
        $extensions = ['png', 'webp', 'jpeg'];
        for ($i = 1; $i <= 10; $i++) {
            foreach ($extensions as $ext) {
                $imageName = "promo{$i}.{$ext}";
                $imagePath = $bannerPath . '/' . $imageName;
                
                if (file_exists($imagePath)) {
                    // Cek apakah sudah ada di array (jangan duplikat)
                    $exists = false;
                    foreach ($banners as $banner) {
                        if (str_contains($banner['image'], "promo{$i}")) {
                            $exists = true;
                            break;
                        }
                    }
                    
                    if (!$exists) {
                        $banners[] = [
                            'image' => asset("images/banners/{$imageName}"),
                            'alt' => "Promo {$i}",
                            'url' => null,
                        ];
                    }
                }
            }
        }

        return $banners;
    }
}
