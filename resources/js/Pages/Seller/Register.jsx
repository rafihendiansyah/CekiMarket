import { Head, useForm, Link, usePage } from "@inertiajs/react";

export default function RegisterSeller({ user, existingSeller }) {
    const { flash } = usePage().props;

    const initialData = {
        storeName: existingSeller?.storeName || "",
        storeDescription: existingSeller?.storeDescription || "",
        picName: existingSeller?.picName || user?.name || "",
        picPhone: existingSeller?.picPhone || "",
        picEmail: existingSeller?.picEmail || user?.email || "",
        picStreet: existingSeller?.picStreet || "",
        picRT: existingSeller?.picRT || "",
        picRW: existingSeller?.picRW || "",
        picVillage: existingSeller?.picVillage || "",
        picCity: existingSeller?.picCity || "",
        picProvince: existingSeller?.picProvince || "",
        picNumber: existingSeller?.picNumber || "",
        picPhoto: null, // file baru (opsional)
        picKtpFile: null, // file baru (opsional)
    };

    const { data, setData, post, processing, errors } = useForm(initialData);

    const submit = (e) => {
        e.preventDefault();
        post(route("seller.register.store"), {
            forceFormData: true,
        });
    };

    return (
        <>
            <Head title="Registrasi Penjual" />

            <div className="min-h-screen bg-gray-50 flex justify-center py-10">
                <div className="w-full max-w-3xl bg-white shadow-md rounded-lg p-8">
                    <div className="mb-6 border-b pb-4 flex items-center justify-between">
                        <div>
                            <h1 className="text-2xl font-bold text-[#335c67]">
                                Formulir Registrasi Penjual (Toko)
                            </h1>
                            <p className="text-sm text-gray-600 mt-1">
                                {existingSeller
                                    ? "Anda dapat memperbarui data toko Anda di sini."
                                    : "Lengkapi data berikut untuk mendaftarkan toko Anda."}
                            </p>
                        </div>
                        <span className="text-xs text-gray-400">(* wajib)</span>
                    </div>

                    {flash?.success && (
                        <div className="mb-4 rounded border border-emerald-300 bg-emerald-50 px-4 py-2 text-sm text-emerald-800">
                            {flash.success}
                        </div>
                    )}

                    <form
                        onSubmit={submit}
                        encType="multipart/form-data"
                        className="space-y-8"
                    >
                        {/* DATA TOKO */}
                        <section>
                            <h2 className="text-lg font-semibold text-gray-800 mb-3">
                                Data Toko
                            </h2>
                            <div className="grid md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">
                                        Nama Toko*
                                    </label>
                                    <input
                                        type="text"
                                        value={data.storeName}
                                        onChange={(e) =>
                                            setData("storeName", e.target.value)
                                        }
                                        className="mt-1 w-full border-gray-300 rounded-md shadow-sm focus:ring-[#335c67] focus:border-[#335c67]"
                                    />
                                    {errors.storeName && (
                                        <p className="text-sm text-red-600 mt-1">
                                            {errors.storeName}
                                        </p>
                                    )}
                                </div>

                                <div className="md:col-span-2">
                                    <label className="block text-sm font-medium text-gray-700">
                                        Deskripsi Singkat
                                    </label>
                                    <textarea
                                        rows="3"
                                        value={data.storeDescription}
                                        onChange={(e) =>
                                            setData(
                                                "storeDescription",
                                                e.target.value
                                            )
                                        }
                                        className="mt-1 w-full border-gray-300 rounded-md shadow-sm focus:ring-[#335c67] focus:border-[#335c67]"
                                        placeholder="Contoh: Menjual buku kuliah, alat tulis, dan perlengkapan kampus."
                                    />
                                    {errors.storeDescription && (
                                        <p className="text-sm text-red-600 mt-1">
                                            {errors.storeDescription}
                                        </p>
                                    )}
                                </div>
                            </div>
                        </section>

                        {/* DATA PIC */}
                        <section>
                            <h2 className="text-lg font-semibold text-gray-800 mb-3">
                                Data PIC (Penanggung Jawab)
                            </h2>
                            <div className="grid md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">
                                        Nama PIC*
                                    </label>
                                    <input
                                        type="text"
                                        value={data.picName}
                                        onChange={(e) =>
                                            setData("picName", e.target.value)
                                        }
                                        className="mt-1 w-full border-gray-300 rounded-md shadow-sm focus:ring-[#335c67] focus:border-[#335c67]"
                                    />
                                    {errors.picName && (
                                        <p className="text-sm text-red-600 mt-1">
                                            {errors.picName}
                                        </p>
                                    )}
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700">
                                        No HP PIC*
                                    </label>
                                    <input
                                        type="text"
                                        value={data.picPhone}
                                        onChange={(e) =>
                                            setData("picPhone", e.target.value)
                                        }
                                        className="mt-1 w-full border-gray-300 rounded-md shadow-sm focus:ring-[#335c67] focus:border-[#335c67]"
                                    />
                                    {errors.picPhone && (
                                        <p className="text-sm text-red-600 mt-1">
                                            {errors.picPhone}
                                        </p>
                                    )}
                                </div>

                                <div className="md:col-span-2">
                                    <label className="block text-sm font-medium text-gray-700">
                                        Email PIC*
                                    </label>
                                    <input
                                        type="email"
                                        value={data.picEmail}
                                        onChange={(e) =>
                                            setData("picEmail", e.target.value)
                                        }
                                        className="mt-1 w-full border-gray-300 rounded-md shadow-sm focus:ring-[#335c67] focus:border-[#335c67]"
                                    />
                                    {errors.picEmail && (
                                        <p className="text-sm text-red-600 mt-1">
                                            {errors.picEmail}
                                        </p>
                                    )}
                                </div>
                            </div>
                        </section>

                        {/* ALAMAT PIC */}
                        <section>
                            <h2 className="text-lg font-semibold text-gray-800 mb-3">
                                Alamat PIC
                            </h2>
                            <div className="grid md:grid-cols-2 gap-4">
                                <div className="md:col-span-2">
                                    <label className="block text-sm font-medium text-gray-700">
                                        Jalan*
                                    </label>
                                    <input
                                        type="text"
                                        value={data.picStreet}
                                        onChange={(e) =>
                                            setData("picStreet", e.target.value)
                                        }
                                        className="mt-1 w-full border-gray-300 rounded-md shadow-sm focus:ring-[#335c67] focus:border-[#335c67]"
                                    />
                                    {errors.picStreet && (
                                        <p className="text-sm text-red-600 mt-1">
                                            {errors.picStreet}
                                        </p>
                                    )}
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700">
                                        RT*
                                    </label>
                                    <input
                                        type="text"
                                        value={data.picRT}
                                        onChange={(e) =>
                                            setData("picRT", e.target.value)
                                        }
                                        className="mt-1 w-full border-gray-300 rounded-md shadow-sm focus:ring-[#335c67] focus:border-[#335c67]"
                                    />
                                    {errors.picRT && (
                                        <p className="text-sm text-red-600 mt-1">
                                            {errors.picRT}
                                        </p>
                                    )}
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700">
                                        RW*
                                    </label>
                                    <input
                                        type="text"
                                        value={data.picRW}
                                        onChange={(e) =>
                                            setData("picRW", e.target.value)
                                        }
                                        className="mt-1 w-full border-gray-300 rounded-md shadow-sm focus:ring-[#335c67] focus:border-[#335c67]"
                                    />
                                    {errors.picRW && (
                                        <p className="text-sm text-red-600 mt-1">
                                            {errors.picRW}
                                        </p>
                                    )}
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700">
                                        Kelurahan*
                                    </label>
                                    <input
                                        type="text"
                                        value={data.picVillage}
                                        onChange={(e) =>
                                            setData(
                                                "picVillage",
                                                e.target.value
                                            )
                                        }
                                        className="mt-1 w-full border-gray-300 rounded-md shadow-sm focus:ring-[#335c67] focus:border-[#335c67]"
                                    />
                                    {errors.picVillage && (
                                        <p className="text-sm text-red-600 mt-1">
                                            {errors.picVillage}
                                        </p>
                                    )}
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700">
                                        Kab/Kota*
                                    </label>
                                    <input
                                        type="text"
                                        value={data.picCity}
                                        onChange={(e) =>
                                            setData("picCity", e.target.value)
                                        }
                                        className="mt-1 w-full border-gray-300 rounded-md shadow-sm focus:ring-[#335c67] focus:border-[#335c67]"
                                    />
                                    {errors.picCity && (
                                        <p className="text-sm text-red-600 mt-1">
                                            {errors.picCity}
                                        </p>
                                    )}
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700">
                                        Provinsi*
                                    </label>
                                    <input
                                        type="text"
                                        value={data.picProvince}
                                        onChange={(e) =>
                                            setData(
                                                "picProvince",
                                                e.target.value
                                            )
                                        }
                                        className="mt-1 w-full border-gray-300 rounded-md shadow-sm focus:ring-[#335c67] focus:border-[#335c67]"
                                    />
                                    {errors.picProvince && (
                                        <p className="text-sm text-red-600 mt-1">
                                            {errors.picProvince}
                                        </p>
                                    )}
                                </div>
                            </div>
                        </section>

                        {/* DOKUMEN IDENTITAS */}
                        <section>
                            <h2 className="text-lg font-semibold text-gray-800 mb-3">
                                Dokumen Identitas PIC
                            </h2>
                            <div className="grid md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">
                                        No. KTP PIC*
                                    </label>
                                    <input
                                        type="text"
                                        value={data.picNumber}
                                        onChange={(e) =>
                                            setData("picNumber", e.target.value)
                                        }
                                        className="mt-1 w-full border-gray-300 rounded-md shadow-sm focus:ring-[#335c67] focus:border-[#335c67]"
                                    />
                                    {errors.picNumber && (
                                        <p className="text-sm text-red-600 mt-1">
                                            {errors.picNumber}
                                        </p>
                                    )}
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700">
                                        Foto PIC (jpg/png, ≤2MB)
                                    </label>
                                    <input
                                        type="file"
                                        accept=".jpg,.jpeg,.png"
                                        onChange={(e) =>
                                            setData(
                                                "picPhoto",
                                                e.target.files[0]
                                            )
                                        }
                                        className="mt-1 block w-full text-sm text-gray-700"
                                    />
                                    {errors.picPhoto && (
                                        <p className="text-sm text-red-600 mt-1">
                                            {errors.picPhoto}
                                        </p>
                                    )}
                                    {existingSeller?.picPhotoPath && (
                                        <p className="text-xs text-gray-500 mt-1">
                                            File sekarang:{" "}
                                            <span className="underline">
                                                /storage/
                                                {existingSeller.picPhotoPath}
                                            </span>
                                        </p>
                                    )}
                                </div>

                                <div className="md:col-span-2">
                                    <label className="block text-sm font-medium text-gray-700">
                                        File KTP (jpg/png/pdf, ≤5MB)
                                    </label>
                                    <input
                                        type="file"
                                        accept=".jpg,.jpeg,.png,.pdf"
                                        onChange={(e) =>
                                            setData(
                                                "picKtpFile",
                                                e.target.files[0]
                                            )
                                        }
                                        className="mt-1 block w-full text-sm text-gray-700"
                                    />
                                    {errors.picKtpFile && (
                                        <p className="text-sm text-red-600 mt-1">
                                            {errors.picKtpFile}
                                        </p>
                                    )}
                                    {existingSeller?.picKtpPath && (
                                        <p className="text-xs text-gray-500 mt-1">
                                            File sekarang:{" "}
                                            <span className="underline">
                                                /storage/
                                                {existingSeller.picKtpPath}
                                            </span>
                                        </p>
                                    )}
                                </div>
                            </div>
                        </section>

                        {/* TOMBOL */}
                        <div className="flex justify-end gap-3 pt-4 border-t">
                            <Link
                                href={route("dashboard")}
                                className="px-4 py-2 rounded-md border border-gray-300 text-gray-700 text-sm hover:bg-gray-100"
                            >
                                Kembali ke Dashboard
                            </Link>

                            <button
                                type="submit"
                                disabled={processing}
                                className="px-5 py-2 rounded-md text-sm font-semibold text-white"
                                style={{ backgroundColor: "#335c67" }}
                            >
                                {processing
                                    ? "Menyimpan..."
                                    : existingSeller
                                    ? "Perbarui Data Toko"
                                    : "Simpan Data Toko"}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </>
    );
}
