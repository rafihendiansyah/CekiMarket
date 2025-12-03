import { Link, usePage } from "@inertiajs/react";

export default function AppLayout({ children }) {
    const { auth } = usePage().props;

    const buttonClass =
        "px-3 py-1 rounded text-white text-sm font-medium transition hover:opacity-90";
    const linkClass = "text-sm text-gray-700 hover:underline";

    return (
        <div className="min-h-screen bg-gray-50">
            {/* NAVBAR UTAMA */}
            <nav className="flex items-center justify-between px-6 py-4 bg-white border-b">
                {/* Logo */}
                <div className="font-bold text-xl" style={{ color: "#335c67" }}>
                    CekiCekiMart
                </div>

                {/* Menu Kanan */}
                <div className="flex items-center gap-4">
                    {/* ROLE: PLATFORM ADMIN */}
                    {auth?.user?.role === "platform_admin" && (
                        <>
                            <Link
                                href={route("admin.dashboard")}
                                className={buttonClass}
                                style={{ backgroundColor: "#335c67" }}
                            >
                                Dashboard Platform
                            </Link>
                            <Link
                                href={route("admin.sellers.index")}
                                className={buttonClass}
                                style={{ backgroundColor: "#335c67" }}
                            >
                                Kelola Penjual
                            </Link>
                        </>
                    )}

                    {/* ROLE: PENJUAL */}
                    {auth?.user?.role === "penjual" && (
                        <>
                            <Link
                                href={route("seller.register")}
                                className={linkClass}
                            >
                                Lengkapi Data Toko
                            </Link>

                            <Link
                                href={route("seller.products.index")}
                                className={buttonClass}
                                style={{ backgroundColor: "#335c67" }}
                            >
                                Kelola Produk
                            </Link>
                        </>
                    )}

                    {/* ROLE: TAMU (pengunjung umum) */}
                    {!auth?.user && (
                        <>
                            <Link href={route("login")} className={linkClass}>
                                Login
                            </Link>
                            <Link
                                href={route("register")}
                                className={buttonClass}
                                style={{ backgroundColor: "#335c67" }}
                            >
                                Daftar Penjual
                            </Link>
                        </>
                    )}

                    {/* Jika sudah login */}
                    {auth?.user && (
                        <>
                            <span className="text-sm text-gray-700">
                                Hai, {auth.user.name}
                            </span>

                            <Link
                                href={route("logout")}
                                method="post"
                                as="button"
                                className="text-sm text-gray-600 hover:underline"
                            >
                                Logout
                            </Link>
                        </>
                    )}
                </div>
            </nav>

            {/* ISI HALAMAN */}
            <main>{children}</main>
        </div>
    );
}
