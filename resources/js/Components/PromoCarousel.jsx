import { useState, useEffect } from "react";
import { Link } from "@inertiajs/react";

export default function PromoCarousel({ banners = [] }) {
    const [currentIndex, setCurrentIndex] = useState(0);

    // Auto slide setiap 5 detik
    useEffect(() => {
        if (banners.length <= 1) return;

        const interval = setInterval(() => {
            setCurrentIndex((prev) => (prev + 1) % banners.length);
        }, 5000); // 5 detik

        return () => clearInterval(interval);
    }, [banners.length]);

    const goToSlide = (index) => {
        setCurrentIndex(index);
    };

    const goPrev = () => {
        setCurrentIndex((prev) => (prev - 1 + banners.length) % banners.length);
    };

    const goNext = () => {
        setCurrentIndex((prev) => (prev + 1) % banners.length);
    };

    if (!banners || banners.length === 0) {
        return null;
    }

    return (
        <div className="relative w-full mb-6 rounded-lg overflow-hidden shadow-md">
            <div className="relative h-64 md:h-96 lg:h-[500px] bg-gray-100">
                {banners.map((banner, index) => (
                    <div
                        key={index}
                        className={`absolute inset-0 transition-opacity duration-500 ${
                            index === currentIndex
                                ? "opacity-100 z-10"
                                : "opacity-0 z-0"
                        }`}
                    >
                        {banner.url ? (
                            <Link href={banner.url} className="block w-full h-full">
                                <img
                                    src={banner.image}
                                    alt={banner.alt || `Promo ${index + 1}`}
                                    className="w-full h-full object-cover"
                                />
                            </Link>
                        ) : (
                            <img
                                src={banner.image}
                                alt={banner.alt || `Promo ${index + 1}`}
                                className="w-full h-full object-cover"
                            />
                        )}
                    </div>
                ))}

                {/* Tombol navigasi kiri/kanan */}
                {banners.length > 1 && (
                    <>
                        <button
                            onClick={goPrev}
                            className="absolute left-4 top-1/2 -translate-y-1/2 z-20 bg-white/80 hover:bg-white text-gray-700 rounded-full w-10 h-10 flex items-center justify-center shadow-lg transition"
                            aria-label="Slide sebelumnya"
                        >
                            ‹
                        </button>
                        <button
                            onClick={goNext}
                            className="absolute right-4 top-1/2 -translate-y-1/2 z-20 bg-white/80 hover:bg-white text-gray-700 rounded-full w-10 h-10 flex items-center justify-center shadow-lg transition"
                            aria-label="Slide berikutnya"
                        >
                            ›
                        </button>
                    </>
                )}

                {/* Indikator dots di bawah */}
                {banners.length > 1 && (
                    <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-20 flex gap-2">
                        {banners.map((_, index) => (
                            <button
                                key={index}
                                onClick={() => goToSlide(index)}
                                className={`w-2 h-2 rounded-full transition ${
                                    index === currentIndex
                                        ? "bg-white w-8"
                                        : "bg-white/50 hover:bg-white/75"
                                }`}
                                aria-label={`Go to slide ${index + 1}`}
                            />
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}

