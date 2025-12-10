import React, { useState } from "react";
import { Link, usePage, router } from "@inertiajs/react";
import AppLayout from "@/Layouts/AppLayout";
import FlashModal from "@/Components/FlashModal";
import PromoCarousel from "@/Components/PromoCarousel";

// Komponen ProductCard dengan hover effect
function ProductCard({ product, formatRupiah }) {
    const [currentImageIndex, setCurrentImageIndex] = useState(0);
    const images =
        product.images || (product.imageUrl ? [product.imageUrl] : []);
    const hasMultipleImages = images.length > 1;

    const handleMouseEnter = () => {
        if (hasMultipleImages && currentImageIndex === 0) {
            setCurrentImageIndex(1);
        }
    };

    const handleMouseLeave = () => {
        if (hasMultipleImages) {
            setCurrentImageIndex(0);
        }
    };

    return (
        <Link
            href={route("products.show", product.id)}
            className="bg-white rounded-lg shadow-sm border hover:shadow-md transition overflow-hidden"
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
        >
            <div className="w-full h-36 bg-gray-100 flex items-center justify-center overflow-hidden relative">
                {images.length > 0 ? (
                    <>
                        {/* Container untuk semua gambar dengan absolute positioning */}
                        <div className="relative w-full h-full">
                            {images.map((img, idx) => (
                                <img
                                    key={idx}
                                    src={img}
                                    alt={`${product.name} - ${idx + 1}`}
                                    className={`absolute inset-0 w-full h-full object-contain transition-opacity duration-500 ${
                                        idx === currentImageIndex
                                            ? "opacity-100 z-10"
                                            : "opacity-0 z-0"
                                    }`}
                                />
                            ))}
                        </div>
                        {hasMultipleImages && (
                            <div className="absolute bottom-2 right-2 bg-black/50 text-white text-xs px-2 py-1 rounded z-20">
                                {images.length} foto
                            </div>
                        )}
                    </>
                ) : (
                    <span className="text-xs text-gray-400">
                        Tidak ada gambar
                    </span>
                )}
            </div>
            <div className="p-3">
                <div className="text-sm font-semibold text-gray-900 line-clamp-2 mb-1">
                    {product.name}
                </div>

                {product.ratingAverage && product.reviewCount > 0 && (
                    <div className="flex items-center text-xs text-gray-600 mb-1">
                        <span className="mr-1 text-yellow-500">★</span>
                        <span>{product.ratingAverage}</span>
                        <span className="ml-1 text-gray-400">
                            ({product.reviewCount} ulasan)
                        </span>
                    </div>
                )}

                <div className="text-sm font-bold text-dark-slate mb-1">
                    {formatRupiah(product.price)}
                </div>
                <div className="text-xs text-gray-500">{product.storeName}</div>
                <div className="text-xs text-gray-400">{product.location}</div>
            </div>
        </Link>
    );
}

export default function Dashboard({
    products = [],
    filters = {},
    categories = [],
    cities = [],
    provinces = [],
    banners = [],
    stats = { totalProducts: 0, totalSellers: 0, totalReviews: 0, avgRating: 0 },
}) {
    const { flash } = usePage().props;
    const [showFlash, setShowFlash] = useState(true);
    // Parse filters dari URL (bisa array atau string)
    const parseFilter = (filter) => {
        if (!filter) return [];
        if (Array.isArray(filter)) return filter;
        return [filter];
    };

    const [selectedCategories, setSelectedCategories] = useState(() =>
        parseFilter(filters.category)
    );
    const [selectedCondition, setSelectedCondition] = useState(
        filters.condition || ""
    );
    const [selectedCities, setSelectedCities] = useState(() =>
        parseFilter(filters.city)
    );
    const [selectedProvinces, setSelectedProvinces] = useState(() =>
        parseFilter(filters.province)
    );

    const formatRupiah = (value) =>
        new Intl.NumberFormat("id-ID", {
            style: "currency",
            currency: "IDR",
            minimumFractionDigits: 0,
        }).format(value);

    const handleCategoryToggle = (category) => {
        const newCategories = selectedCategories.includes(category)
            ? selectedCategories.filter((c) => c !== category)
            : [...selectedCategories, category];
        setSelectedCategories(newCategories);
        applyFilters({ category: newCategories });
    };

    const handleConditionToggle = (condition) => {
        const newCondition = selectedCondition === condition ? "" : condition;
        setSelectedCondition(newCondition);
        applyFilters({ condition: newCondition });
    };

    const handleCityToggle = (city) => {
        const newCities = selectedCities.includes(city)
            ? selectedCities.filter((c) => c !== city)
            : [...selectedCities, city];
        setSelectedCities(newCities);
        applyFilters({ city: newCities });
    };

    const handleProvinceToggle = (province) => {
        const newProvinces = selectedProvinces.includes(province)
            ? selectedProvinces.filter((p) => p !== province)
            : [...selectedProvinces, province];
        setSelectedProvinces(newProvinces);
        applyFilters({ province: newProvinces });
    };

    const removeFilter = (type, value) => {
        switch (type) {
            case "category":
                setSelectedCategories(
                    selectedCategories.filter((c) => c !== value)
                );
                applyFilters({
                    category: selectedCategories.filter((c) => c !== value),
                });
                break;
            case "condition":
                setSelectedCondition("");
                applyFilters({ condition: "" });
                break;
            case "city":
                setSelectedCities(selectedCities.filter((c) => c !== value));
                applyFilters({
                    city: selectedCities.filter((c) => c !== value),
                });
                break;
            case "province":
                setSelectedProvinces(
                    selectedProvinces.filter((p) => p !== value)
                );
                applyFilters({
                    province: selectedProvinces.filter((p) => p !== value),
                });
                break;
        }
    };

    const clearAllFilters = () => {
        setSelectedCategories([]);
        setSelectedCondition("");
        setSelectedCities([]);
        setSelectedProvinces([]);
        router.get(
            route("dashboard"),
            { q: filters.q || null },
            { preserveState: true }
        );
    };

    const applyFilters = (newFilters) => {
        const params = {
            q: filters.q || "",
        };

        // Merge dengan filter baru
        const mergedFilters = {
            ...filters,
            ...newFilters,
        };

        // Add filters ke params dengan format yang benar
        if (mergedFilters.category && mergedFilters.category.length > 0) {
            params.category = mergedFilters.category;
        }
        if (mergedFilters.condition) {
            params.condition = mergedFilters.condition;
        }
        if (mergedFilters.city && mergedFilters.city.length > 0) {
            params.city = mergedFilters.city;
        }
        if (mergedFilters.province && mergedFilters.province.length > 0) {
            params.province = mergedFilters.province;
        }

        router.get(route("dashboard"), params, { preserveState: true });
    };

    // Collect all active filters for display
    const activeFilters = [];
    selectedCategories.forEach((cat) => {
        activeFilters.push({ type: "category", value: cat, label: cat });
    });
    if (selectedCondition) {
        activeFilters.push({
            type: "condition",
            value: selectedCondition,
            label: selectedCondition === "BARU" ? "Baru" : "Bekas",
        });
    }
    selectedCities.forEach((city) => {
        activeFilters.push({ type: "city", value: city, label: city });
    });
    selectedProvinces.forEach((province) => {
        activeFilters.push({
            type: "province",
            value: province,
            label: province,
        });
    });

    return (
        <AppLayout>
            <div className="max-w-7xl mx-auto px-4 py-6">
                {/* Carousel Promo */}
                {banners.length > 0 && <PromoCarousel banners={banners} />}
                
                {/* Hero Stats Section */}
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 mb-6">
                    <div className="text-center mb-6">
                        <h2 className="text-2xl font-bold text-dark-slate mb-2">
                            Marketplace Terpercaya untuk Semua Kebutuhanmu
                        </h2>
                        <p className="text-gray-600">
                            Temukan produk berkualitas dari penjual terverifikasi di seluruh Indonesia
                        </p>
                    </div>
                    <div className="flex items-center justify-center gap-12">
                        <div className="text-center">
                            <div className="w-16 h-16 bg-dark-slate rounded-lg flex items-center justify-center mx-auto mb-3">
                                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                                </svg>
                            </div>
                            <div className="text-3xl font-bold text-dark-slate mb-1">{stats.totalProducts}+</div>
                            <div className="text-sm text-gray-600">Produk Tersedia</div>
                        </div>
                        <div className="text-center">
                            <div className="w-16 h-16 bg-dark-slate rounded-lg flex items-center justify-center mx-auto mb-3">
                                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                                </svg>
                            </div>
                            <div className="text-3xl font-bold text-dark-slate mb-1">{stats.totalSellers}+</div>
                            <div className="text-sm text-gray-600">Penjual Terpercaya</div>
                        </div>
                        <div className="text-center">
                            <div className="w-16 h-16 bg-dark-slate rounded-lg flex items-center justify-center mx-auto mb-3">
                                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                                </svg>
                            </div>
                            <div className="text-3xl font-bold text-dark-slate mb-1">{stats.totalReviews}+</div>
                            <div className="text-sm text-gray-600">Ulasan & Rating</div>
                        </div>
                    </div>
                </div>
                
                <div className="flex gap-6">
                    {/* Sidebar Filter - Kiri */}
                    <aside className="w-64 flex-shrink-0">
                        <div className="bg-white rounded-lg shadow-sm border border-gray-200 sticky top-24">
                            <form method="GET" action={route("dashboard")}>
                                <div className="p-4 space-y-6">
                                    {/* Kategori */}
                                    <div>
                                        <h3 className="text-sm font-semibold text-gray-900 mb-3">
                                            Kategori
                                        </h3>
                                        <div className="space-y-2 max-h-64 overflow-y-auto">
                                            {categories.map((category, i) => (
                                                <label
                                                    key={i}
                                                    className="flex items-center gap-2 cursor-pointer hover:bg-gray-50 p-2 rounded"
                                                >
                                                    <input
                                                        type="checkbox"
                                                        name="category"
                                                        value={category}
                                                        checked={selectedCategories.includes(
                                                            category
                                                        )}
                                                        onChange={() =>
                                                            handleCategoryToggle(
                                                                category
                                                            )
                                                        }
                                                        className="w-4 h-4 text-dark-slate border-gray-300 rounded focus:ring-dark-slate"
                                                    />
                                                    <span className="text-sm text-gray-700">
                                                        {category}
                                                    </span>
                                                </label>
                                            ))}
                                        </div>
                                    </div>

                                    {/* Divider */}
                                    <div className="border-t border-gray-200"></div>

                                    {/* Kondisi */}
                                    <div>
                                        <h3 className="text-sm font-semibold text-gray-900 mb-3">
                                            Kondisi
                                        </h3>
                                        <div className="space-y-2">
                                            {["BARU", "BEKAS"].map(
                                                (condition) => (
                                                    <label
                                                        key={condition}
                                                        className="flex items-center gap-2 cursor-pointer hover:bg-gray-50 p-2 rounded"
                                                    >
                                                        <input
                                                            type="radio"
                                                            name="condition"
                                                            value={condition}
                                                            checked={
                                                                selectedCondition ===
                                                                condition
                                                            }
                                                            onChange={() =>
                                                                handleConditionToggle(
                                                                    condition
                                                                )
                                                            }
                                                            className="w-4 h-4 text-dark-slate border-gray-300 focus:ring-dark-slate"
                                                        />
                                                        <span className="text-sm text-gray-700">
                                                            {condition ===
                                                            "BARU"
                                                                ? "Baru"
                                                                : "Bekas"}
                                                        </span>
                                                    </label>
                                                )
                                            )}
                                        </div>
                                    </div>

                                    {/* Divider */}
                                    <div className="border-t border-gray-200"></div>

                                    {/* Kota */}
                                    {cities.length > 0 && (
                                        <>
                                            <div>
                                                <h3 className="text-sm font-semibold text-gray-900 mb-3">
                                                    Kota
                                                </h3>
                                                <div className="space-y-2 max-h-64 overflow-y-auto">
                                                    {cities.map((city, i) => (
                                                        <label
                                                            key={i}
                                                            className="flex items-center gap-2 cursor-pointer hover:bg-gray-50 p-2 rounded"
                                                        >
                                                            <input
                                                                type="checkbox"
                                                                name="city"
                                                                value={city}
                                                                checked={selectedCities.includes(
                                                                    city
                                                                )}
                                                                onChange={() =>
                                                                    handleCityToggle(
                                                                        city
                                                                    )
                                                                }
                                                                className="w-4 h-4 text-dark-slate border-gray-300 rounded focus:ring-dark-slate"
                                                            />
                                                            <span className="text-sm text-gray-700">
                                                                {city}
                                                            </span>
                                                        </label>
                                                    ))}
                                                </div>
                                            </div>

                                            {/* Divider */}
                                            <div className="border-t border-gray-200"></div>
                                        </>
                                    )}

                                    {/* Provinsi */}
                                    {provinces.length > 0 && (
                                        <div>
                                            <h3 className="text-sm font-semibold text-gray-900 mb-3">
                                                Provinsi
                                            </h3>
                                            <div className="space-y-2 max-h-64 overflow-y-auto">
                                                {provinces.map(
                                                    (province, i) => (
                                                        <label
                                                            key={i}
                                                            className="flex items-center gap-2 cursor-pointer hover:bg-gray-50 p-2 rounded"
                                                        >
                                                            <input
                                                                type="checkbox"
                                                                name="province"
                                                                value={province}
                                                                checked={selectedProvinces.includes(
                                                                    province
                                                                )}
                                                                onChange={() =>
                                                                    handleProvinceToggle(
                                                                        province
                                                                    )
                                                                }
                                                                className="w-4 h-4 text-dark-slate border-gray-300 rounded focus:ring-dark-slate"
                                                            />
                                                            <span className="text-sm text-gray-700">
                                                                {province}
                                                            </span>
                                                        </label>
                                                    )
                                                )}
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </form>
                        </div>
                    </aside>

                    {/* Modal besar di tengah */}
                    {flash?.success && showFlash && (
                        <FlashModal
                            message={flash.success}
                            type="success"
                            onClose={() => setShowFlash(false)}
                        />
                    )}

                    {flash?.error && showFlash && (
                        <FlashModal
                            message={flash.error}
                            type="error"
                            onClose={() => setShowFlash(false)}
                        />
                    )}

                    {/* Produk - Kanan */}
                    <div className="flex-1">
                        {/* Filter Terpasang */}
                        {activeFilters.length > 0 && (
                            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 mb-4">
                                <div className="flex items-center gap-2 flex-wrap">
                                    <span className="text-sm font-semibold text-gray-700">
                                        Filter Terpasang:
                                    </span>
                                    {activeFilters.map((filter, idx) => (
                                        <div
                                            key={idx}
                                            className="flex items-center gap-1 px-3 py-1.5 bg-gray-100 rounded-md border border-gray-300"
                                        >
                                            <span className="text-xs text-gray-700">
                                                {filter.label}
                                            </span>
                                            <button
                                                type="button"
                                                onClick={() =>
                                                    removeFilter(
                                                        filter.type,
                                                        filter.value
                                                    )
                                                }
                                                className="ml-1 text-gray-500 hover:text-gray-700 transition"
                                            >
                                                <svg
                                                    className="w-4 h-4"
                                                    fill="none"
                                                    stroke="currentColor"
                                                    viewBox="0 0 24 24"
                                                >
                                                    <path
                                                        strokeLinecap="round"
                                                        strokeLinejoin="round"
                                                        strokeWidth={2}
                                                        d="M6 18L18 6M6 6l12 12"
                                                    />
                                                </svg>
                                            </button>
                                        </div>
                                    ))}
                                    <button
                                        type="button"
                                        onClick={clearAllFilters}
                                        className="text-xs text-dark-slate hover:underline font-medium ml-2"
                                    >
                                        Hapus Semua
                                    </button>
                                </div>
                            </div>
                        )}

                        <h2 className="text-lg font-semibold text-gray-800 mb-4">
                            Produk Terbaru
                        </h2>

                        {products.length === 0 ? (
                            <p className="text-sm text-gray-500">
                                Belum ada produk yang dipublikasikan.
                            </p>
                        ) : (
                            <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 gap-8 lg:gap-12 xl:gap-16">
                                {products.map((product) => (
                                    <ProductCard
                                        key={product.id}
                                        product={product}
                                        formatRupiah={formatRupiah}
                                    />
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
