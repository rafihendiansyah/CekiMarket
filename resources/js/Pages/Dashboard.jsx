import { Link, usePage } from "@inertiajs/react";
import AppLayout from "@/Layouts/AppLayout";

export default function Dashboard({
    products = [],
    filters = {},
    categories = [],
    cities = [],
    provinces = [],
}) {
    const { flash } = usePage().props;

    const formatRupiah = (value) =>
        new Intl.NumberFormat("id-ID", {
            style: "currency",
            currency: "IDR",
            minimumFractionDigits: 0,
        }).format(value);

    return (
        <AppLayout>
            {/* Search & Filter */}
            <div className="max-w-6xl mx-auto mt-6 px-4">
                <div className="bg-white p-4 rounded shadow">
                    <form
                        method="GET"
                        action={route("dashboard")}
                        className="grid md:grid-cols-4 gap-4 items-end"
                    >
                        {/* Search */}
                        <div className="md:col-span-2">
                            <label className="block text-xs font-semibold text-gray-600 mb-1">
                                Pencarian
                            </label>
                            <input
                                type="text"
                                name="q"
                                defaultValue={filters.q || ""}
                                placeholder="Cari produk, kategori, atau nama toko..."
                                className="w-full border-gray-300 rounded-md px-3 py-2 shadow-sm focus:ring-[#335c67] focus:border-[#335c67]"
                            />
                        </div>

                        {/* Kategori */}
                        <div>
                            <label className="block text-xs font-semibold text-gray-600 mb-1">
                                Kategori
                            </label>
                            <select
                                name="category"
                                defaultValue={filters.category || ""}
                                className="w-full border-gray-300 rounded-md px-3 py-2 shadow-sm focus:ring-[#335c67] focus:border-[#335c67]"
                            >
                                <option value="">Semua Kategori</option>
                                {categories.map((c, i) => (
                                    <option key={i} value={c}>
                                        {c}
                                    </option>
                                ))}
                            </select>
                        </div>

                        {/* Kota */}
                        <div>
                            <label className="block text-xs font-semibold text-gray-600 mb-1">
                                Kota
                            </label>
                            <select
                                name="city"
                                defaultValue={filters.city || ""}
                                className="w-full border-gray-300 rounded-md px-3 py-2 shadow-sm focus:ring-[#335c67] focus:border-[#335c67]"
                            >
                                <option value="">Semua Kota</option>
                                {cities.map((c, i) => (
                                    <option key={i} value={c}>
                                        {c}
                                    </option>
                                ))}
                            </select>
                        </div>

                        {/* Provinsi */}
                        <div>
                            <label className="block text-xs font-semibold text-gray-600 mb-1">
                                Provinsi
                            </label>
                            <select
                                name="province"
                                defaultValue={filters.province || ""}
                                className="w-full border-gray-300 rounded-md px-3 py-2 shadow-sm focus:ring-[#335c67] focus:border-[#335c67]"
                            >
                                <option value="">Semua Provinsi</option>
                                {provinces.map((p, i) => (
                                    <option key={i} value={p}>
                                        {p}
                                    </option>
                                ))}
                            </select>
                        </div>

                        {/* Buttons */}
                        <div className="md:col-span-4 flex justify-end gap-3">
                            <button
                                type="submit"
                                className="px-4 py-2 rounded text-sm font-semibold text-white"
                                style={{ backgroundColor: "#335c67" }}
                            >
                                Terapkan
                            </button>
                            <Link
                                href={route("dashboard")}
                                className="text-sm text-gray-500 underline"
                            >
                                Reset
                            </Link>
                        </div>
                    </form>
                </div>
            </div>

            {/* Flash Message */}
            {flash?.success && (
                <div className="max-w-6xl mx-auto mt-4 px-4">
                    <div className="rounded border border-emerald-300 bg-emerald-50 px-4 py-2 text-sm text-emerald-800">
                        {flash.success}
                    </div>
                </div>
            )}

            {/* Produk */}
            <div className="max-w-6xl mx-auto px-4 py-6">
                <h2 className="text-lg font-semibold text-gray-800 mb-4">
                    Produk Terbaru
                </h2>

                {products.length === 0 ? (
                    <p className="text-sm text-gray-500">
                        Belum ada produk yang dipublikasikan.
                    </p>
                ) : (
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                        {products.map((product) => (
                            <Link
                                key={product.id}
                                href={route("products.show", product.id)}
                                className="bg-white rounded-lg shadow-sm border hover:shadow-md transition overflow-hidden"
                            >
                                <div className="w-full h-36 bg-gray-100 flex items-center justify-center overflow-hidden">
                                    {product.imageUrl ? (
                                        <img
                                            src={product.imageUrl}
                                            alt={product.name}
                                            className="w-full h-full object-cover"
                                        />
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

                                    {product.ratingAverage &&
                                        product.reviewCount > 0 && (
                                            <div className="flex items-center text-xs text-gray-600 mb-1">
                                                <span className="mr-1 text-yellow-500">
                                                    ★
                                                </span>
                                                <span>
                                                    {product.ratingAverage}
                                                </span>
                                                <span className="ml-1 text-gray-400">
                                                    ({product.reviewCount}{" "}
                                                    ulasan)
                                                </span>
                                            </div>
                                        )}

                                    <div className="text-sm font-bold text-[#335c67] mb-1">
                                        {formatRupiah(product.price)}
                                    </div>
                                    <div className="text-xs text-gray-500">
                                        {product.storeName}
                                    </div>
                                    <div className="text-xs text-gray-400">
                                        {product.location}
                                    </div>
                                </div>
                            </Link>
                        ))}
                    </div>
                )}
            </div>
        </AppLayout>
    );
}
