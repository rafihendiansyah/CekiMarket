import { Head, Link } from "@inertiajs/react";

export default function SellerDetail({ seller }) {
    return (
        <>
            <Head title={`Detail Seller - ${seller.storeName}`} />

            <div className="min-h-screen bg-gray-50 py-10">
                <div className="max-w-4xl mx-auto px-4">
                    <Link
                        href={route("admin.sellers.index")}
                        className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition mb-6"
                    >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                        </svg>
                        Kembali ke Daftar Seller
                    </Link>

                    <div className="bg-white shadow-lg rounded-xl overflow-hidden">
                        {/* Header Card */}
                        <div className="bg-gradient-to-r from-dark-slate to-dark-slate/90 p-6 text-white">
                            <div className="flex items-center gap-3 mb-2">
                                <div className="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center">
                                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                                    </svg>
                                </div>
                                <div>
                                    <h1 className="text-2xl font-bold">{seller.storeName}</h1>
                                    <p className="text-white/80 text-sm">{seller.storeDescription || 'Tidak ada deskripsi'}</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-4 mt-4 text-sm">
                                <div className="flex items-center gap-2">
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                    </svg>
                                    <span>{seller.createdAt}</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <span className="px-3 py-1 bg-white/20 rounded-full text-xs font-semibold">
                                        {seller.status}
                                    </span>
                                </div>
                            </div>
                        </div>

                        <div className="p-8">

                            {/* Data Toko */}
                            <section className="mb-8">
                                <h2 className="text-lg font-semibold text-dark-slate mb-4 flex items-center gap-2">
                                    <svg className="w-5 h-5 text-dark-slate" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                                    </svg>
                                    Data Toko
                                </h2>
                                <div className="bg-gray-50 rounded-lg p-4 space-y-2">
                                    <div className="flex items-center gap-2">
                                        <span className="font-medium text-gray-700 w-32">Nama Toko:</span>
                                        <span className="text-gray-900">{seller.storeName}</span>
                                    </div>
                                    <div className="flex items-start gap-2">
                                        <span className="font-medium text-gray-700 w-32">Deskripsi:</span>
                                        <span className="text-gray-900">{seller.storeDescription || "-"}</span>
                                    </div>
                                </div>
                            </section>

                            {/* PIC */}
                            <section className="mb-8">
                                <h2 className="text-lg font-semibold text-dark-slate mb-4 flex items-center gap-2">
                                    <svg className="w-5 h-5 text-dark-slate" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                    </svg>
                                    Data PIC (Penanggung Jawab)
                                </h2>
                                <div className="bg-gray-50 rounded-lg p-4 space-y-2">
                                    <div className="flex items-center gap-2">
                                        <span className="font-medium text-gray-700 w-32">Nama PIC:</span>
                                        <span className="text-gray-900">{seller.picName}</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <span className="font-medium text-gray-700 w-32">No HP:</span>
                                        <span className="text-gray-900">{seller.picPhone}</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <span className="font-medium text-gray-700 w-32">Email:</span>
                                        <span className="text-gray-900">{seller.picEmail}</span>
                                    </div>
                                </div>
                            </section>

                            {/* Alamat */}
                            <section className="mb-8">
                                <h2 className="text-lg font-semibold text-dark-slate mb-4 flex items-center gap-2">
                                    <svg className="w-5 h-5 text-dark-slate" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                    </svg>
                                    Alamat PIC
                                </h2>
                                <div className="bg-gray-50 rounded-lg p-4 space-y-2">
                                    <div className="flex items-center gap-2">
                                        <span className="font-medium text-gray-700 w-32">Jalan:</span>
                                        <span className="text-gray-900">{seller.picStreet}</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <span className="font-medium text-gray-700 w-32">RT/RW:</span>
                                        <span className="text-gray-900">{seller.picRT}/{seller.picRW}</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <span className="font-medium text-gray-700 w-32">Kelurahan:</span>
                                        <span className="text-gray-900">{seller.picVillage}</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <span className="font-medium text-gray-700 w-32">Kab/Kota:</span>
                                        <span className="text-gray-900">{seller.picCity}</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <span className="font-medium text-gray-700 w-32">Provinsi:</span>
                                        <span className="text-gray-900">{seller.picProvince}</span>
                                    </div>
                                </div>
                            </section>

                            {/* Identitas */}
                            <section className="mb-8">
                                <h2 className="text-lg font-semibold text-dark-slate mb-4 flex items-center gap-2">
                                    <svg className="w-5 h-5 text-dark-slate" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V8a2 2 0 00-2-2h-5m-4 0V5a2 2 0 114 0v1m-4 0a2 2 0 104 0m-5 8a2 2 0 100-4 2 2 0 000 4zm0 0c1.306 0 2.417.835 2.83 2M9 14a3.001 3.001 0 00-2.83 2M15 11h3m-3 4h2" />
                                    </svg>
                                    Identitas PIC
                                </h2>
                                <div className="bg-gray-50 rounded-lg p-4 space-y-4">
                                    <div className="flex items-center gap-2">
                                        <span className="font-medium text-gray-700 w-32">No KTP:</span>
                                        <span className="text-gray-900">{seller.picNumber}</span>
                                    </div>

                                    {seller.picPhotoPath && (
                                        <div>
                                            <p className="font-medium text-gray-700 mb-2">Foto Penjual:</p>
                                            <img
                                                src={`/storage/${seller.picPhotoPath}`}
                                                alt="Foto PIC"
                                                className="w-48 h-48 object-cover rounded-lg shadow-md border border-gray-200"
                                            />
                                        </div>
                                    )}

                                    {seller.picKtpPath && (
                                        <div>
                                            <p className="font-medium text-gray-700 mb-2">Foto KTP:</p>
                                            <a
                                                href={`/storage/${seller.picKtpPath}`}
                                                target="_blank"
                                                className="inline-flex items-center gap-2 px-4 py-2 bg-dark-slate text-white rounded-lg hover:bg-opacity-90 transition"
                                            >
                                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                                </svg>
                                                Lihat KTP
                                            </a>
                                        </div>
                                    )}
                                </div>
                            </section>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}
