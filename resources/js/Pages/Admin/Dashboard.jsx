import { Head, Link } from "@inertiajs/react";
import { useState } from "react";
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    ArcElement,
    Tooltip,
    Legend,
} from "chart.js";
import { Bar, Doughnut } from "react-chartjs-2";

ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    ArcElement,
    Tooltip,
    Legend
);

export default function AdminDashboard({
    stats,
    categoryStats = [],
    provinceStats = [],
    visitorStats = [],
    recentReviews = [],
    charts = {},
}) {
    const categoryChart = charts.category || { labels: [], data: [] };
    const provinceChart = charts.province || { labels: [], data: [] };
    const sellerStatusChart = charts.sellerStatus || { labels: [], data: [] };
    const topVisitorsChart = charts.topVisitors || { labels: [], data: [] };

    // Pagination untuk review terbaru
    const reviewsPerPage = 5;
    const [currentReviewPage, setCurrentReviewPage] = useState(0);
    const totalReviewPages = Math.ceil(recentReviews.length / reviewsPerPage);
    const startIndex = currentReviewPage * reviewsPerPage;
    const endIndex = startIndex + reviewsPerPage;
    const currentReviews = recentReviews.slice(startIndex, endIndex);

    const handlePreviousReviews = () => {
        setCurrentReviewPage((prev) => Math.max(0, prev - 1));
    };

    const handleNextReviews = () => {
        setCurrentReviewPage((prev) => Math.min(totalReviewPages - 1, prev + 1));
    };

    const cardStyle =
        "rounded-lg border bg-white shadow-sm px-4 py-3 flex flex-col justify-between";

    return (
        <>
            <Head title="Dashboard Platform Admin" />

            <div className="min-h-screen bg-gray-50 flex">
                {/* ================= SIDEBAR ================ */}
                <aside className="w-64 bg-white border-r border-gray-200 flex-shrink-0 flex flex-col relative z-10">
                    <div className="p-6 border-b border-gray-200">
                        <div className="font-bold text-xl text-dark-slate">PLATFORM ADMIN</div>
                    </div>
                    <nav className="p-4 space-y-1 flex-1 overflow-y-auto">
                        <Link
                            href={route("admin.dashboard")}
                            className={`flex items-center gap-3 px-4 py-3 rounded-lg transition cursor-pointer relative z-10 ${
                                route().current('admin.dashboard')
                                    ? 'bg-dark-slate text-white'
                                    : 'text-gray-700 hover:bg-gray-100'
                            }`}
                            preserveState={false}
                        >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                            </svg>
                            <span className="font-medium">Dashboard</span>
                        </Link>
                        <Link
                            href={route("admin.sellers.index")}
                            className={`flex items-center gap-3 px-4 py-3 rounded-lg transition cursor-pointer relative z-10 ${
                                route().current('admin.sellers.*')
                                    ? 'bg-auburn text-white'
                                    : 'text-gray-700 hover:bg-gray-100'
                            }`}
                            preserveState={false}
                        >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                            </svg>
                            <span className="font-medium">Persetujuan Penjual</span>
                        </Link>
                        <div className="pt-4 mt-4 border-t border-gray-200">
                            <div className="px-4 py-2 text-xs font-semibold text-gray-500 uppercase">Laporan</div>
                            <a
                                href={route("admin.reports.sellers.status")}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center gap-3 px-4 py-3 rounded-lg text-gray-700 hover:bg-gray-100 transition"
                            >
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                </svg>
                                <span className="font-medium">Laporan Penjual (Status)</span>
                            </a>
                            <a
                                href={route("admin.reports.sellers.province")}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center gap-3 px-4 py-3 rounded-lg text-gray-700 hover:bg-gray-100 transition"
                            >
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                </svg>
                                <span className="font-medium">Laporan Toko per Provinsi</span>
                            </a>
                            <a
                                href={route("admin.reports.products.rating")}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center gap-3 px-4 py-3 rounded-lg text-gray-700 hover:bg-gray-100 transition"
                            >
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                                </svg>
                                <span className="font-medium">Laporan Produk (Rating)</span>
                            </a>
                        </div>
                    </nav>
                    <div className="mt-auto p-4 border-t border-gray-200 bg-white">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-dark-slate rounded-full flex items-center justify-center text-white font-semibold">
                                A
                            </div>
                            <div className="flex-1">
                                <div className="text-sm font-medium text-gray-900">Administrator</div>
                                <div className="text-xs text-gray-500">Platform Manager</div>
                            </div>
                        </div>
                    </div>
                </aside>

                {/* ================= MAIN CONTENT ================ */}
                <div className="flex-1 flex flex-col">
                    {/* ================= NAVBAR PLATFORM ADMIN ================ */}
                    <nav className="flex items-center justify-between px-6 py-4 border-b bg-white">
                        <div className="font-bold text-lg text-dark-slate">
                            Dashboard Platform
                        </div>
                        <Link
                            href={route("dashboard")}
                            className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition"
                        >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                            </svg>
                            Kembali ke Beranda
                        </Link>
                    </nav>

                    {/* =================== DASHBOARD CONTENT =================== */}
                    <div className="flex-1 overflow-y-auto bg-gray-50">
                        <div className="max-w-6xl mx-auto px-6 py-6 space-y-6">
                    {/* Judul Halaman */}
                    <div>
                        <h1 className="text-xl font-bold text-gray-800">
                            Dashboard Statistik Platform
                        </h1>
                        <p className="text-sm text-gray-600 mt-1">
                            Menampilkan sebaran produk, toko, penjual, dan
                            pengunjung yang memberikan komentar & rating.
                        </p>
                    </div>

                            {/* =================== KARTU STATISTIK =================== */}
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                                {/* Total Ulasan */}
                                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                                    <div className="flex items-center justify-between mb-2">
                                        <div className="text-sm text-gray-600">Total Ulasan</div>
                                        <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                                            <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                                            </svg>
                                        </div>
                                    </div>
                                    <div className="text-3xl font-bold text-dark-slate">{stats.totalReviews}</div>
                                    <div className="text-xs text-gray-500 mt-1">Jumlah seluruh komentar & rating</div>
                                </div>

                                {/* Pengunjung Unik */}
                                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                                    <div className="flex items-center justify-between mb-2">
                                        <div className="text-sm text-gray-600">Pengunjung Review</div>
                                        <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                                            <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                                            </svg>
                                        </div>
                                    </div>
                                    <div className="text-3xl font-bold text-dark-slate">{stats.uniqueReviewers}</div>
                                    <div className="text-xs text-gray-500 mt-1">Pengunjung unik yang pernah review</div>
                                </div>

                                {/* Penjual Aktif */}
                                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                                    <div className="flex items-center justify-between mb-2">
                                        <div className="text-sm text-gray-600">Penjual Aktif</div>
                                        <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                                            <svg className="w-5 h-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                            </svg>
                                        </div>
                                    </div>
                                    <div className="text-3xl font-bold text-dark-slate">{stats.activeSellers}</div>
                                    <div className="text-xs text-gray-500 mt-1">Toko dengan status ACTIVE</div>
                                </div>

                                {/* Penjual Tidak Aktif */}
                                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                                    <div className="flex items-center justify-between mb-2">
                                        <div className="text-sm text-gray-600">Penjual Tidak Aktif</div>
                                        <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center">
                                            <svg className="w-5 h-5 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                            </svg>
                                        </div>
                                    </div>
                                    <div className="text-3xl font-bold text-dark-slate">{stats.inactiveSellers}</div>
                                    <div className="text-xs text-gray-500 mt-1">PENDING atau REJECTED</div>
                                </div>
                            </div>

                    {/* ================= CHART BARIS 1 ================= */}
                    <div className="grid md:grid-cols-2 gap-4">
                        {/* Produk per kategori */}
                        <div className="bg-white rounded-lg shadow-sm border p-3">
                            <h2 className="text-sm font-semibold text-gray-800 mb-2">
                                Sebaran Produk Berdasarkan Kategori
                            </h2>

                            {categoryChart.labels.length === 0 ? (
                                <p className="text-xs text-gray-500">
                                    Belum ada produk aktif yang memiliki
                                    kategori.
                                </p>
                            ) : (
                                <Bar
                                    data={{
                                        labels: categoryChart.labels,
                                        datasets: [
                                            {
                                                label: "Jumlah Produk",
                                                data: categoryChart.data,
                                                backgroundColor:
                                                    "#335C67",
                                            },
                                        ],
                                    }}
                                    options={{
                                        responsive: true,
                                        plugins: { legend: { display: false } },
                                        scales: {
                                            x: {
                                                ticks: { font: { size: 10 } },
                                            },
                                            y: {
                                                beginAtZero: true,
                                                ticks: { stepSize: 1 },
                                            },
                                        },
                                    }}
                                    height={170}
                                />
                            )}
                        </div>

                        {/* Toko per provinsi */}
                        <div className="bg-white rounded-lg shadow-sm border p-3">
                            <h2 className="text-sm font-semibold text-gray-800 mb-2">
                                Sebaran Toko Berdasarkan Provinsi
                            </h2>

                            {provinceChart.labels.length === 0 ? (
                                <p className="text-xs text-gray-500">
                                    Belum ada penjual yang mengisi provinsi
                                    alamat.
                                </p>
                            ) : (
                                <Bar
                                    data={{
                                        labels: provinceChart.labels,
                                        datasets: [
                                            {
                                                label: "Jumlah Toko",
                                                data: provinceChart.data,
                                                backgroundColor:
                                                    "#E09F3E",
                                            },
                                        ],
                                    }}
                                    options={{
                                        responsive: true,
                                        plugins: { legend: { display: false } },
                                        scales: {
                                            x: { ticks: { font: { size: 9 } } },
                                            y: {
                                                beginAtZero: true,
                                                ticks: { stepSize: 1 },
                                            },
                                        },
                                    }}
                                    height={170}
                                />
                            )}
                        </div>
                    </div>

                    {/* ================= BARIS 2: STATUS PENJUAL + TOP VISITOR ================= */}
                    <div className="grid md:grid-cols-2 gap-4">
                        {/* Status Penjual */}
                        <div className="bg-white rounded-lg shadow-sm border p-3">
                            <h2 className="text-sm font-semibold text-gray-800 mb-2">
                                Status Penjual (Aktif vs Tidak Aktif)
                            </h2>

                            {sellerStatusChart.data.reduce(
                                (a, b) => a + b,
                                0
                            ) === 0 ? (
                                <p className="text-xs text-gray-500">
                                    Belum ada penjual yang terdaftar.
                                </p>
                            ) : (
                                <Doughnut
                                    data={{
                                        labels: sellerStatusChart.labels,
                                        datasets: [
                                            {
                                                data: sellerStatusChart.data,
                                                backgroundColor: [
                                                    "#335C67",
                                                    "#E09F3E",
                                                ],
                                            },
                                        ],
                                    }}
                                    options={{
                                        responsive: true,
                                        plugins: {
                                            legend: {
                                                position: "bottom",
                                                labels: { font: { size: 11 } },
                                            },
                                        },
                                    }}
                                    height={170}
                                />
                            )}
                        </div>

                        {/* Pengunjung yang Review */}
                        <div
                            id="section-visitors"
                            className="bg-white rounded-lg shadow-sm border p-3 flex flex-col"
                        >
                            <div className="flex items-center justify-between mb-2">
                                <h2 className="text-sm font-semibold text-gray-800">
                                    Pengunjung yang Memberikan Komentar & Rating
                                </h2>
                                <span className="text-[11px] text-gray-500">
                                    Total: {stats.uniqueReviewers} pengunjung
                                </span>
                            </div>

                            {topVisitorsChart.labels.length > 0 ? (
                                <div className="mb-2">
                                    <Bar
                                        data={{
                                            labels: topVisitorsChart.labels,
                                            datasets: [
                                                {
                                                    label: "Jumlah Review",
                                                    data: topVisitorsChart.data,
                                                    backgroundColor:
                                                        "#FFF3B0",
                                                },
                                            ],
                                        }}
                                        options={{
                                            responsive: true,
                                            plugins: {
                                                legend: { display: false },
                                            },
                                            scales: {
                                                x: {
                                                    ticks: {
                                                        font: { size: 9 },
                                                    },
                                                },
                                                y: {
                                                    beginAtZero: true,
                                                    ticks: { stepSize: 1 },
                                                },
                                            },
                                        }}
                                        height={160}
                                    />
                                </div>
                            ) : (
                                <p className="text-xs text-gray-500 mb-2">
                                    Belum ada pengunjung yang memberikan
                                    komentar dan rating.
                                </p>
                            )}

                            {/* Tabel kecil */}
                            {visitorStats.length > 0 && (
                                <div className="mt-1 overflow-x-auto">
                                    <table className="min-w-full text-[11px]">
                                        <thead>
                                            <tr className="text-left text-gray-500 border-b">
                                                <th className="py-1 pr-2">
                                                    Nama
                                                </th>
                                                <th className="py-1 pr-2">
                                                    Email
                                                </th>
                                                <th className="py-1 text-right">
                                                    Jumlah Review
                                                </th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {visitorStats.map((v, idx) => (
                                                <tr
                                                    key={idx}
                                                    className="border-b last:border-b-0"
                                                >
                                                    <td className="py-1 pr-2 text-gray-800">
                                                        {v.name}
                                                    </td>
                                                    <td className="py-1 pr-2 text-gray-500">
                                                        {v.email}
                                                    </td>
                                                    <td className="py-1 text-right text-gray-800">
                                                        {v.review_count}
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* =================== REVIEW TERBARU =================== */}
                    <div
                        id="section-reviews"
                        className="bg-white rounded-lg shadow-sm border p-3"
                    >
                        <div className="flex items-center justify-between mb-2">
                            <h2 className="text-sm font-semibold text-gray-800">
                                Daftar Review Terbaru
                            </h2>
                            <span className="text-[11px] text-gray-500">
                                {recentReviews.length > 0
                                    ? `Menampilkan ${startIndex + 1}-${Math.min(endIndex, recentReviews.length)} dari ${recentReviews.length} ulasan`
                                    : "Belum ada ulasan"}
                            </span>
                        </div>

                        {recentReviews.length === 0 ? (
                            <p className="text-xs text-gray-500">
                                Belum ada komentar atau rating yang masuk.
                            </p>
                        ) : (
                            <>
                                <div className="overflow-x-auto">
                                    <table className="min-w-full text-[11px]">
                                        <thead>
                                            <tr className="text-left text-gray-500 border-b">
                                                <th className="py-1 pr-2">
                                                    Produk
                                                </th>
                                                <th className="py-1 pr-2">
                                                    Pengunjung
                                                </th>
                                                <th className="py-1 pr-2">Email</th>
                                                <th className="py-1 pr-2">
                                                    Rating
                                                </th>
                                                <th className="py-1 pr-2">
                                                    Komentar
                                                </th>
                                                <th className="py-1">Tanggal</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {currentReviews.map((r) => (
                                                <tr
                                                    key={r.id}
                                                    className="border-b last:border-b-0"
                                                >
                                                    <td className="py-1 pr-2 text-gray-800">
                                                        {r.product_name || "-"}
                                                    </td>
                                                    <td className="py-1 pr-2 text-gray-800">
                                                        {r.visitor_name || "-"}
                                                    </td>
                                                    <td className="py-1 pr-2 text-gray-500">
                                                        {r.visitor_email || "-"}
                                                    </td>
                                                    <td className="py-1 pr-2 text-gray-800">
                                                        {r.rating}/5
                                                    </td>
                                                    <td className="py-1 pr-2 text-gray-800">
                                                        <span className="block max-w-xs truncate">
                                                            {r.comment || "-"}
                                                        </span>
                                                    </td>
                                                    <td className="py-1 text-gray-500">
                                                        {r.created_at}
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>

                                {/* Tombol Pagination */}
                                {totalReviewPages > 1 && (
                                    <div className="flex items-center justify-between mt-3 pt-3 border-t">
                                        <button
                                            onClick={handlePreviousReviews}
                                            disabled={currentReviewPage === 0}
                                            className={`px-4 py-2 rounded-md text-sm font-semibold transition-colors ${
                                                currentReviewPage === 0
                                                    ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                                                    : "bg-dark-slate text-white hover:bg-opacity-90"
                                            }`}
                                        >
                                            ← Sebelumnya
                                        </button>
                                        <span className="text-xs text-gray-600">
                                            Halaman {currentReviewPage + 1} dari {totalReviewPages}
                                        </span>
                                        <button
                                            onClick={handleNextReviews}
                                            disabled={currentReviewPage >= totalReviewPages - 1}
                                            className={`px-4 py-2 rounded-md text-sm font-semibold transition-colors ${
                                                currentReviewPage >= totalReviewPages - 1
                                                    ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                                                    : "bg-dark-slate text-white hover:bg-opacity-90"
                                            }`}
                                        >
                                            Selanjutnya →
                                        </button>
                                    </div>
                                )}
                            </>
                        )}
                        </div>
                    </div>
                </div>
            </div>
            </div>
        </>
    );
}
