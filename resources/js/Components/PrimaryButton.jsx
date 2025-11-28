export default function PrimaryButton({
    className = "",
    disabled,
    children,
    ...props
}) {
    return (
        <button
            {...props}
            disabled={disabled}
            className={
                `px-4 py-2 rounded-md font-semibold text-white transition 
                ${
                    disabled
                        ? "opacity-70 cursor-not-allowed"
                        : "hover:opacity-90"
                }` +
                " " +
                className
            }
            style={{ backgroundColor: "#335c67" }}
        >
            {children}
        </button>
    );
}
