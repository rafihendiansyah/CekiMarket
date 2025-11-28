import { Link, usePage } from "@inertiajs/react";

export default function Dashboard({
    products = [],
    filters = {},
    categories = [],
    cities = [],
    provinces = [],
}) {
    const { auth, flash } = usePage().props;

    const formatRupiah = (value) => {
        return new Intl.NumberFormat("id-ID", {
            style: "currency",
            currency: "IDR",
            minimumFractionDigits: 0,
        }).format(value);
    };

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Navbar */}
            <nav className="flex items-center justify-between px-6 py-4 border-b bg-white">
                <div className="font-bold text-lg" style={{ color: "#335c67" }}>
                    CekiCekiMart
                </div>

                <div className="flex items-center gap-4">
                    {/* Jika Platform Admin */}
                    {auth?.user?.role === "platform_admin" && (
                        <Link
                            href={route("admin.sellers.index")}
                            className="px-3 py-1 rounded text-white text-sm"
                            style={{ backgroundColor: "#335c67" }}
                        >
                            Panel Platform Admin
                        </Link>
                    )}

                    {/* Jika Penjual */}
                    {auth?.user?.role === "penjual" && (
                        <>
                            <Link
                                href={route("seller.register")}
                                className="text-sm underline text-[#335c67]"
                            >
                                Lengkapi Data Toko
                            </Link>
                            <Link
                                href={route("seller.products.index")}
                                className="text-sm text-white px-3 py-1 rounded"
                                style={{ backgroundColor: "#335c67" }}
                            >
                                Kelola Produk
                            </Link>
                        </>
                    )}

                    {/* Kanan: Login / Register / Logout */}
                    {auth.user ? (
                        <>
                            <span className="text-sm text-gray-700">
                                Hai, {auth.user.name}
                            </span>
                            <Link
                                href={route("logout")}
                                method="post"
                                as="button"
                                className="text-sm text-gray-600 hover:underline"
                            >
                                Logout
                            </Link>
                        </>
                    ) : (
                        <>
                            <Link
                                href={route("login")}
                                className="text-sm text-gray-700 hover:underline"
                            >
                                Login
                            </Link>
                            <Link
                                href={route("register")}
                                className="text-sm text-white px-3 py-1 rounded"
                                style={{ backgroundColor: "#335c67" }}
                            >
                                Daftar Penjual
                            </Link>
                        </>
                    )}
                </div>
            </nav>

            {/* Banner atas */}
            <div className="px-6 py-6 bg-white border-b">
                <h1 className="text-2xl font-bold text-gray-800">
                    Selamat Datang di CekiCekiMart
                </h1>
                <p className="text-sm text-gray-600 mt-1">
                    Platform jual beli Terbaik.
                </p>
            </div>

            {/* Search & Filter */}
            <div className="max-w-6xl mx-auto mt-4 px-4">
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

                        {/* Tombol apply + reset */}
                        <div className="md:col-span-4 flex items-center justify-end gap-3">
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

            {/* Flash message */}
            {flash?.success && (
                <div className="max-w-6xl mx-auto mt-4 px-4">
                    <div className="rounded border border-emerald-300 bg-emerald-50 px-4 py-2 text-sm text-emerald-800">
                        {flash.success}
                    </div>
                </div>
            )}
            {flash?.error && (
                <div className="max-w-6xl mx-auto mt-4 px-4">
                    <div className="rounded border border-red-300 bg-red-50 px-4 py-2 text-sm text-red-800">
                        {flash.error}
                    </div>
                </div>
            )}

            {/* Katalog Produk */}
            <div className="max-w-6xl mx-auto px-4 py-6">
                <h2 className="text-lg font-semibold text-gray-800 mb-4">
                    Produk Terbaru
                </h2>

                {products.length === 0 ? (
                    <p className="text-sm text-gray-500">
                        Belum ada produk yang dipublikasikan. Penjual dengan
                        toko ACTIVE dapat mulai menambahkan produk.
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

                                    {/* Rating & jumlah ulasan */}
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
                                        {product.storeName || "Toko"}
                                    </div>
                                    {product.location && (
                                        <div className="text-xs text-gray-400">
                                            {product.location}
                                        </div>
                                    )}
                                </div>
                            </Link>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
