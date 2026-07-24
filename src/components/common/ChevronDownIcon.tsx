const ChevronDownIcon = ({
    expanded = false,
    className = "size-icon-sm",
}: {
    expanded?: boolean;
    className?: string;
}) => (
    <svg
        className={`${className} transition-transform ${expanded ? "rotate-180" : ""}`}
        viewBox="0 0 16 16"
        fill="none"
        aria-hidden="true"
    >
        <path
            d="m3 5.5 5 5 5-5"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
        />
    </svg>
);

export default ChevronDownIcon;
