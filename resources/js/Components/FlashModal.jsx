import React, { useEffect } from "react";

export default function FlashModal({ message, type = "success", onClose }) {
    useEffect(() => {
        const timer = setTimeout(onClose, 3000);
        return () => clearTimeout(timer);
    }, []);

    const isSuccess = type === "success";

    return (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
            <div className="bg-white rounded-2xl shadow-xl p-8 w-96 text-center animate-fade-in">
                
                {/* Icon */}
                <div
                    className={`w-20 h-20 mx-auto rounded-full flex items-center justify-center text-white text-4xl shadow-md`}
                    style={{ backgroundColor: "#335c67" }}
                >

                {isSuccess ? (
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
                            d="M5 13l4 4L19 7"
                        />
                    </svg>
                ) : (
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
                            d="M12 9v2m0 4h.01M12 6a9 9 0 100 18 9 9 0 000-18z"
                        />
                    </svg>
                )}

                </div>

                {/* Judul */}
                <h2 className="text-2xl font-bold text-gray-800 mt-4">
                    {isSuccess ? "Berhasil!" : "Terjadi Kesalahan"}
                </h2>

                {/* Pesan */}
                <p className="text-gray-600 mt-2">{message}</p>

                {/* Tombol */}
                <button
                    onClick={onClose}
                    className="mt-6 px-4 py-2 w-full rounded-lg text-white font-semibold"
                    style={{ backgroundColor: "#335c67" }}
                >
                    Tutup
                </button>
            </div>
        </div>
    );
}