import { Head, Link } from "@inertiajs/react";
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

    const cardStyle =
        "rounded-lg border bg-white shadow-sm px-4 py-3 flex flex-col justify-between";

    return (
        <>
            <Head title="Dashboard Platform Admin" />

            <div className="min-h-screen bg-gray-50">
                {/* ================= NAVBAR PLATFORM ADMIN ================ */}
                <nav className="flex items-center justify-between px-6 py-4 border-b bg-white">
                    <div
                        className="font-bold text-lg"
                        style={{ color: "#335c67" }}
                    >
                        CekiCekiMart — Platform Admin
                    </div>

                    <div className="flex items-center gap-3">
                        {/* SRS-09: Laporan penjual berdasarkan status */}
                        <a
                            href={route("admin.reports.sellers.status")}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="px-3 py-2 rounded-md text-xs font-semibold text-white shadow"
                            style={{ backgroundColor: "#335c67" }}
                        >
                            Laporan Penjual (Status)
                        </a>

                        {/* SRS-10: Laporan toko per provinsi */}
                        <a
                            href={route("admin.reports.sellers.province")}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="px-3 py-2 rounded-md text-xs font-semibold text-white shadow"
                            style={{ backgroundColor: "#335c67" }}
                        >
                            Laporan Toko per Provinsi
                        </a>

                        <a
                            href={route("admin.reports.products.rating")}
                            className="px-3 py-2 rounded-md text-xs font-semibold text-white shadow"
                            style={{ backgroundColor: "#335c67" }}
                        >
                            Laporan Produk (Rating)
                        </a>

                        <Link
                            href={route("dashboard")}
                            className="text-sm text-gray-600 hover:underline"
                        >
                            &larr; Kembali ke Beranda
                        </Link>
                    </div>
                </nav>

                {/* =================== DASHBOARD CONTENT =================== */}
                <div className="max-w-6xl mx-auto px-4 py-6 space-y-6">
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
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        {/* Total Ulasan */}
                        <div className={cardStyle}>
                            <div>
                                <div className="text-xs text-gray-500">
                                    Total Ulasan
                                </div>
                                <div className="text-2xl font-bold text-[#335c67] mt-1">
                                    {stats.totalReviews}
                                </div>
                                <div className="text-[11px] text-gray-500 mt-1">
                                    Jumlah seluruh komentar & rating yang masuk.
                                </div>
                            </div>

                            <a
                                href="#section-reviews"
                                className="mt-2 text-[11px] text-[#335c67] underline self-end"
                            >
                                Detail ulasan
                            </a>
                        </div>

                        {/* Pengunjung Unik */}
                        <div className={cardStyle}>
                            <div>
                                <div className="text-xs text-gray-500">
                                    Pengunjung Pernah Review
                                </div>
                                <div className="text-2xl font-bold text-[#335c67] mt-1">
                                    {stats.uniqueReviewers}
                                </div>
                                <div className="text-[11px] text-gray-500 mt-1">
                                    Total pengunjung unik yang pernah memberi
                                    komentar & rating.
                                </div>
                            </div>

                            <a
                                href="#section-visitors"
                                className="mt-2 text-[11px] text-[#335c67] underline self-end"
                            >
                                Detail pengunjung & komentarnya
                            </a>
                        </div>

                        {/* Penjual Aktif */}
                        <div className={cardStyle}>
                            <div>
                                <div className="text-xs text-gray-500">
                                    Penjual Aktif
                                </div>
                                <div className="text-2xl font-bold text-[#335c67] mt-1">
                                    {stats.activeSellers}
                                </div>
                                <div className="text-[11px] text-gray-500 mt-1">
                                    Toko dengan status <strong>ACTIVE</strong>.
                                </div>
                            </div>

                            <Link
                                href={route("admin.sellers.index")}
                                className="mt-2 text-[11px] text-[#335c67] underline self-end"
                            >
                                Detail penjual
                            </Link>
                        </div>

                        {/* Penjual Tidak Aktif */}
                        <div className={cardStyle}>
                            <div>
                                <div className="text-xs text-gray-500">
                                    Penjual Tidak Aktif
                                </div>
                                <div className="text-2xl font-bold text-[#335c67] mt-1">
                                    {stats.inactiveSellers}
                                </div>
                                <div className="text-[11px] text-gray-500 mt-1">
                                    Toko berstatus PENDING atau REJECTED.
                                </div>
                            </div>

                            <Link
                                href={route("admin.sellers.index")}
                                className="mt-2 text-[11px] text-[#335c67] underline self-end"
                            >
                                Detail penjual
                            </Link>
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
                                                    "rgba(51, 92, 103, 0.7)",
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
                                                    "rgba(148, 210, 189, 0.8)",
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
                                                    "rgba(51, 92, 103, 0.8)",
                                                    "rgba(242, 163, 101, 0.8)",
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
                                                        "rgba(251, 191, 36, 0.8)",
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
                                Menampilkan maksimal 20 ulasan terakhir.
                            </span>
                        </div>

                        {recentReviews.length === 0 ? (
                            <p className="text-xs text-gray-500">
                                Belum ada komentar atau rating yang masuk.
                            </p>
                        ) : (
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
                                        {recentReviews.map((r) => (
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
                        )}
                    </div>
                </div>
            </div>
        </>
    );
}
