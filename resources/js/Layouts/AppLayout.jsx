import { Link, usePage } from "@inertiajs/react";
import Dropdown from "@/Components/Dropdown";
import SellerProtectedLink from "@/Components/SellerProtectedLink";

export default function AppLayout({ children }) {
    const { auth } = usePage().props;

    const buttonClass =
        "px-3 py-1 rounded text-white text-sm font-medium transition hover:opacity-90";
    const linkClass = "text-sm text-gray-700 hover:underline";

    return (
        <div className="min-h-screen bg-gray-50">
            {/* NAVBAR UTAMA */}
            <nav className="bg-white border-b shadow-sm sticky top-0 z-30">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center justify-between h-16 gap-4">
                        {/* Kiri: Logo */}
                        <div className="flex items-center gap-4 flex-shrink-0">
                            {/* Logo */}
                            <Link href={route("dashboard")}>
                                <div className="font-bold text-xl text-dark-slate">
                                    CekiCekiMart
                                </div>
                            </Link>
                        </div>

                        {/* Tengah: Search Bar */}
                        <div className="flex-1 max-w-2xl mx-4">
                            <form method="GET" action={route("dashboard")} className="relative">
                                <div className="relative flex items-center">
                                    <svg
                                        className="absolute left-3 w-5 h-5 text-gray-400 pointer-events-none"
                                        fill="none"
                                        stroke="currentColor"
                                        viewBox="0 0 24 24"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={2}
                                            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                                        />
                                    </svg>
                                    <input
                                        type="text"
                                        name="q"
                                        defaultValue={usePage().props.filters?.q || ""}
                                        placeholder="Cari di CekiCekiMart"
                                        className="w-full pl-10 pr-12 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-dark-slate focus:border-dark-slate text-sm"
                                    />
                                    <button
                                        type="submit"
                                        className="absolute right-2 px-3 py-1.5 rounded-md text-sm font-medium text-white bg-dark-slate hover:bg-opacity-90 transition"
                                    >
                                        Cari
                                    </button>
                                </div>
                            </form>
                        </div>

                        {/* Kanan: Menu User */}
                        <div className="flex items-center gap-3 flex-shrink-0">
                    {/* ROLE: PLATFORM ADMIN - Dropdown Menu Terstruktur */}
                    {auth?.user?.role === "platform_admin" && (
                        <Dropdown>
                            <Dropdown.Trigger>
                                <button
                                    type="button"
                                    className="flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium text-white bg-dark-slate hover:bg-opacity-90 transition"
                                >
                                    <svg
                                        className="w-5 h-5"
                                        fill="none"
                                        stroke="currentColor"
                                        viewBox="0 0 24 24"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={2}
                                            d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                                        />
                                    </svg>
                                    <span>{auth.user.name}</span>
                                    <svg
                                        className="w-4 h-4"
                                        fill="none"
                                        stroke="currentColor"
                                        viewBox="0 0 24 24"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={2}
                                            d="M19 9l-7 7-7-7"
                                        />
                                    </svg>
                                </button>
                            </Dropdown.Trigger>
                            <Dropdown.Content width="64">
                                {/* Header dengan info user */}
                                <div className="px-4 py-3 border-b border-gray-200 bg-gray-50">
                                    <p className="text-xs font-semibold text-gray-500 uppercase">
                                        Platform Admin
                                    </p>
                                    <p className="text-sm font-medium text-gray-900 mt-1">
                                        {auth.user.name}
                                    </p>
                                    <p className="text-xs text-gray-500 truncate">
                                        {auth.user.email}
                                    </p>
                                </div>

                                {/* Menu Items */}
                                <div className="py-1">
                                    <Dropdown.Link
                                        href={route("admin.dashboard")}
                                        className="flex items-center gap-3 px-4 py-2.5"
                                    >
                                        <svg
                                            className="w-5 h-5 text-gray-400"
                                            fill="none"
                                            stroke="currentColor"
                                            viewBox="0 0 24 24"
                                        >
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth={2}
                                                d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
                                            />
                                        </svg>
                                        <span>Dashboard Platform</span>
                                    </Dropdown.Link>

                                    <Dropdown.Link
                                        href={route("admin.sellers.index")}
                                        className="flex items-center gap-3 px-4 py-2.5"
                                    >
                                        <svg
                                            className="w-5 h-5 text-gray-400"
                                            fill="none"
                                            stroke="currentColor"
                                            viewBox="0 0 24 24"
                                        >
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth={2}
                                                d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"
                                            />
                                        </svg>
                                        <span>Kelola Penjual</span>
                                    </Dropdown.Link>
                                </div>

                                {/* Divider */}
                                <div className="border-t border-gray-200 my-1"></div>

                                {/* Logout */}
                                <Dropdown.Link
                                    href={route("logout")}
                                    method="post"
                                    as="button"
                                    className="flex items-center gap-3 px-4 py-2.5 text-red-600 hover:bg-red-50"
                                >
                                    <svg
                                        className="w-5 h-5 text-red-400"
                                        fill="none"
                                        stroke="currentColor"
                                        viewBox="0 0 24 24"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={2}
                                            d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                                        />
                                    </svg>
                                    <span>Logout</span>
                                </Dropdown.Link>
                            </Dropdown.Content>
                        </Dropdown>
                    )}

                    {/* ROLE: PENJUAL - Dropdown Menu Terstruktur */}
                    {auth?.user?.role === "penjual" && (
                        <Dropdown>
                            <Dropdown.Trigger>
                                <button
                                    type="button"
                                    className="flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium text-white bg-dark-slate hover:bg-opacity-90 transition"
                                >
                                    <svg
                                        className="w-5 h-5"
                                        fill="none"
                                        stroke="currentColor"
                                        viewBox="0 0 24 24"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={2}
                                            d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                                        />
                                    </svg>
                                    <span>{auth.user.name}</span>
                                    <svg
                                        className="w-4 h-4"
                                        fill="none"
                                        stroke="currentColor"
                                        viewBox="0 0 24 24"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={2}
                                            d="M19 9l-7 7-7-7"
                                        />
                                    </svg>
                                </button>
                            </Dropdown.Trigger>
                            <Dropdown.Content width="64">
                                {/* Header dengan info user */}
                                <div className="px-4 py-3 border-b border-gray-200 bg-gray-50">
                                    <p className="text-xs font-semibold text-gray-500 uppercase">
                                        Penjual
                                    </p>
                                    <p className="text-sm font-medium text-gray-900 mt-1">
                                        {auth.user.name}
                                    </p>
                                    <p className="text-xs text-gray-500 truncate">
                                        {auth.user.email}
                                    </p>
                                </div>

                                {/* Menu Items */}
                                <div className="py-1">
                                    <SellerProtectedLink
                                        href={route("seller.dashboard")}
                                        className="flex items-center gap-3 px-4 py-2.5"
                                    >
                                        <svg
                                            className="w-5 h-5 text-gray-400"
                                            fill="none"
                                            stroke="currentColor"
                                            viewBox="0 0 24 24"
                                        >
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth={2}
                                                d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
                                            />
                                        </svg>
                                        <span>Dashboard Penjual</span>
                                    </SellerProtectedLink>

                                    <Dropdown.Link
                                        href={route("seller.register")}
                                        className="flex items-center gap-3 px-4 py-2.5"
                                    >
                                        <svg
                                            className="w-5 h-5 text-gray-400"
                                            fill="none"
                                            stroke="currentColor"
                                            viewBox="0 0 24 24"
                                        >
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth={2}
                                                d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                                            />
                                        </svg>
                                        <span>Lengkapi Data Toko</span>
                                    </Dropdown.Link>

                                    <SellerProtectedLink
                                        href={route("seller.products.index")}
                                        className="flex items-center gap-3 px-4 py-2.5"
                                    >
                                        <svg
                                            className="w-5 h-5 text-gray-400"
                                            fill="none"
                                            stroke="currentColor"
                                            viewBox="0 0 24 24"
                                        >
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth={2}
                                                d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"
                                            />
                                        </svg>
                                        <span>Kelola Produk</span>
                                    </SellerProtectedLink>
                                </div>

                                {/* Divider */}
                                <div className="border-t border-gray-200 my-1"></div>

                                {/* Logout */}
                                <Dropdown.Link
                                    href={route("logout")}
                                    method="post"
                                    as="button"
                                    className="flex items-center gap-3 px-4 py-2.5 text-red-600 hover:bg-red-50"
                                >
                                    <svg
                                        className="w-5 h-5 text-red-400"
                                        fill="none"
                                        stroke="currentColor"
                                        viewBox="0 0 24 24"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={2}
                                            d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                                        />
                                    </svg>
                                    <span>Logout</span>
                                </Dropdown.Link>
                            </Dropdown.Content>
                        </Dropdown>
                    )}

                    {/* ROLE: TAMU (pengunjung umum) */}
                    {!auth?.user && (
                        <>
                            <Link href={route("login")} className={linkClass}>
                                Login
                            </Link>
                            <Link
                                href={route("register")}
                                className="px-3 py-1 rounded text-white text-sm font-medium transition bg-dark-slate hover:bg-opacity-90"
                            >
                                Daftar Penjual
                            </Link>
                        </>
                    )}
                        </div>
                    </div>
                </div>
            </nav>

            {/* ISI HALAMAN */}
            <main>{children}</main>
        </div>
    );
}
