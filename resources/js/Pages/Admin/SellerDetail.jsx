import { Head, Link } from "@inertiajs/react";

export default function SellerDetail({ seller }) {
    return (
        <>
            <Head title={`Detail Seller - ${seller.storeName}`} />

            <div className="min-h-screen bg-gray-50 py-10">
                <div className="max-w-3xl mx-auto bg-white shadow rounded-lg p-8">
                    <Link
                        href={route("admin.sellers.index")}
                        className="text-sm text-gray-600 hover:underline"
                    >
                        &larr; Kembali ke daftar seller
                    </Link>

                    <h1 className="text-2xl font-bold mt-4 mb-6 text-[#335c67]">
                        Detail Toko: {seller.storeName}
                    </h1>

                    {/* Data Toko */}
                    <section className="mb-6">
                        <h2 className="text-lg font-semibold text-gray-800 mb-2">
                            Data Toko
                        </h2>
                        <p>
                            <b>Nama Toko:</b> {seller.storeName}
                        </p>
                        <p>
                            <b>Deskripsi:</b> {seller.storeDescription || "-"}
                        </p>
                    </section>

                    {/* PIC */}
                    <section className="mb-6">
                        <h2 className="text-lg font-semibold text-gray-800 mb-2">
                            Data PIC (Penanggung Jawab)
                        </h2>
                        <p>
                            <b>Nama PIC:</b> {seller.picName}
                        </p>
                        <p>
                            <b>No HP:</b> {seller.picPhone}
                        </p>
                        <p>
                            <b>Email:</b> {seller.picEmail}
                        </p>
                    </section>

                    {/* Alamat */}
                    <section className="mb-6">
                        <h2 className="text-lg font-semibold text-gray-800 mb-2">
                            Alamat PIC
                        </h2>
                        <p>
                            <b>Jalan:</b> {seller.picStreet}
                        </p>
                        <p>
                            <b>RT/RW:</b> {seller.picRT}/{seller.picRW}
                        </p>
                        <p>
                            <b>Kelurahan:</b> {seller.picVillage}
                        </p>
                        <p>
                            <b>Kab/Kota:</b> {seller.picCity}
                        </p>
                        <p>
                            <b>Provinsi:</b> {seller.picProvince}
                        </p>
                    </section>

                    {/* Identitas */}
                    <section className="mb-6">
                        <h2 className="text-lg font-semibold text-gray-800 mb-2">
                            Identitas PIC
                        </h2>
                        <p>
                            <b>No KTP:</b> {seller.picNumber}
                        </p>

                        {seller.picPhotoPath && (
                            <div className="mt-2">
                                <p>
                                    <b>Foto PIC:</b>
                                </p>
                                <img
                                    src={`/storage/${seller.picPhotoPath}`}
                                    alt="Foto PIC"
                                    className="w-40 rounded shadow"
                                />
                            </div>
                        )}

                        {seller.picKtpPath && (
                            <div className="mt-4">
                                <p>
                                    <b>File KTP:</b>
                                </p>
                                <a
                                    href={`/storage/${seller.picKtpPath}`}
                                    target="_blank"
                                    className="text-blue-600 underline"
                                >
                                    Lihat KTP
                                </a>
                            </div>
                        )}
                    </section>

                    {/* Status */}
                    <section>
                        <h2 className="text-lg font-semibold text-gray-800 mb-2">
                            Status Verifikasi
                        </h2>
                        <p>
                            <b>Status:</b>{" "}
                            <span className="font-bold">{seller.status}</span>
                        </p>
                        <p className="text-sm text-gray-500 mt-2">
                            Didaftarkan pada: {seller.createdAt}
                        </p>
                    </section>
                </div>
            </div>
        </>
    );
}
