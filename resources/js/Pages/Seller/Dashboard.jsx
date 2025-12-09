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

export default function SellerDashboard({
    stockChart = { labels: [], data: [] },
    ratingChart = { labels: [], data: [], counts: [] },
    provinceChart = { labels: [], data: [] },
    products = [],
}) {
    const cardStyle =
        "rounded-lg border bg-white shadow-sm px-4 py-3 flex flex-col justify-between";

    return (
        <>
            <Head title="Dashboard Penjual" />

            <div className="min-h-screen bg-gray-50">
                {/* ================= NAVBAR PENJUAL ================ */}
                <nav className="flex items-center justify-between px-6 py-4 border-b bg-white">
                    <div
                        className="font-bold text-lg"
                        style={{ color: "#335c67" }}
                    >
                        CekiCekiMart — Dashboard Penjual
                    </div>

                    <div className="flex items-center gap-3">
                        {/* SRS-12: Laporan produk berdasarkan stok */}
                        <a
                            href={route("seller.reports.products.stock")}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="px-3 py-2 rounded-md text-xs font-semibold text-white shadow"
                            style={{ backgroundColor: "#335c67" }}
                        >
                            Laporan Produk (Stok)
                        </a>

                        {/* SRS-13: Laporan produk berdasarkan rating */}
                        <a
                            href={route("seller.reports.products.rating")}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="px-3 py-2 rounded-md text-xs font-semibold text-white shadow"
                            style={{ backgroundColor: "#335c67" }}
                        >
                            Laporan Produk (Rating)
                        </a>

                        {/* SRS-14: Laporan produk segera dipesan */}
                        <a
                            href={route("seller.reports.products.to-restock")}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="px-3 py-2 rounded-md text-xs font-semibold text-white shadow"
                            style={{ backgroundColor: "#335c67" }}
                        >
                            Laporan Produk Segera Dipesan
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
                            Dashboard Penjual
                        </h1>
                        <p className="text-sm text-gray-600 mt-1">
                            Pantau stok, rating produk, dan sebaran pemberi
                            rating (provinsi).
                        </p>
                    </div>

                    {/* Kartu ringkas */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <div className={cardStyle}>
                            <div>
                                <div className="text-xs text-gray-500">
                                    Total Produk
                                </div>
                                <div className="text-2xl font-bold text-[#335c67] mt-1">
                                    {products.length}
                                </div>
                            </div>
                        </div>
                        <div className={cardStyle}>
                            <div>
                                <div className="text-xs text-gray-500">
                                    Total Stok
                                </div>
                                <div className="text-2xl font-bold text-[#335c67] mt-1">
                                    {products
                                        .reduce(
                                            (sum, p) => sum + (p.stock || 0),
                                            0
                                        )
                                        .toLocaleString("id-ID")}
                                </div>
                            </div>
                        </div>
                        <div className={cardStyle}>
                            <div>
                                <div className="text-xs text-gray-500">
                                    Rata-rata Rating
                                </div>
                                <div className="text-2xl font-bold text-[#335c67] mt-1">
                                    {products.length === 0
                                        ? 0
                                        : (
                                              products.reduce(
                                                  (sum, p) =>
                                                      sum +
                                                      (p.avg_rating || 0),
                                                  0
                                              ) / products.length
                                          ).toFixed(2)}
                                </div>
                            </div>
                        </div>
                        <div className={cardStyle}>
                            <div>
                                <div className="text-xs text-gray-500">
                                    Total Ulasan
                                </div>
                                <div className="text-2xl font-bold text-[#335c67] mt-1">
                                    {products.reduce(
                                        (sum, p) => sum + (p.review_count || 0),
                                        0
                                    )}
                                </div>
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
                                                    "rgba(51, 92, 103, 0.7)",
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
                                                    "rgba(148, 210, 189, 0.8)",
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
                                                "rgba(51, 92, 103, 0.8)",
                                                "rgba(242, 163, 101, 0.8)",
                                                "rgba(148, 210, 189, 0.8)",
                                                "rgba(251, 191, 36, 0.8)",
                                                "rgba(244, 114, 182, 0.8)",
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
        </>
    );
}

