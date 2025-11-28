import { Head, Link, router, usePage } from "@inertiajs/react";

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

    return (
        <>
            <Head title="Verifikasi Seller - Platform Admin" />

            <div className="min-h-screen bg-gray-50">
                <div className="max-w-5xl mx-auto py-8 px-4">
                    {/* Header */}
                    <div className="flex items-center justify-between mb-6">
                        <div>
                            <h1 className="text-2xl font-bold text-[#335c67]">
                                Panel Platform Admin
                            </h1>
                            <p className="text-sm text-gray-600">
                                Verifikasi pendaftaran penjual (SELLER) di
                                CekiCekiMart.
                            </p>
                        </div>

                        <Link
                            href={route("dashboard")}
                            className="text-sm text-gray-600 hover:underline"
                        >
                            &larr; Kembali ke Dashboard
                        </Link>
                    </div>

                    {/* Flash message */}
                    {flash?.success && (
                        <div className="mb-4 rounded border border-emerald-300 bg-emerald-50 px-4 py-2 text-sm text-emerald-800">
                            {flash.success}
                        </div>
                    )}

                    {/* Tabel sellers */}
                    <div className="bg-white shadow rounded-lg overflow-hidden">
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
                                        Didaftarkan
                                    </th>
                                    <th className="px-4 py-2 text-right">
                                        Aksi
                                    </th>
                                </tr>
                            </thead>
                            <tbody>
                                {sellers.length === 0 && (
                                    <tr>
                                        <td
                                            colSpan="5"
                                            className="px-4 py-6 text-center text-gray-500"
                                        >
                                            Belum ada seller yang mendaftar.
                                        </td>
                                    </tr>
                                )}

                                {sellers.map((seller) => (
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
                                                            className="px-3 py-1 rounded text-xs font-semibold text-white"
                                                            style={{
                                                                backgroundColor:
                                                                    "#335c67",
                                                            }}
                                                        >
                                                            Terima
                                                        </button>
                                                        <button
                                                            onClick={() =>
                                                                handleReject(
                                                                    seller.id
                                                                )
                                                            }
                                                            className="px-3 py-1 rounded text-xs font-semibold text-red-700 border border-red-300 bg-red-50"
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
                    </div>
                </div>
            </div>
        </>
    );
}
