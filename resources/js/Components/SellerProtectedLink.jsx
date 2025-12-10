import { Link, usePage, router } from "@inertiajs/react";
import { useState } from "react";
import SellerStatusModal from "./SellerStatusModal";

export default function SellerProtectedLink({
    href,
    children,
    className,
    ...props
}) {
    const { auth } = usePage().props;
    const [showModal, setShowModal] = useState(false);
    const [modalType, setModalType] = useState(null);
    const [submissionCount, setSubmissionCount] = useState(1);

    const handleClick = (e) => {
        const user = auth?.user;
        if (!user) return;

        // Jika bukan penjual, biarkan link normal
        if (user?.role !== "penjual") {
            return;
        }

        const seller = user?.seller;

        // Jika belum ada data toko, redirect ke register
        if (!seller) {
            e.preventDefault();
            router.visit(route("seller.register"));
            return;
        }

        // Jika status PENDING, tampilkan modal
        if (seller.status === "PENDING") {
            e.preventDefault();
            setModalType("pending");
            setShowModal(true);
            return;
        }

        // Jika status REJECTED, tampilkan modal
        if (seller.status === "REJECTED") {
            e.preventDefault();
            setModalType("rejected");
            setSubmissionCount(seller.submission_count ?? 1);
            setShowModal(true);
            return;
        }

        // Jika ACTIVE, biarkan link normal
    };

    return (
        <>
            <Link
                href={href}
                onClick={handleClick}
                className={
                    'block w-full px-4 py-2 text-start text-sm leading-5 text-gray-700 transition duration-150 ease-in-out hover:bg-gray-100 focus:bg-gray-100 focus:outline-none ' +
                    className
                }
                {...props}
            >
                {children}
            </Link>

            {showModal && (
                <SellerStatusModal
                    type={modalType}
                    submissionCount={submissionCount}
                    onClose={() => setShowModal(false)}
                />
            )}
        </>
    );
}

