import ApplicationLogo from "@/Components/ApplicationLogo";
import FlashModal from "@/Components/FlashModal";
import { usePage } from "@inertiajs/react";
import React, { useState, useEffect } from "react";

export default function GuestLayout({ children }) {
    const { flash } = usePage().props;
    const [showFlash, setShowFlash] = useState(!!flash?.success);

    useEffect(() => {
        if (flash?.success) {
            setShowFlash(true);
        }
    }, [flash]);

    return (
        <div className="min-h-screen flex flex-col items-center bg-white text-gray-900">

            {/* FLASH MODAL */}
            {showFlash && flash?.success && (
                <FlashModal
                    message={flash.success}
                    type="success"
                    onClose={() => setShowFlash(false)}
                />
            )}

            {/* BAGIAN BRANDING */}
            <div className="mt-10 mb-6 text-center">
                <h1
                    className="text-3xl font-extrabold tracking-wide"
                    style={{ color: "#335c67" }}
                >
                    CekiCekiMart
                </h1>
                <p className="text-gray-500 text-sm mt-1">
                    Marketplace Terbaik.
                </p>
            </div>

            {/* WRAPPER FORM */}
            <div className="w-full sm:max-w-md px-6 py-6 bg-white shadow-lg rounded-lg border">
                {children}
            </div>
        </div>
    );
}