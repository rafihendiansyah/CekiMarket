import { Head, Link, useForm, usePage } from "@inertiajs/react";
import { useEffect, useState } from "react";

export default function SellerRegister() {
    const { auth, errors: pageErrors, existingSeller } = usePage().props;

    const { data, setData, post, processing, errors, reset } = useForm({
        storeName: "",
        storeDescription: "",
        picName: "",
        picPhone: "",
        picEmail: auth?.user?.email || "",
        picStreet: "",
        picRT: "",
        picRW: "",
        picVillage: "",
        picCity: "",
        picProvince: "",
        picNumber: "",
        picPhoto: null,
        picKtpPhoto: null,
    });

    // ====== PREFILL DATA DARI existingSeller ======
    useEffect(() => {
        if (!existingSeller) return;

        setData((old) => ({
            ...old,
            storeName: existingSeller.storeName || "",
            storeDescription: existingSeller.storeDescription || "",
            picName: existingSeller.picName || "",
            picPhone: existingSeller.picPhone || "",
            picEmail:
                existingSeller.picEmail || auth?.user?.email || old.picEmail,
            picStreet: existingSeller.picStreet || "",
            picRT: existingSeller.picRT || "",
            picRW: existingSeller.picRW || "",
            picVillage: existingSeller.picVillage || "",
            picCity: existingSeller.picCity || "",
            picProvince: existingSeller.picProvince || "",
            picNumber: existingSeller.picNumber || "",
        }));
    }, [existingSeller, auth, setData]);

    // ====== STATE UNTUK WILAYAH INDONESIA ======
    const [provinces, setProvinces] = useState([]);
    const [regencies, setRegencies] = useState([]);
    const [districts, setDistricts] = useState([]);

    const [selectedProvinceId, setSelectedProvinceId] = useState("");
    const [selectedRegencyId, setSelectedRegencyId] = useState("");
    const [selectedDistrictId, setSelectedDistrictId] = useState("");

    const [loadingProvinces, setLoadingProvinces] = useState(false);
    const [loadingRegencies, setLoadingRegencies] = useState(false);
    const [loadingDistricts, setLoadingDistricts] = useState(false);
    const [regionError, setRegionError] = useState("");

    // Ambil daftar provinsi saat pertama kali load
    useEffect(() => {
        async function fetchProvinces() {
            try {
                setLoadingProvinces(true);
                setRegionError("");
                const res = await fetch(
                    "https://www.emsifa.com/api-wilayah-indonesia/api/provinces.json"
                );
                const json = await res.json();
                setProvinces(json);
            } catch (e) {
                console.error(e);
                setRegionError(
                    "Gagal memuat data provinsi. Pastikan koneksi internet tersedia."
                );
            } finally {
                setLoadingProvinces(false);
            }
        }
        fetchProvinces();
    }, []);

    // Helper: ambil regency by province (dipakai handler & prefill)
    const fetchRegenciesByProvince = async (provinceId) => {
        try {
            setLoadingRegencies(true);
            setRegionError("");
            const res = await fetch(
                `https://www.emsifa.com/api-wilayah-indonesia/api/regencies/${provinceId}.json`
            );
            const json = await res.json();
            setRegencies(json);
            return json;
        } catch (e) {
            console.error(e);
            setRegionError(
                "Gagal memuat data kabupaten/kota. Coba pilih provinsi lagi atau cek koneksi internet."
            );
            return [];
        } finally {
            setLoadingRegencies(false);
        }
    };

    // Helper: ambil district by regency (dipakai handler & prefill)
    const fetchDistrictsByRegency = async (regencyId) => {
        try {
            setLoadingDistricts(true);
            setRegionError("");
            const res = await fetch(
                `https://www.emsifa.com/api-wilayah-indonesia/api/districts/${regencyId}.json`
            );
            const json = await res.json();
            setDistricts(json);
            return json;
        } catch (e) {
            console.error(e);
            setRegionError(
                "Gagal memuat data kecamatan. Coba pilih kab/kota lagi atau cek koneksi internet."
            );
            return [];
        } finally {
            setLoadingDistricts(false);
        }
    };

    // Handler ketika provinsi berubah (dipilih user)
    const handleProvinceChange = async (e) => {
        const provinceId = e.target.value;
        setSelectedProvinceId(provinceId);
        setSelectedRegencyId("");
        setSelectedDistrictId("");
        setRegencies([]);
        setDistricts([]);
        setData("picCity", "");
        setData("picVillage", "");

        const province = provinces.find((p) => p.id === provinceId);
        setData("picProvince", province ? province.name : "");

        if (!provinceId) return;
        await fetchRegenciesByProvince(provinceId);
    };

    // Handler ketika kab/kota berubah (dipilih user)
    const handleRegencyChange = async (e) => {
        const regencyId = e.target.value;
        setSelectedRegencyId(regencyId);
        setSelectedDistrictId("");
        setDistricts([]);
        setData("picVillage", "");

        const regency = regencies.find((r) => r.id === regencyId);
        setData("picCity", regency ? regency.name : "");

        if (!regencyId) return;
        await fetchDistrictsByRegency(regencyId);
    };

    // Handler ketika kecamatan dipilih
    const handleDistrictChange = (e) => {
        const districtId = e.target.value;
        setSelectedDistrictId(districtId);
        const district = districts.find((d) => d.id === districtId);
        setData("picVillage", district ? district.name : "");
    };

    // 🔥 PREFILL DROPDOWN PROVINSI/KAB/KEC BERDASARKAN existingSeller
    useEffect(() => {
        // Butuh: data seller lama + daftar provinsi sudah ter-load + belum ada pilihan dropdown
        if (
            !existingSeller ||
            provinces.length === 0 ||
            selectedProvinceId ||
            selectedRegencyId ||
            selectedDistrictId
        ) {
            return;
        }

        (async () => {
            // Cari province by name
            const prov = provinces.find(
                (p) => p.name === existingSeller.picProvince
            );
            if (!prov) return;

            setSelectedProvinceId(prov.id);
            setData("picProvince", prov.name);

            // Ambil regencies dan pilih yang sesuai
            const regList = await fetchRegenciesByProvince(prov.id);
            const reg = regList.find((r) => r.name === existingSeller.picCity);
            if (!reg) return;

            setSelectedRegencyId(reg.id);
            setData("picCity", reg.name);

            // Ambil districts dan pilih yang sesuai
            const distList = await fetchDistrictsByRegency(reg.id);
            const dist = distList.find(
                (d) => d.name === existingSeller.picVillage
            );
            if (!dist) return;

            setSelectedDistrictId(dist.id);
            setData("picVillage", dist.name);
        })();
    }, [
        existingSeller,
        provinces,
        selectedProvinceId,
        selectedRegencyId,
        selectedDistrictId,
        setData,
    ]);

    const handleSubmit = (e) => {
        e.preventDefault();
        post(route("seller.register.store"), {
            onSuccess: () => {
                reset();
                setSelectedProvinceId("");
                setSelectedRegencyId("");
                setSelectedDistrictId("");
                setRegencies([]);
                setDistricts([]);
            },
        });
    };

    return (
        <>
            <Head title="Registrasi Penjual (Toko)" />

            <div className="min-h-screen bg-gray-50 py-8">
                <div className="max-w-3xl mx-auto bg-white rounded-lg shadow p-6">
                    <div className="flex items-center justify-between mb-4">
                        <h1 className="text-xl font-bold text-gray-800">
                            Formulir Registrasi Penjual (Toko)
                        </h1>
                        <Link
                            href={route("dashboard")}
                            className="text-xs text-gray-500 hover:underline"
                        >
                            &larr; Kembali ke Beranda
                        </Link>
                    </div>

                    {pageErrors && Object.keys(pageErrors).length > 0 && (
                        <div className="mb-4 rounded border border-red-200 bg-red-50 px-3 py-2 text-xs text-red-700">
                            Terdapat beberapa kesalahan input. Silakan periksa
                            kembali formulir di bawah.
                        </div>
                    )}

                    {regionError && (
                        <div className="mb-4 rounded border border-amber-200 bg-amber-50 px-3 py-2 text-xs text-amber-800">
                            {regionError}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-4">
                        {/* Data Toko */}
                        <div className="border-b pb-3">
                            <h2 className="text-sm font-semibold text-gray-800 mb-2">
                                Data Toko
                            </h2>
                            <div className="grid md:grid-cols-2 gap-3">
                                <div>
                                    <label className="block text-xs font-medium text-gray-700">
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
                                        <p className="text-[11px] text-red-600 mt-1">
                                            {errors.storeName}
                                        </p>
                                    )}
                                </div>
                                <div>
                                    <label className="block text-xs font-medium text-gray-700">
                                        Deskripsi Toko
                                    </label>
                                    <input
                                        type="text"
                                        value={data.storeDescription}
                                        onChange={(e) =>
                                            setData(
                                                "storeDescription",
                                                e.target.value
                                            )
                                        }
                                        className="mt-1 w-full border-gray-300 rounded-md shadow-sm focus:ring-[#335c67] focus:border-[#335c67]"
                                        placeholder="Contoh: Toko alat tulis, perlengkapan rumah tangga, dll."
                                    />
                                    {errors.storeDescription && (
                                        <p className="text-[11px] text-red-600 mt-1">
                                            {errors.storeDescription}
                                        </p>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Data PIC */}
                        <div className="border-b pb-3">
                            <h2 className="text-sm font-semibold text-gray-800 mb-2">
                                Data PIC (Penanggung Jawab)
                            </h2>
                            <div className="grid md:grid-cols-2 gap-3">
                                <div>
                                    <label className="block text-xs font-medium text-gray-700">
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
                                        <p className="text-[11px] text-red-600 mt-1">
                                            {errors.picName}
                                        </p>
                                    )}
                                </div>
                                <div>
                                    <label className="block text-xs font-medium text-gray-700">
                                        Nomor HP PIC*
                                    </label>
                                    <input
                                        type="text"
                                        value={data.picPhone}
                                        onChange={(e) =>
                                            setData("picPhone", e.target.value)
                                        }
                                        className="mt-1 w-full border-gray-300 rounded-md shadow-sm focus:ring-[#335c67] focus:border-[#335c67]"
                                        placeholder="Contoh: 0812xxxxxxx"
                                    />
                                    {errors.picPhone && (
                                        <p className="text-[11px] text-red-600 mt-1">
                                            {errors.picPhone}
                                        </p>
                                    )}
                                </div>
                                <div>
                                    <label className="block text-xs font-medium text-gray-700">
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
                                        <p className="text-[11px] text-red-600 mt-1">
                                            {errors.picEmail}
                                        </p>
                                    )}
                                </div>
                                <div>
                                    <label className="block text-xs font-medium text-gray-700">
                                        No KTP PIC*
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
                                        <p className="text-[11px] text-red-600 mt-1">
                                            {errors.picNumber}
                                        </p>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Alamat PIC + Wilayah Indonesia */}
                        <div className="border-b pb-3">
                            <h2 className="text-sm font-semibold text-gray-800 mb-2">
                                Alamat Lengkap PIC
                            </h2>
                            <div className="space-y-3">
                                <div>
                                    <label className="block text-xs font-medium text-gray-700">
                                        Alamat Jalan (Nama Jalan, No Rumah,
                                        dll)*
                                    </label>
                                    <textarea
                                        rows="2"
                                        value={data.picStreet}
                                        onChange={(e) =>
                                            setData("picStreet", e.target.value)
                                        }
                                        className="mt-1 w-full border-gray-300 rounded-md shadow-sm focus:ring-[#335c67] focus:border-[#335c67] text-sm"
                                    />
                                    {errors.picStreet && (
                                        <p className="text-[11px] text-red-600 mt-1">
                                            {errors.picStreet}
                                        </p>
                                    )}
                                </div>

                                <div className="grid md:grid-cols-3 gap-3">
                                    <div>
                                        <label className="block text-xs font-medium text-gray-700">
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
                                            <p className="text-[11px] text-red-600 mt-1">
                                                {errors.picRT}
                                            </p>
                                        )}
                                    </div>
                                    <div>
                                        <label className="block text-xs font-medium text-gray-700">
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
                                            <p className="text-[11px] text-red-600 mt-1">
                                                {errors.picRW}
                                            </p>
                                        )}
                                    </div>
                                </div>

                                {/* Dropdown Provinsi / Kab / Kec */}
                                <div className="grid md:grid-cols-3 gap-3">
                                    <div>
                                        <label className="block text-xs font-medium text-gray-700">
                                            Provinsi*
                                        </label>
                                        <select
                                            value={selectedProvinceId}
                                            onChange={handleProvinceChange}
                                            className="mt-1 w-full border-gray-300 rounded-md shadow-sm focus:ring-[#335c67] focus:border-[#335c67] text-sm"
                                        >
                                            <option value="">
                                                Pilih Provinsi
                                            </option>
                                            {provinces.map((prov) => (
                                                <option
                                                    key={prov.id}
                                                    value={prov.id}
                                                >
                                                    {prov.name}
                                                </option>
                                            ))}
                                        </select>
                                        {loadingProvinces && (
                                            <p className="text-[11px] text-gray-500 mt-1">
                                                Memuat provinsi...
                                            </p>
                                        )}
                                        {errors.picProvince && (
                                            <p className="text-[11px] text-red-600 mt-1">
                                                {errors.picProvince}
                                            </p>
                                        )}
                                    </div>

                                    <div>
                                        <label className="block text-xs font-medium text-gray-700">
                                            Kab/Kota*
                                        </label>
                                        <select
                                            value={selectedRegencyId}
                                            onChange={handleRegencyChange}
                                            className="mt-1 w-full border-gray-300 rounded-md shadow-sm focus:ring-[#335c67] focus:border-[#335c67] text-sm"
                                            disabled={
                                                !selectedProvinceId ||
                                                loadingRegencies
                                            }
                                        >
                                            <option value="">
                                                {selectedProvinceId
                                                    ? "Pilih Kab/Kota"
                                                    : "Pilih provinsi dulu"}
                                            </option>
                                            {regencies.map((reg) => (
                                                <option
                                                    key={reg.id}
                                                    value={reg.id}
                                                >
                                                    {reg.name}
                                                </option>
                                            ))}
                                        </select>
                                        {loadingRegencies && (
                                            <p className="text-[11px] text-gray-500 mt-1">
                                                Memuat kabupaten/kota...
                                            </p>
                                        )}
                                        {errors.picCity && (
                                            <p className="text-[11px] text-red-600 mt-1">
                                                {errors.picCity}
                                            </p>
                                        )}
                                    </div>

                                    <div>
                                        <label className="block text-xs font-medium text-gray-700">
                                            Kecamatan/Kelurahan*
                                        </label>
                                        <select
                                            value={selectedDistrictId}
                                            onChange={handleDistrictChange}
                                            className="mt-1 w-full border-gray-300 rounded-md shadow-sm focus:ring-[#335c67] focus:border-[#335c67] text-sm"
                                            disabled={
                                                !selectedRegencyId ||
                                                loadingDistricts
                                            }
                                        >
                                            <option value="">
                                                {selectedRegencyId
                                                    ? "Pilih Kecamatan"
                                                    : "Pilih kab/kota dulu"}
                                            </option>
                                            {districts.map((dist) => (
                                                <option
                                                    key={dist.id}
                                                    value={dist.id}
                                                >
                                                    {dist.name}
                                                </option>
                                            ))}
                                        </select>
                                        {loadingDistricts && (
                                            <p className="text-[11px] text-gray-500 mt-1">
                                                Memuat kecamatan...
                                            </p>
                                        )}
                                        {errors.picVillage && (
                                            <p className="text-[11px] text-red-600 mt-1">
                                                {errors.picVillage}
                                            </p>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Upload Foto */}
                        <div className="border-b pb-3">
                            <h2 className="text-sm font-semibold text-gray-800 mb-2">
                                Dokumen Pendukung
                            </h2>
                            <div className="grid md:grid-cols-2 gap-3">
                                <div>
                                    <label className="block text-xs font-medium text-gray-700">
                                        Foto PIC*
                                    </label>
                                    <input
                                        type="file"
                                        accept="image/*"
                                        onChange={(e) =>
                                            setData(
                                                "picPhoto",
                                                e.target.files[0] || null
                                            )
                                        }
                                        className="mt-1 w-full text-xs"
                                    />
                                    {errors.picPhoto && (
                                        <p className="text-[11px] text-red-600 mt-1">
                                            {errors.picPhoto}
                                        </p>
                                    )}
                                </div>
                                <div>
                                    <label className="block text-xs font-medium text-gray-700">
                                        Foto / File KTP PIC*
                                    </label>
                                    <input
                                        type="file"
                                        accept=".jpg,.jpeg,.png,.pdf"
                                        onChange={(e) =>
                                            setData(
                                                "picKtpPhoto",
                                                e.target.files[0] || null
                                            )
                                        }
                                        className="mt-1 w-full text-xs"
                                    />
                                    {errors.picKtpPhoto && (
                                        <p className="text-[11px] text-red-600 mt-1">
                                            {errors.picKtpPhoto}
                                        </p>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Tombol submit */}
                        <div className="flex justify-end pt-2">
                            <button
                                type="submit"
                                disabled={processing}
                                className="px-4 py-2 rounded-md text-xs font-semibold text-white"
                                style={{ backgroundColor: "#335c67" }}
                            >
                                {processing
                                    ? "Mengirim..."
                                    : "Kirim Formulir Registrasi"}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </>
    );
}
