import { useState } from "react";
import { Link } from "@inertiajs/react";

export default function CategoryDropdown({ categories = [] }) {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <div
            className="relative"
            onMouseEnter={() => setIsOpen(true)}
            onMouseLeave={() => setIsOpen(false)}
        >
            <button
                type="button"
                className={`px-4 py-2 rounded-md text-sm font-medium transition flex items-center gap-1 ${
                    isOpen
                        ? "bg-gray-100 text-[#335c67]"
                        : "text-gray-700 hover:bg-gray-50"
                }`}
            >
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
                        d="M4 6h16M4 12h16M4 18h16"
                    />
                </svg>
                <span>Kategori</span>
            </button>

            {isOpen && (
                <>
                    {/* Dropdown Menu */}
                    <div className="absolute top-full left-0 mt-2 w-72 bg-white rounded-lg shadow-xl border border-gray-200 z-50 overflow-hidden">
                        <div className="max-h-[500px] overflow-y-auto">
                            <div className="p-4">
                                <h3 className="text-xs font-semibold text-gray-500 uppercase mb-3 px-2">
                                    Semua Kategori
                                </h3>
                                <div className="space-y-0.5">
                                    {categories.map((category, index) => (
                                        <Link
                                            key={index}
                                            href={route("dashboard", { category })}
                                            className="block px-3 py-2.5 text-sm text-gray-700 hover:bg-[#335c67] hover:text-white rounded-md transition-all duration-150 flex items-center justify-between group"
                                            onClick={() => setIsOpen(false)}
                                        >
                                            <span className="font-medium">{category}</span>
                                            <svg
                                                className="w-4 h-4 text-gray-400 group-hover:text-white opacity-0 group-hover:opacity-100 transition"
                                                fill="none"
                                                stroke="currentColor"
                                                viewBox="0 0 24 24"
                                            >
                                                <path
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                    strokeWidth={2}
                                                    d="M9 5l7 7-7 7"
                                                />
                                            </svg>
                                        </Link>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                </>
            )}
        </div>
    );
}

