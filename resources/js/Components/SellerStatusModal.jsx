import { Link } from "@inertiajs/react";

export default function SellerStatusModal({
    type,
    submissionCount,
    onClose,
}) {
    const isPending = type === "pending";
    const isRejected = type === "rejected";

    return (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
            <div className="bg-white rounded-2xl shadow-xl p-8 w-96 text-center animate-fade-in">
                {/* Icon */}
                <div
                    className={`w-20 h-20 mx-auto rounded-full flex items-center justify-center text-white text-4xl shadow-md ${
                        isPending
                            ? "bg-yellow-500"
                            : isRejected
                            ? "bg-red-500"
                            : "bg-gray-500"
                    }`}
                >
                    {isPending ? (
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="w-10 h-10 text-white"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                            strokeWidth={3}
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M12 9v2m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                            />
                        </svg>
                    ) : isRejected ? (
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="w-10 h-10 text-white"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                            strokeWidth={3}
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M6 18L18 6M6 6l12 12"
                            />
                        </svg>
                    ) : null}
                </div>

                {/* Judul */}
                <h2 className="text-2xl font-bold text-gray-800 mt-4">
                    {isPending
                        ? "Menunggu Verifikasi"
                        : isRejected
                        ? "Pengajuan Ditolak"
                        : "Status Toko"}
                </h2>

                {/* Pesan */}
                <p className="text-gray-600 mt-2">
                    {isPending
                        ? "Toko Anda sedang menunggu verifikasi dari Platform Admin. Silakan tunggu hingga status toko Anda menjadi ACTIVE."
                        : isRejected
                        ? `Pengajuan pendaftaran toko Anda telah ditolak. Anda telah mengajukan sebanyak ${submissionCount} kali. Silakan lengkapi kembali data toko dan ajukan ulang.`
                        : "Status toko Anda tidak diketahui."}
                </p>

                {/* Tombol */}
                <div className="mt-6 flex gap-3">
                    {isRejected && (
                        <Link
                            href={route("seller.register")}
                            className="flex-1 px-4 py-2 rounded-lg text-white font-semibold hover:opacity-90"
                            style={{ backgroundColor: "#335c67" }}
                        >
                            Ajukan Ulang
                        </Link>
                    )}
                    <button
                        onClick={onClose}
                        className={`px-4 py-2 rounded-lg font-semibold ${
                            isRejected
                                ? "flex-1 border border-gray-300 text-gray-700 hover:bg-gray-50"
                                : "w-full text-white"
                        }`}
                        style={
                            !isRejected
                                ? { backgroundColor: "#335c67" }
                                : undefined
                        }
                    >
                        {isRejected ? "Tutup" : "Mengerti"}
                    </button>
                </div>
            </div>
        </div>
    );
}

