import { Head, Link, useForm, usePage } from "@inertiajs/react";
import { useState } from "react";

export default function ProductShow({ product, store, reviews }) {
    const { flash } = usePage().props;

    const { data, setData, post, processing, errors, reset } = useForm({
        visitor_name: "",
        visitor_phone: "",
        visitor_email: "",
        rating: 5,
        comment: "",
    });


    const submit = (e) => {
        e.preventDefault();
        post(route("products.reviews.store", product.id), {
            onSuccess: () => {
                reset("visitor_name", "visitor_phone", "visitor_email", "rating", "comment");
            },
        });
    };

    const formatRupiah = (value) => {
        return new Intl.NumberFormat("id-ID", {
            style: "currency",
            currency: "IDR",
            minimumFractionDigits: 0,
        }).format(value);
    };

    // ====== LOGIKA SLIDER / PILIH FOTO ======
    const [activeIndex, setActiveIndex] = useState(0);
    const hasImages = product.images && product.images.length > 0;
    const mainImage = hasImages ? product.images[activeIndex] : null;

    const goPrev = () => {
        if (!hasImages) return;
        setActiveIndex((prev) =>
            prev === 0 ? product.images.length - 1 : prev - 1
        );
    };

    const goNext = () => {
        if (!hasImages) return;
        setActiveIndex((prev) =>
            prev === product.images.length - 1 ? 0 : prev + 1
        );
    };

    const renderStars = (rating) => {
        const stars = [];
        for (let i = 1; i <= 5; i++) {
            stars.push(
                <span
                    key={i}
                    className={
                        i <= rating ? "text-yellow-500" : "text-gray-300"
                    }
                >
                    ★
                </span>
            );
        }
        return stars;
    };

    return (
        <>
            <Head title={product.name} />

            <div className="min-h-screen bg-gray-50 py-8">
                <div className="max-w-5xl mx-auto px-4">
                    <Link
                        href={route("dashboard")}
                        className="text-sm text-gray-600 hover:underline"
                    >
                        &larr; Kembali ke beranda
                    </Link>

                    {flash?.success && (
                        <div className="mt-3 rounded border border-emerald-300 bg-emerald-50 px-4 py-2 text-sm text-emerald-800">
                            {flash.success}
                        </div>
                    )}

                    <div className="mt-4 bg-white rounded-lg shadow p-6 grid md:grid-cols-2 gap-6">
                        {/* Gambar produk + slider */}
                        <div>
                            <div className="relative w-full h-64 bg-gray-100 flex items-center justify-center overflow-hidden rounded">
                                {mainImage ? (
                                    <>
                                        <img
                                            src={mainImage}
                                            alt={product.name}
                                            className="w-full h-full object-cover"
                                        />

                                        {/* Tombol kiri/kanan, hanya muncul kalau lebih dari 1 foto */}
                                        {product.images.length > 1 && (
                                            <>
                                                <button
                                                    type="button"
                                                    onClick={goPrev}
                                                    className="absolute left-2 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white text-gray-700 rounded-full w-8 h-8 flex items-center justify-center shadow"
                                                >
                                                    ‹
                                                </button>
                                                <button
                                                    type="button"
                                                    onClick={goNext}
                                                    className="absolute right-2 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white text-gray-700 rounded-full w-8 h-8 flex items-center justify-center shadow"
                                                >
                                                    ›
                                                </button>
                                            </>
                                        )}
                                    </>
                                ) : (
                                    <span className="text-xs text-gray-400">
                                        Tidak ada gambar
                                    </span>
                                )}
                            </div>

                            {/* Thumbnail foto-foto lain */}
                            {hasImages && product.images.length > 1 && (
                                <div className="mt-3 flex gap-2 flex-wrap">
                                    {product.images.map((img, idx) => (
                                        <button
                                            key={idx}
                                            type="button"
                                            onClick={() => setActiveIndex(idx)}
                                            className={`border rounded overflow-hidden w-16 h-16 ${
                                                idx === activeIndex
                                                    ? "ring-2 ring-[#335c67]"
                                                    : "opacity-80 hover:opacity-100"
                                            }`}
                                        >
                                            <img
                                                src={img}
                                                alt={`Gambar ${idx + 1}`}
                                                className="w-full h-full object-cover"
                                            />
                                        </button>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* Detail produk */}
                        <div>
                            <h1 className="text-xl font-bold text-gray-900 mb-2">
                                {product.name}
                            </h1>
                            <div className="text-sm text-gray-500 mb-2">
                                Kategori: {product.category}
                            </div>

                            {/* Ringkasan rating */}
                            {product.reviewCount > 0 && (
                                <div className="flex items-center gap-2 mb-3 text-sm">
                                    <div className="flex items-center">
                                        {renderStars(
                                            Math.round(product.ratingAverage)
                                        )}
                                    </div>
                                    <span className="font-semibold text-gray-800">
                                        {product.ratingAverage}/5
                                    </span>
                                    <span className="text-gray-500">
                                        ({product.reviewCount} ulasan)
                                    </span>
                                </div>
                            )}

                            <div className="text-2xl font-bold text-[#335c67] mb-3">
                                {formatRupiah(product.price)}
                            </div>
                            <div className="text-sm text-gray-700 mb-1">
                                Stok: {product.stock}
                            </div>
                            <div className="mt-4 text-sm text-gray-800">
                                <h2 className="font-semibold mb-1">
                                    Deskripsi Produk
                                </h2>
                                <p className="whitespace-pre-line">
                                    {product.description ||
                                        "Belum ada deskripsi."}
                                </p>
                            </div>

                            {/* Info toko */}
                            <div className="mt-6 border-t pt-4">
                                <h2 className="text-sm font-semibold text-gray-800 mb-2">
                                    Toko
                                </h2>
                                <div className="text-sm text-gray-800">
                                    {store.name}
                                </div>
                                {store.location && (
                                    <div className="text-xs text-gray-500">
                                        {store.location}
                                    </div>
                                )}
                                <div className="text-xs text-gray-500 mt-2">
                                    PIC: {store.picName} ({store.picPhone})
                                </div>
                                <div className="text-xs text-gray-500">
                                    Email: {store.picEmail}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Komentar & rating */}
                    <div className="mt-6 grid md:grid-cols-2 gap-6">
                        {/* Form komentar */}
                        <div className="bg-white rounded-lg shadow p-4">
                            <h2 className="text-sm font-semibold text-gray-800 mb-3">
                                Beri Komentar & Rating
                            </h2>
                            <form onSubmit={submit} className="space-y-3">
                                <div>
                                    <label className="block text-xs font-medium text-gray-700">
                                        Nama Anda*
                                    </label>
                                    <input
                                        type="text"
                                        value={data.visitor_name}
                                        onChange={(e) =>
                                            setData(
                                                "visitor_name",
                                                e.target.value
                                            )
                                        }
                                        className="mt-1 w-full border-gray-300 rounded-md shadow-sm focus:ring-[#335c67] focus:border-[#335c67]"
                                    />
                                    {errors.visitor_name && (
                                        <p className="text-xs text-red-600 mt-1">
                                            {errors.visitor_name}
                                        </p>
                                    )}
                                </div>

                                <div>
                                    <label className="block text-xs font-medium text-gray-700">
                                        Nomor HP*
                                    </label>
                                    <input
                                        type="text"
                                        value={data.visitor_phone}
                                        onChange={(e) => setData("visitor_phone", e.target.value)}
                                        className="mt-1 w-full border-gray-300 rounded-md shadow-sm focus:ring-[#335c67] focus:border-[#335c67]"
                                    />
                                    {errors.visitor_phone && (
                                        <p className="text-xs text-red-600 mt-1">{errors.visitor_phone}</p>
                                    )}
                                </div>

                                <div>
                                    <label className="block text-xs font-medium text-gray-700">
                                        Email*
                                    </label>
                                    <input
                                        type="email"
                                        value={data.visitor_email}
                                        onChange={(e) => setData("visitor_email", e.target.value)}
                                        className="mt-1 w-full border-gray-300 rounded-md shadow-sm focus:ring-[#335c67] focus:border-[#335c67]"
                                    />
                                    {errors.visitor_email && (
                                        <p className="text-xs text-red-600 mt-1">{errors.visitor_email}</p>
                                    )}
                                </div>

                                <div>
                                    <label className="block text-xs font-medium text-gray-700">
                                        Rating*
                                    </label>
                                    <select
                                        value={data.rating}
                                        onChange={(e) =>
                                            setData(
                                                "rating",
                                                parseInt(e.target.value, 10)
                                            )
                                        }
                                        className="mt-1 w-full border-gray-300 rounded-md shadow-sm focus:ring-[#335c67] focus:border-[#335c67] text-sm"
                                    >
                                        {[5, 4, 3, 2, 1].map((r) => (
                                            <option key={r} value={r}>
                                                {r} -{" "}
                                                {r === 5
                                                    ? "Sangat puas"
                                                    : r === 4
                                                    ? "Puas"
                                                    : r === 3
                                                    ? "Cukup"
                                                    : r === 2
                                                    ? "Kurang"
                                                    : "Buruk"}
                                            </option>
                                        ))}
                                    </select>
                                    {errors.rating && (
                                        <p className="text-xs text-red-600 mt-1">
                                            {errors.rating}
                                        </p>
                                    )}
                                </div>

                                <div>
                                    <label className="block text-xs font-medium text-gray-700">
                                        Komentar
                                    </label>
                                    <textarea
                                        rows="3"
                                        value={data.comment}
                                        onChange={(e) =>
                                            setData("comment", e.target.value)
                                        }
                                        className="mt-1 w-full border-gray-300 rounded-md shadow-sm focus:ring-[#335c67] focus:border-[#335c67] text-sm"
                                        placeholder="Ceritakan pengalaman Anda menggunakan produk ini..."
                                    />
                                    {errors.comment && (
                                        <p className="text-xs text-red-600 mt-1">
                                            {errors.comment}
                                        </p>
                                    )}
                                </div>

                                <div className="flex justify-end">
                                    <button
                                        type="submit"
                                        disabled={processing}
                                        className="px-4 py-2 rounded-md text-xs font-semibold text-white"
                                        style={{ backgroundColor: "#335c67" }}
                                    >
                                        {processing
                                            ? "Mengirim..."
                                            : "Kirim Komentar & Rating"}
                                    </button>
                                </div>
                            </form>
                        </div>

                        {/* Daftar komentar */}
                        <div className="bg-white rounded-lg shadow p-4">
                            <h2 className="text-sm font-semibold text-gray-800 mb-3">
                                Ulasan Pengunjung
                            </h2>

                            {reviews.length === 0 ? (
                                <p className="text-xs text-gray-500">
                                    Belum ada komentar. Jadilah yang pertama
                                    memberikan ulasan.
                                </p>
                            ) : (
                                <div className="space-y-3 max-h-80 overflow-y-auto">
                                    {reviews.map((review) => (
                                        <div
                                            key={review.id}
                                            className="border-b pb-2 last:border-b-0 last:pb-0"
                                        >
                                            <div className="flex items-center justify-between">
                                                <div className="text-xs font-semibold text-gray-800">
                                                    {review.visitor_name}
                                                </div>
                                                <div className="text-[10px] text-gray-400">
                                                    {review.date}
                                                </div>
                                            </div>
                                            <div className="flex items-center text-xs my-0.5">
                                                {renderStars(review.rating)}
                                                <span className="ml-1 text-gray-600">
                                                    {review.rating}/5
                                                </span>
                                            </div>
                                            {review.comment && (
                                                <div className="text-xs text-gray-700 mt-0.5">
                                                    {review.comment}
                                                </div>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}
