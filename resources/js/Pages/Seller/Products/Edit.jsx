import { Head, Link, useForm } from "@inertiajs/react";
import { useState, useEffect } from "react";

export default function EditProduct({ product, categories = [] }) {
    // State untuk foto: existingImages adalah path string, newFiles adalah File objects
    const [existingImages, setExistingImages] = useState(product.images || []);
    const [newImageFiles, setNewImageFiles] = useState([]);
    const [thumbnailIndex, setThumbnailIndex] = useState(product.thumbnail_index ?? 0);

    const { data, setData, post, processing, errors } = useForm({
        name: product.name || "",
        category: product.category || "",
        condition: product.condition || "BARU",
        price: product.price || "",
        stock: product.stock || "",
        description: product.description || "",
        images: [],
        existingImages: [],
        imageOrder: [],
        thumbnailIndex: product.thumbnail_index ?? 0,
    });

    // Update existingImages saat product berubah
    useEffect(() => {
        setExistingImages(product.images || []);
        setThumbnailIndex(product.thumbnail_index ?? 0);
    }, [product]);

    // Sync existingImages dengan data.existingImages
    useEffect(() => {
        setData("existingImages", existingImages);
    }, [existingImages, setData]);

    // Sync newImageFiles dengan data.images
    useEffect(() => {
        setData("images", newImageFiles);
    }, [newImageFiles, setData]);

    // Sync thumbnailIndex dengan data.thumbnailIndex
    useEffect(() => {
        setData("thumbnailIndex", thumbnailIndex);
    }, [thumbnailIndex, setData]);

    const submit = (e) => {
        e.preventDefault();
        // Data sudah ter-sync via useEffect, langsung submit
        post(route("seller.products.update", product.id), {
            forceFormData: true,
        });
    };

    const handleImageAdd = (e) => {
        const files = Array.from(e.target.files);
        const totalImages = existingImages.length + newImageFiles.length;
        const remainingSlots = 5 - totalImages;
        const filesToAdd = files.slice(0, remainingSlots);
        
        setNewImageFiles(prev => [...prev, ...filesToAdd]);
        e.target.value = '';
    };

    const handleImageRemove = (index, isExisting = false) => {
        if (isExisting) {
            // Hapus dari existing images
            const newExisting = existingImages.filter((_, i) => i !== index);
            setExistingImages(newExisting);
            
            // Adjust thumbnail index
            if (thumbnailIndex >= newExisting.length) {
                setThumbnailIndex(Math.max(0, newExisting.length - 1));
            } else if (thumbnailIndex > index) {
                setThumbnailIndex(thumbnailIndex - 1);
            }
        } else {
            // Hapus dari new files
            const newFiles = newImageFiles.filter((_, i) => i !== index);
            setNewImageFiles(newFiles);
        }
    };

    const handleImageReorder = (fromIndex, toIndex, isExisting = false) => {
        if (isExisting) {
            const newImages = [...existingImages];
            const [moved] = newImages.splice(fromIndex, 1);
            newImages.splice(toIndex, 0, moved);
            setExistingImages(newImages);
            
            // Adjust thumbnail index
            if (thumbnailIndex === fromIndex) {
                setThumbnailIndex(toIndex);
            } else if (fromIndex < thumbnailIndex && toIndex >= thumbnailIndex) {
                setThumbnailIndex(thumbnailIndex - 1);
            } else if (fromIndex > thumbnailIndex && toIndex <= thumbnailIndex) {
                setThumbnailIndex(thumbnailIndex + 1);
            }
        } else {
            const newFiles = [...newImageFiles];
            const [moved] = newFiles.splice(fromIndex, 1);
            newFiles.splice(toIndex, 0, moved);
            setNewImageFiles(newFiles);
        }
    };

    const setAsThumbnail = (index, isExisting = false) => {
        if (isExisting) {
            setThumbnailIndex(index);
        } else {
            // Untuk new files, thumbnail index = existing length + index
            setThumbnailIndex(existingImages.length + index);
        }
    };

    const allImagesCount = existingImages.length + newImageFiles.length;

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
                            className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition"
                        >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                            </svg>
                            Kembali ke Daftar Produk
                        </Link>
                    </div>

                    <form
                        onSubmit={submit}
                        encType="multipart/form-data"
                        className="space-y-5"
                    >
                        {/* Nama Produk */}
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

                        {/* Kategori */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700">
                                Kategori*
                            </label>
                            <select
                                value={data.category}
                                onChange={(e) =>
                                    setData("category", e.target.value)
                                }
                                className="mt-1 w-full border-gray-300 rounded-md shadow-sm focus:ring-[#335c67] focus:border-[#335c67]"
                            >
                                <option value="">Pilih Kategori</option>
                                {categories.map((category, index) => (
                                    <option key={index} value={category}>
                                        {category}
                                    </option>
                                ))}
                            </select>
                            {errors.category && (
                                <p className="text-sm text-red-600 mt-1">
                                    {errors.category}
                                </p>
                            )}
                        </div>

                        {/* Kondisi Produk */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700">
                                Kondisi Produk*
                            </label>
                            <select
                                value={data.condition}
                                onChange={(e) =>
                                    setData("condition", e.target.value)
                                }
                                className="mt-1 w-full border-gray-300 rounded-md shadow-sm focus:ring-[#335c67] focus:border-[#335c67]"
                            >
                                <option value="BARU">Baru</option>
                                <option value="BEKAS">Bekas</option>
                            </select>
                            {errors.condition && (
                                <p className="text-sm text-red-600 mt-1">
                                    {errors.condition}
                                </p>
                            )}
                        </div>

                        {/* Harga & Stok */}
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

                        {/* Deskripsi */}
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

                        {/* Foto Produk */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Foto Produk (max 5, jpg/png, maks 4MB/ file)
                            </label>
                            
                            {/* Upload Input */}
                            {allImagesCount < 5 && (
                                <input
                                    type="file"
                                    accept=".jpg,.jpeg,.png"
                                    onChange={handleImageAdd}
                                    className="mt-1 block w-full text-sm text-gray-700 mb-3"
                                />
                            )}
                            <p className="text-xs text-gray-500 mb-3">
                                {allImagesCount}/5 foto. Upload satu-satu atau sekaligus.
                            </p>

                            {/* Preview Foto */}
                            {(existingImages.length > 0 || newImageFiles.length > 0) && (
                                <div className="space-y-3">
                                    <p className="text-xs font-medium text-gray-700">
                                        Klik foto untuk set sebagai tampilan utama di halaman home
                                    </p>
                                    <div className="grid grid-cols-5 gap-3">
                                        {/* Existing Images */}
                                        {existingImages.map((imgPath, index) => {
                                            const isThumbnail = index === thumbnailIndex;
                                            return (
                                                <div
                                                    key={`existing-${index}`}
                                                    className={`relative border-2 rounded-lg overflow-hidden ${
                                                        isThumbnail 
                                                            ? 'border-[#335c67] ring-2 ring-[#335c67]' 
                                                            : 'border-gray-300'
                                                    }`}
                                                >
                                                    <img
                                                        src={`/storage/${imgPath}`}
                                                        alt={`Existing ${index + 1}`}
                                                        className="w-full h-24 object-cover cursor-pointer"
                                                        onClick={() => setAsThumbnail(index, true)}
                                                        title="Klik untuk set sebagai foto utama"
                                                    />
                                                    {isThumbnail && (
                                                        <div className="absolute top-1 left-1 bg-[#335c67] text-white text-[10px] px-1 rounded">
                                                            Utama
                                                        </div>
                                                    )}
                                                    <button
                                                        type="button"
                                                        onClick={() => handleImageRemove(index, true)}
                                                        className="absolute top-1 right-1 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs hover:bg-red-600"
                                                        title="Hapus foto"
                                                    >
                                                        ×
                                                    </button>
                                                    {/* Tombol Reorder */}
                                                    <div className="absolute bottom-1 left-1 right-1 flex gap-1">
                                                        {index > 0 && (
                                                            <button
                                                                type="button"
                                                                onClick={() => handleImageReorder(index, index - 1, true)}
                                                                className="flex-1 bg-black bg-opacity-50 text-white text-[10px] py-0.5 rounded hover:bg-opacity-70"
                                                                title="Pindah ke kiri"
                                                            >
                                                                ←
                                                            </button>
                                                        )}
                                                        {index < existingImages.length - 1 && (
                                                            <button
                                                                type="button"
                                                                onClick={() => handleImageReorder(index, index + 1, true)}
                                                                className="flex-1 bg-black bg-opacity-50 text-white text-[10px] py-0.5 rounded hover:bg-opacity-70"
                                                                title="Pindah ke kanan"
                                                            >
                                                                →
                                                            </button>
                                                        )}
                                                    </div>
                                                </div>
                                            );
                                        })}
                                        
                                        {/* New Image Files */}
                                        {newImageFiles.map((file, index) => {
                                            const imageUrl = URL.createObjectURL(file);
                                            const globalIndex = existingImages.length + index;
                                            const isThumbnail = globalIndex === thumbnailIndex;
                                            
                                            return (
                                                <div
                                                    key={`new-${index}`}
                                                    className={`relative border-2 rounded-lg overflow-hidden ${
                                                        isThumbnail 
                                                            ? 'border-[#335c67] ring-2 ring-[#335c67]' 
                                                            : 'border-gray-300'
                                                    }`}
                                                >
                                                    <img
                                                        src={imageUrl}
                                                        alt={`New ${index + 1}`}
                                                        className="w-full h-24 object-cover cursor-pointer"
                                                        onClick={() => setAsThumbnail(index, false)}
                                                        title="Klik untuk set sebagai foto utama"
                                                    />
                                                    {isThumbnail && (
                                                        <div className="absolute top-1 left-1 bg-[#335c67] text-white text-[10px] px-1 rounded">
                                                            Utama
                                                        </div>
                                                    )}
                                                    <button
                                                        type="button"
                                                        onClick={() => handleImageRemove(index, false)}
                                                        className="absolute top-1 right-1 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs hover:bg-red-600"
                                                        title="Hapus foto"
                                                    >
                                                        ×
                                                    </button>
                                                    {/* Tombol Reorder */}
                                                    <div className="absolute bottom-1 left-1 right-1 flex gap-1">
                                                        {(existingImages.length + index) > 0 && (
                                                            <button
                                                                type="button"
                                                                onClick={() => handleImageReorder(index, index - 1, false)}
                                                                className="flex-1 bg-black bg-opacity-50 text-white text-[10px] py-0.5 rounded hover:bg-opacity-70"
                                                                title="Pindah ke kiri"
                                                            >
                                                                ←
                                                            </button>
                                                        )}
                                                        {index < newImageFiles.length - 1 && (
                                                            <button
                                                                type="button"
                                                                onClick={() => handleImageReorder(index, index + 1, false)}
                                                                className="flex-1 bg-black bg-opacity-50 text-white text-[10px] py-0.5 rounded hover:bg-opacity-70"
                                                                title="Pindah ke kanan"
                                                            >
                                                                →
                                                            </button>
                                                        )}
                                                    </div>
                                                </div>
                                            );
                                        })}
                                    </div>
                                </div>
                            )}

                            {errors.images && (
                                <p className="text-sm text-red-600 mt-1">
                                    {errors.images}
                                </p>
                            )}
                        </div>

                        {/* Tombol Aksi */}
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
