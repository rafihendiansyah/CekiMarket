import { Head, Link } from "@inertiajs/react";

export default function Welcome({ auth }) {
    return (
        <>
            <Head title="CekiCekiMart" />

            <div className="min-h-screen flex flex-col items-center justify-center bg-white text-gray-900">
                {/* Nama Web */}
                <h1 className="text-4xl font-extrabold mb-3">CekiCekiMart</h1>

                <p className="mb-8 text-center max-w-md text-gray-600">
                    Marketplace Terbaik.
                </p>

                {/* Tombol Login / Registrasi */}
                <div className="flex gap-4">
                    {auth?.user ? (
                        <Link
                            href={route("dashboard")}
                            className="px-6 py-2 rounded-lg font-semibold text-white"
                            style={{ backgroundColor: "#335c67" }}
                        >
                            Dashboard
                        </Link>
                    ) : (
                        <>
                            <Link
                                href={route("login")}
                                className="px-6 py-2 rounded-lg font-semibold text-white"
                                style={{ backgroundColor: "#335c67" }}
                            >
                                Login
                            </Link>

                            <Link
                                href={route("register")}
                                className="px-6 py-2 rounded-lg font-semibold text-white"
                                style={{ backgroundColor: "#335c67" }}
                            >
                                Registrasi
                            </Link>
                        </>
                    )}
                </div>
            </div>
        </>
    );
}
