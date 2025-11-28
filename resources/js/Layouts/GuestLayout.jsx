import ApplicationLogo from "@/Components/ApplicationLogo";
import { Link } from "@inertiajs/react";

export default function GuestLayout({ children }) {
    return (
        <div className="min-h-screen flex flex-col items-center bg-white text-gray-900">
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
