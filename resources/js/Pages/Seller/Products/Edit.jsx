import { Head, Link, useForm } from "@inertiajs/react";

export default function EditProduct({ product }) {
    const { data, setData, post, processing, errors } = useForm({
        name: product.name || "",
        category: product.category || "",
        price: product.price || "",
        stock: product.stock || "",
        description: product.description || "",
        images: [],
    });

    const submit = (e) => {
        e.preventDefault();
        post(route("seller.products.update", product.id), {
            forceFormData: true,
        });
    };

    const handleImagesChange = (e) => {
        const files = Array.from(e.target.files).slice(0, 5);
        setData("images", files);
    };

    // Format angka dengan separator ribuan (. untuk Indonesia)
    const formatCurrency = (value) => {
        if (!value) return "";
        const numValue = value.toString().replace(/\D/g, "");
        return numValue.replace(/\B(?=(\d{3})+(?!\d))/g, ".");
    };

    // Handle perubahan input harga
    const handlePriceChange = (e) => {
        const value = e.target.value;
        // Hanya simpan angka, tanpa separator
        const numValue = value.replace(/\D/g, "");
        setData("price", numValue);
    };

    return (
        <>
            <Head title={`Edit Produk - ${product.name}`} />

            <div className="min-h-screen bg-gray-50 py-10">
                <div className="max-w-3xl mx-auto bg-white shadow rounded-lg p-8">
                    <div className="flex items-center justify-between mb-4">
                        <h1 className="text-2xl font-bold text-[#335c67]">
                            Edit Produk
                        </h1>
                        <Link
                            href={route("seller.products.index")}
                            className="text-sm text-gray-600 hover:underline"
                        >
                            &larr; Kembali ke daftar produk
                        </Link>
                    </div>

                    <form
                        onSubmit={submit}
                        encType="multipart/form-data"
                        className="space-y-5"
                    >
                        <div>
                            <label className="block text-sm font-medium text-gray-700">
                                Nama Produk*
                            </label>
                            <input
                                type="text"
                                value={data.name}
                                onChange={(e) =>
                                    setData("name", e.target.value)
                                }
                                className="mt-1 w-full border-gray-300 rounded-md shadow-sm focus:ring-[#335c67] focus:border-[#335c67]"
                            />
                            {errors.name && (
                                <p className="text-sm text-red-600 mt-1">
                                    {errors.name}
                                </p>
                            )}
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700">
                                Kategori*
                            </label>
                            <input
                                type="text"
                                value={data.category}
                                onChange={(e) =>
                                    setData("category", e.target.value)
                                }
                                className="mt-1 w-full border-gray-300 rounded-md shadow-sm focus:ring-[#335c67] focus:border-[#335c67]"
                            />
                            {errors.category && (
                                <p className="text-sm text-red-600 mt-1">
                                    {errors.category}
                                </p>
                            )}
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700">
                                    Harga (Rp)*
                                </label>
                                <input
                                    type="text"
                                    inputMode="numeric"
                                    value={formatCurrency(data.price)}
                                    onChange={handlePriceChange}
                                    className="mt-1 w-full border-gray-300 rounded-md shadow-sm focus:ring-[#335c67] focus:border-[#335c67]"
                                />
                                {errors.price && (
                                    <p className="text-sm text-red-600 mt-1">
                                        {errors.price}
                                    </p>
                                )}
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700">
                                    Stok*
                                </label>
                                <input
                                    type="number"
                                    min="0"
                                    value={data.stock}
                                    onChange={(e) =>
                                        setData("stock", e.target.value)
                                    }
                                    className="mt-1 w-full border-gray-300 rounded-md shadow-sm focus:ring-[#335c67] focus:border-[#335c67]"
                                />
                                {errors.stock && (
                                    <p className="text-sm text-red-600 mt-1">
                                        {errors.stock}
                                    </p>
                                )}
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700">
                                Deskripsi Produk
                            </label>
                            <textarea
                                rows="4"
                                value={data.description}
                                onChange={(e) =>
                                    setData("description", e.target.value)
                                }
                                className="mt-1 w-full border-gray-300 rounded-md shadow-sm focus:ring-[#335c67] focus:border-[#335c67]"
                            />
                            {errors.description && (
                                <p className="text-sm text-red-600 mt-1">
                                    {errors.description}
                                </p>
                            )}
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700">
                                Foto Produk Baru (opsional, max 5)
                            </label>
                            <input
                                type="file"
                                multiple
                                accept=".jpg,.jpeg,.png"
                                onChange={handleImagesChange}
                                className="mt-1 block w-full text-sm text-gray-700"
                            />
                            {errors.images && (
                                <p className="text-sm text-red-600 mt-1">
                                    {errors.images}
                                </p>
                            )}

                            {product.images && product.images.length > 0 && (
                                <div className="mt-3">
                                    <p className="text-xs text-gray-500 mb-1">
                                        Foto saat ini:
                                    </p>
                                    <div className="flex gap-2 flex-wrap">
                                        {product.images.map((img, idx) => (
                                            <img
                                                key={idx}
                                                src={`/storage/${img}`}
                                                alt={`Product ${idx}`}
                                                className="w-16 h-16 rounded object-cover border"
                                            />
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>

                        <div className="flex justify-end gap-3 pt-4 border-t">
                            <Link
                                href={route("seller.products.index")}
                                className="px-4 py-2 rounded-md border border-gray-300 text-gray-700 text-sm hover:bg-gray-100"
                            >
                                Batal
                            </Link>
                            <button
                                type="submit"
                                disabled={processing}
                                className="px-5 py-2 rounded-md text-sm font-semibold text-white"
                                style={{ backgroundColor: "#335c67" }}
                            >
                                {processing
                                    ? "Menyimpan..."
                                    : "Simpan Perubahan"}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </>
    );
}
