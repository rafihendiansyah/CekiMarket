import { Link } from "@inertiajs/react";

export default function Pagination({ links = [] }) {
    if (links.length <= 3) {
        // Hanya ada Previous, 1, Next (tidak perlu pagination)
        return null;
    }

    return (
        <div className="flex items-center justify-center gap-2 mt-6">
            {links.map((link, index) => (
                <Link
                    key={index}
                    href={link.url || "#"}
                    className={`
                        px-3 py-2 rounded-md text-sm font-medium transition
                        ${
                            link.active
                                ? "bg-[#335c67] text-white"
                                : link.url
                                ? "bg-white text-gray-700 border border-gray-300 hover:bg-gray-50"
                                : "bg-gray-100 text-gray-400 cursor-not-allowed"
                        }
                    `}
                    dangerouslySetInnerHTML={{ __html: link.label }}
                />
            ))}
        </div>
    );
}

