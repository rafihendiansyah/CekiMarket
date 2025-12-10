import { Head, Link } from "@inertiajs/react";
import { useState, useEffect } from "react";
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
import SellerStatusModal from "@/Components/SellerStatusModal";

ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    ArcElement,
    Tooltip,
    Legend
);

export default function SellerDashboard({
    stockChart = { labels: [], data: [] },
    ratingChart = { labels: [], data: [], counts: [] },
    provinceChart = { labels: [], data: [] },
    products = [],
    storeName = '',
    totalReviews = 0,
    showPendingModal = false,
    showRejectedModal = false,
    submissionCount = 1,
}) {
    const [showModal, setShowModal] = useState(false);
    const [modalType, setModalType] = useState(null);

    useEffect(() => {
        if (showPendingModal) {
            setModalType("pending");
            setShowModal(true);
        } else if (showRejectedModal) {
            setModalType("rejected");
            setShowModal(true);
        }
    }, [showPendingModal, showRejectedModal]);

    const cardStyle =
        "rounded-lg border bg-white shadow-sm px-4 py-3 flex flex-col justify-between";

    return (
        <>
            <Head title="Dashboard Penjual" />

            {/* Modal untuk status PENDING atau REJECTED */}
            {showModal && (
                <SellerStatusModal
                    type={modalType}
                    submissionCount={submissionCount}
                    onClose={() => setShowModal(false)}
                />
            )}

            <div className="min-h-screen bg-gray-50 flex">
                {/* ================= SIDEBAR ================ */}
                <aside className="w-64 bg-white border-r border-gray-200 flex-shrink-0 flex flex-col">
                    <div className="p-6 border-b border-gray-200">
                        <div className="font-bold text-xl text-dark-slate">CekiCekiMart</div>
                        <div className="text-xs text-gray-500 mt-1">Dashboard Penjual</div>
                    </div>
                    <nav className="p-4 space-y-1">
                        <Link
                            href={route("seller.dashboard")}
                            className={`flex items-center gap-3 px-4 py-3 rounded-lg transition ${
                                route().current('seller.dashboard')
                                    ? 'bg-dark-slate text-white'
                                    : 'text-gray-700 hover:bg-gray-100'
                            }`}
                        >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                            </svg>
                            <span className="font-medium">Dashboard</span>
                        </Link>
                        <Link
                            href={route("seller.products.index")}
                            className={`flex items-center gap-3 px-4 py-3 rounded-lg transition ${
                                route().current('seller.products.*')
                                    ? 'bg-dark-slate text-white'
                                    : 'text-gray-700 hover:bg-gray-100'
                            }`}
                        >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                            </svg>
                            <span className="font-medium">Kelola Produk</span>
                        </Link>
                        <div className="pt-4 mt-4 border-t border-gray-200">
                            <div className="px-4 py-2 text-xs font-semibold text-gray-500 uppercase">Laporan</div>
                            <a
                                href={route("seller.reports.products.stock")}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center gap-3 px-4 py-3 rounded-lg text-gray-700 hover:bg-gray-100 transition"
                            >
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                </svg>
                                <span className="font-medium">Laporan Stok</span>
                            </a>
                            <a
                                href={route("seller.reports.products.rating")}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center gap-3 px-4 py-3 rounded-lg text-gray-700 hover:bg-gray-100 transition"
                            >
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                                </svg>
                                <span className="font-medium">Laporan Rating</span>
                            </a>
                            <a
                                href={route("seller.reports.products.to-restock")}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center gap-3 px-4 py-3 rounded-lg text-gray-700 hover:bg-gray-100 transition"
                            >
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                                </svg>
                                <span className="font-medium">Stok Segera Dipesan</span>
                            </a>
                        </div>
                    </nav>
                    <div className="mt-auto p-4 border-t border-gray-200 bg-white">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-dark-slate rounded-full flex items-center justify-center text-white font-semibold">
                                {storeName ? storeName.charAt(0).toUpperCase() : 'S'}
                            </div>
                            <div className="flex-1">
                                <div className="text-sm font-medium text-gray-900">{storeName || 'Seller Store'}</div>
                                <div className="text-xs text-gray-500">Pemilik Toko</div>
                            </div>
                        </div>
                    </div>
                </aside>

                {/* ================= MAIN CONTENT ================ */}
                <div className="flex-1 flex flex-col">
                    {/* ================= NAVBAR PENJUAL ================ */}
                    <nav className="flex items-center justify-between px-6 py-4 border-b bg-white">
                        <div className="font-bold text-lg text-dark-slate">
                            Dashboard Penjual
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
                            {/* Header Section */}
                            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-4">
                                        <div className="w-16 h-16 bg-dark-slate rounded-lg flex items-center justify-center flex-shrink-0">
                                            <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                                            </svg>
                                        </div>
                                        <div>
                                            <h1 className="text-2xl font-bold text-dark-slate mb-2">Dashboard Penjual</h1>
                                            <p className="text-gray-600">
                                                Pantau stok, rating produk, dan sebaran pemberi rating (provinsi).
                                            </p>
                                        </div>
                                    </div>
                                    <div className="bg-dark-slate/10 rounded-lg p-4 text-center">
                                        <div className="text-sm text-gray-600 mb-1">Total Produk</div>
                                        <div className="text-3xl font-bold text-dark-slate">{products.length}</div>
                                        <div className="text-xs text-gray-500 mt-1">{products.filter(p => p.status === 'ACTIVE').length} aktif</div>
                                    </div>
                                </div>
                            </div>

                            {/* Chart stok & rating */}
                            <div className="grid md:grid-cols-2 gap-4">
                                <div className="bg-white rounded-lg shadow-sm border p-3">
                            <h2 className="text-sm font-semibold text-gray-800 mb-2">
                                Sebaran Stok per Produk
                            </h2>
                            {stockChart.labels.length === 0 ? (
                                <p className="text-xs text-gray-500">
                                    Belum ada produk.
                                </p>
                            ) : (
                                <Bar
                                    data={{
                                        labels: stockChart.labels,
                                        datasets: [
                                            {
                                                label: "Stok",
                                                data: stockChart.data,
                                                backgroundColor:
                                                    "#335C67",
                                            },
                                        ],
                                    }}
                                    options={{
                                        responsive: true,
                                        plugins: { legend: { display: false } },
                                        scales: {
                                            x: { ticks: { font: { size: 10 } } },
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

                        <div className="bg-white rounded-lg shadow-sm border p-3">
                            <h2 className="text-sm font-semibold text-gray-800 mb-2">
                                Sebaran Rating per Produk
                            </h2>
                            {ratingChart.labels.length === 0 ? (
                                <p className="text-xs text-gray-500">
                                    Belum ada produk atau ulasan.
                                </p>
                            ) : (
                                <Bar
                                    data={{
                                        labels: ratingChart.labels,
                                        datasets: [
                                            {
                                                label: "Rata-rata Rating",
                                                data: ratingChart.data,
                                                backgroundColor:
                                                    "#E09F3E",
                                            },
                                        ],
                                    }}
                                    options={{
                                        responsive: true,
                                        plugins: { legend: { display: false } },
                                        scales: {
                                            x: { ticks: { font: { size: 10 } } },
                                            y: {
                                                beginAtZero: true,
                                                suggestedMax: 5,
                                                ticks: { stepSize: 1 },
                                            },
                                        },
                                    }}
                                    height={170}
                                />
                            )}
                                </div>
                            </div>

                            {/* Sebaran pemberi rating per provinsi */}
                            <div className="bg-white rounded-lg shadow-sm border p-3">
                                <h2 className="text-sm font-semibold text-gray-800 mb-2">
                                    Sebaran Pemberi Rating berdasarkan Provinsi
                                </h2>
                                {provinceChart.labels.length === 0 ? (
                                    <p className="text-xs text-gray-500">
                                        Data provinsi pengulas belum tersedia.
                                    </p>
                                ) : (
                                    <Doughnut
                                        data={{
                                            labels: provinceChart.labels,
                                            datasets: [
                                                {
                                                    data: provinceChart.data,
                                                    backgroundColor: [
                                                        "#335C67",
                                                        "#E09F3E",
                                                        "#9E2A2B",
                                                        "#FFF3B0",
                                                        "#335C67",
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
                                        height={180}
                                    />
                                )}
                            </div>

                            {/* Tabel ringkasan produk */}
                            <div className="bg-white rounded-lg shadow-sm border p-3">
                                <h2 className="text-sm font-semibold text-gray-800 mb-3">
                                    Ringkasan Produk
                                </h2>
                                {products.length === 0 ? (
                                    <p className="text-xs text-gray-500">
                                        Belum ada produk.
                                    </p>
                                ) : (
                                    <div className="overflow-x-auto">
                                        <table className="min-w-full text-[11px]">
                                            <thead>
                                                <tr className="text-left text-gray-500 border-b">
                                                    <th className="py-1 pr-2">Produk</th>
                                                    <th className="py-1 pr-2">Stok</th>
                                                    <th className="py-1 pr-2">Harga</th>
                                                    <th className="py-1 pr-2">
                                                        Rating Rata-rata
                                                    </th>
                                                    <th className="py-1 pr-2">
                                                        Jumlah Ulasan
                                                    </th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {products.map((p) => (
                                                    <tr
                                                        key={p.id}
                                                        className="border-b last:border-b-0"
                                                    >
                                                        <td className="py-1 pr-2 text-gray-800">
                                                            {p.name}
                                                        </td>
                                                        <td className="py-1 pr-2 text-gray-800">
                                                            {p.stock}
                                                        </td>
                                                        <td className="py-1 pr-2 text-gray-800">
                                                            {new Intl.NumberFormat(
                                                                "id-ID",
                                                                {
                                                                    style: "currency",
                                                                    currency: "IDR",
                                                                    minimumFractionDigits: 0,
                                                                }
                                                            ).format(p.price)}
                                                        </td>
                                                        <td className="py-1 pr-2 text-gray-800">
                                                            {p.avg_rating.toFixed(2)}
                                                        </td>
                                                        <td className="py-1 pr-2 text-gray-800">
                                                            {p.review_count}
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
                </div>
            </div>
        </>
    );
}

