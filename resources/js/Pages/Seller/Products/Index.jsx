import { Head, Link, usePage, router } from "@inertiajs/react";

export default function ProductsIndex({ products }) {
    const { flash } = usePage().props;

    const handleDelete = (id) => {
        if (!confirm("Yakin ingin menghapus produk ini?")) return;
        router.delete(route("seller.products.destroy", id));
    };

    const handleToggleStatus = (id) => {
        router.post(route("seller.products.toggle-status", id));
    };

    const formatRupiah = (value) => {
        return new Intl.NumberFormat("id-ID", {
            style: "currency",
            currency: "IDR",
            minimumFractionDigits: 0,
        }).format(value);
    };

    return (
        <>
            <Head title="Produk Saya" />

            <div className="min-h-screen bg-gray-50 py-10">
                <div className="max-w-6xl mx-auto px-4">
                    <div className="flex items-center justify-between mb-6">
                        <div>
                            <h1 className="text-2xl font-bold text-[#335c67]">
                                Produk Toko Saya
                            </h1>
                            <p className="text-sm text-gray-600">
                                Kelola produk Anda seperti di Tokopedia: tambah,
                                edit, nonaktifkan.
                            </p>
                        </div>

                        <div className="flex gap-3">
                            <Link
                                href={route("dashboard")}
                                className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition"
                            >
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                                </svg>
                                Kembali ke Beranda
                            </Link>
                            <Link
                                href={route("seller.products.create")}
                                className="px-4 py-2 rounded text-sm font-semibold text-white"
                                style={{ backgroundColor: "#335c67" }}
                            >
                                + Tambah Produk
                            </Link>
                        </div>
                    </div>

                    {flash?.success && (
                        <div className="mb-4 rounded border border-emerald-300 bg-emerald-50 px-4 py-2 text-sm text-emerald-800">
                            {flash.success}
                        </div>
                    )}

                    {flash?.error && (
                        <div className="mb-4 rounded border border-red-300 bg-red-50 px-4 py-2 text-sm text-red-800">
                            {flash.error}
                        </div>
                    )}

                    <div className="bg-white shadow rounded-lg overflow-hidden">
                        <table className="min-w-full text-sm">
                            <thead className="bg-gray-100 border-b">
                                <tr>
                                    <th className="px-4 py-2 text-left">
                                        Produk
                                    </th>
                                    <th className="px-4 py-2 text-left">
                                        Kategori
                                    </th>
                                    <th className="px-4 py-2 text-left">
                                        Harga
                                    </th>
                                    <th className="px-4 py-2 text-left">
                                        Stok
                                    </th>
                                    <th className="px-4 py-2 text-left">
                                        Status
                                    </th>
                                    <th className="px-4 py-2 text-right">
                                        Aksi
                                    </th>
                                </tr>
                            </thead>
                            <tbody>
                                {products.length === 0 && (
                                    <tr>
                                        <td
                                            colSpan="6"
                                            className="px-4 py-6 text-center text-gray-500"
                                        >
                                            Belum ada produk. Tambahkan produk
                                            pertama Anda.
                                        </td>
                                    </tr>
                                )}

                                {products.map((product) => (
                                    <tr
                                        key={product.id}
                                        className="border-b last:border-b-0"
                                    >
                                        <td className="px-4 py-3 align-top flex items-center gap-3">
                                            {product.imageUrl && (
                                                <img
                                                    src={product.imageUrl}
                                                    alt={product.name}
                                                    className="w-14 h-14 rounded object-cover border"
                                                />
                                            )}
                                            <div>
                                                <div className="font-semibold text-gray-900">
                                                    {product.name}
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-4 py-3 align-top text-gray-700">
                                            {product.category}
                                        </td>
                                        <td className="px-4 py-3 align-top text-gray-700">
                                            {formatRupiah(product.price)}
                                        </td>
                                        <td className="px-4 py-3 align-top text-gray-700">
                                            {product.stock}
                                        </td>
                                        <td className="px-4 py-3 align-top">
                                            <span
                                                className={
                                                    "inline-flex items-center px-2 py-1 rounded-full border text-xs font-medium " +
                                                    (product.status === "ACTIVE"
                                                        ? "bg-emerald-50 text-emerald-700 border-emerald-300"
                                                        : "bg-gray-100 text-gray-600 border-gray-300")
                                                }
                                            >
                                                {product.status === "ACTIVE"
                                                    ? "AKTIF"
                                                    : "NONAKTIF"}
                                            </span>
                                        </td>
                                        <td className="px-4 py-3 align-top text-right">
                                            <div className="space-x-2">
                                                <button
                                                    onClick={() =>
                                                        handleToggleStatus(
                                                            product.id
                                                        )
                                                    }
                                                    className="px-3 py-1 rounded text-xs font-semibold border text-gray-700 bg-gray-50 hover:bg-gray-100"
                                                >
                                                    {product.status === "ACTIVE"
                                                        ? "Nonaktifkan"
                                                        : "Aktifkan"}
                                                </button>

                                                <Link
                                                    href={route(
                                                        "seller.products.edit",
                                                        product.id
                                                    )}
                                                    className="px-3 py-1 rounded text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700"
                                                >
                                                    Edit
                                                </Link>

                                                <button
                                                    onClick={() =>
                                                        handleDelete(product.id)
                                                    }
                                                    className="px-3 py-1 rounded text-xs font-semibold text-red-700 border border-red-300 bg-red-50"
                                                >
                                                    Hapus
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </>
    );
}
