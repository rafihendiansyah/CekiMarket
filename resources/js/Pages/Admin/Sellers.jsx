import { Head, Link, router, usePage } from "@inertiajs/react";
import Pagination from "@/Components/Pagination";

export default function SellersAdminPage({ sellers }) {
    const { flash } = usePage().props;

    const handleApprove = (id) => {
        if (!confirm("Set seller ini menjadi ACTIVE?")) return;
        router.post(route("admin.sellers.approve", id));
    };

    const handleReject = (id) => {
        if (!confirm("Set seller ini menjadi REJECTED?")) return;
        router.post(route("admin.sellers.reject", id));
    };

    const statusBadgeClass = (status) => {
        switch (status) {
            case "ACTIVE":
                return "bg-emerald-100 text-emerald-700 border-emerald-300";
            case "REJECTED":
                return "bg-red-100 text-red-700 border-red-300";
            default:
            case "PENDING":
                return "bg-yellow-100 text-yellow-700 border-yellow-300";
        }
    };

    // Hitung pending sellers
    const sellersData = sellers.data || sellers;
    const pendingCount = sellersData.filter(s => s.status === 'PENDING').length;

    return (
        <>
            <Head title="Verifikasi Seller - Platform Admin" />

            <div className="min-h-screen bg-gray-50">
                <div className="max-w-6xl mx-auto py-8 px-4">
                    {/* Tombol Kembali */}
                    <Link
                        href={route("dashboard")}
                        className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition mb-6"
                    >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                        </svg>
                        Kembali ke Beranda
                    </Link>

                    {/* Header */}
                    <div className="mb-8">
                        <div className="flex items-center gap-3 mb-2">
                            <svg className="w-8 h-8 text-dark-slate" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            <h1 className="text-3xl font-bold text-dark-slate">
                                Pending Sellers
                            </h1>
                        </div>
                        <p className="text-gray-600 ml-11">
                            Verifikasi dan setujui pendaftar penjual baru
                        </p>
                    </div>

                    {/* Pending Count Card */}
                    {pendingCount > 0 && (
                        <div className="bg-gradient-to-r from-hunyadi-yellow/20 to-hunyadi-yellow/10 border border-hunyadi-yellow/30 rounded-lg p-4 mb-6 flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <div className="w-12 h-12 bg-hunyadi-yellow rounded-full flex items-center justify-center">
                                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                </div>
                                <div>
                                    <div className="text-sm text-gray-600">Pending</div>
                                    <div className="text-3xl font-bold text-dark-slate">{pendingCount}</div>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Flash message */}
                    {flash?.success && (
                        <div className="mb-4 rounded border border-emerald-300 bg-emerald-50 px-4 py-2 text-sm text-emerald-800">
                            {flash.success}
                        </div>
                    )}

                    {/* List Pending Sellers - Card Layout */}
                    {sellersData.filter(s => s.status === 'PENDING').length > 0 && (
                        <div className="space-y-4 mb-8">
                            {sellersData.filter(s => s.status === 'PENDING').map((seller) => (
                                <div key={seller.id} className="bg-white rounded-lg shadow-md border border-gray-200 p-6">
                                    <div className="flex items-start justify-between mb-4">
                                        <div className="flex items-start gap-4">
                                            <div className="w-12 h-12 bg-dark-slate/10 rounded-lg flex items-center justify-center flex-shrink-0">
                                                <svg className="w-6 h-6 text-dark-slate" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                                                </svg>
                                            </div>
                                            <div className="flex-1">
                                                <div className="flex items-center gap-2 mb-1">
                                                    <h3 className="text-lg font-bold text-dark-slate">{seller.storeName}</h3>
                                                </div>
                                                <div className="space-y-1 text-sm text-gray-600">
                                                    <div className="flex items-center gap-2">
                                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                                        </svg>
                                                        <span>{seller.userName || '-'}</span>
                                                    </div>
                                                    <div className="flex items-center gap-2">
                                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                                        </svg>
                                                        <span>{seller.userEmail}</span>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <div className="text-xs text-gray-500 mb-1">Didaftarkan</div>
                                            <div className="text-sm font-medium text-gray-700">{seller.createdAt}</div>
                                        </div>
                                    </div>
                                    <div className="flex items-center justify-between pt-4 border-t">
                                        <div className="flex items-center gap-4 text-sm">
                                            <span className="text-gray-600">Jumlah Pengajuan: <strong>{seller.submissionCount || 1}</strong></span>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <Link
                                                href={route("admin.sellers.show", seller.id)}
                                                className="px-4 py-2 rounded-md text-sm font-medium text-dark-slate bg-gray-100 hover:bg-gray-200 transition"
                                            >
                                                Lihat Detail
                                            </Link>
                                            <button
                                                onClick={() => handleApprove(seller.id)}
                                                className="px-6 py-2 rounded-md text-sm font-semibold text-white bg-green-600 hover:bg-green-700 transition flex items-center gap-2"
                                            >
                                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                                </svg>
                                                Setujui
                                            </button>
                                            <button
                                                onClick={() => handleReject(seller.id)}
                                                className="px-6 py-2 rounded-md text-sm font-semibold text-white bg-auburn hover:bg-opacity-90 transition flex items-center gap-2"
                                            >
                                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                                </svg>
                                                Tolak
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}

                    {/* Tabel semua sellers */}
                    <div className="bg-white shadow rounded-lg overflow-hidden">
                        <div className="px-6 py-4 border-b bg-gray-50">
                            <h2 className="text-lg font-semibold text-dark-slate">Semua Penjual</h2>
                        </div>
                        <table className="min-w-full text-sm">
                            <thead className="bg-gray-100 border-b">
                                <tr>
                                    <th className="px-4 py-2 text-left">
                                        Toko
                                    </th>
                                    <th className="px-4 py-2 text-left">
                                        Pemilik
                                    </th>
                                    <th className="px-4 py-2 text-left">
                                        Status
                                    </th>
                                    <th className="px-4 py-2 text-left">
                                        Jumlah Pengajuan
                                    </th>
                                    <th className="px-4 py-2 text-left">
                                        Didaftarkan
                                    </th>
                                    <th className="px-4 py-2 text-right">
                                        Aksi
                                    </th>
                                </tr>
                            </thead>
                            <tbody>
                                {sellersData.length === 0 && (
                                    <tr>
                                        <td
                                            colSpan="6"
                                            className="px-4 py-6 text-center text-gray-500"
                                        >
                                            Belum ada seller yang mendaftar.
                                        </td>
                                    </tr>
                                )}

                                {sellersData.map((seller) => (
                                    <tr
                                        key={seller.id}
                                        className="border-b last:border-b-0"
                                    >
                                        <td className="px-4 py-3 align-top">
                                            <div className="font-semibold text-gray-900">
                                                {seller.storeName}
                                            </div>
                                        </td>
                                        <td className="px-4 py-3 align-top">
                                            <div className="text-gray-800">
                                                {seller.userName || "-"}
                                            </div>
                                            <div className="text-gray-500 text-xs">
                                                {seller.userEmail}
                                            </div>
                                        </td>
                                        <td className="px-4 py-3 align-top">
                                            <span
                                                className={
                                                    "inline-flex items-center px-2 py-1 rounded-full border text-xs font-medium " +
                                                    statusBadgeClass(
                                                        seller.status
                                                    )
                                                }
                                            >
                                                {seller.status}
                                            </span>
                                        </td>
                                        <td className="px-4 py-3 align-top text-gray-600">
                                            <span className="font-semibold">
                                                {seller.submissionCount || 1}
                                            </span>
                                            <span className="text-xs text-gray-500 ml-1">
                                                kali
                                            </span>
                                        </td>
                                        <td className="px-4 py-3 align-top text-gray-600">
                                            {seller.createdAt}
                                        </td>
                                        <td className="px-4 py-3 align-top text-right">
                                            <div className="space-x-2">
                                                {/* Tombol Detail */}
                                                <Link
                                                    href={route(
                                                        "admin.sellers.show",
                                                        seller.id
                                                    )}
                                                    className="px-3 py-1 rounded text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700"
                                                >
                                                    Detail
                                                </Link>

                                                {/* Jika masih pending, muncul tombol approve/reject */}
                                                {seller.status ===
                                                    "PENDING" && (
                                                    <>
                                                <button
                                                    onClick={() =>
                                                        handleApprove(
                                                            seller.id
                                                        )
                                                    }
                                                    className="px-3 py-1 rounded text-xs font-semibold text-white bg-green-600 hover:bg-green-700"
                                                >
                                                    Terima
                                                </button>
                                                <button
                                                    onClick={() =>
                                                        handleReject(
                                                            seller.id
                                                        )
                                                    }
                                                    className="px-3 py-1 rounded text-xs font-semibold text-white bg-auburn hover:bg-opacity-90"
                                                >
                                                    Tolak
                                                </button>
                                                    </>
                                                )}
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                        {sellers.links && <Pagination links={sellers.links} />}
                    </div>
                </div>
            </div>
        </>
    );
}
