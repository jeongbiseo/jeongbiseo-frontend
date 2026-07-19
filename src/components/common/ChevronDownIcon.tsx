const ChevronDownIcon = ({
    expanded = false,
    className = "h-[9px] w-[14px]",
}: {
    expanded?: boolean;
    className?: string;
}) => (
    <svg
        className={`${className} transition-transform ${expanded ? "rotate-180" : ""}`}
        viewBox="0 0 14 9"
        fill="none"
        aria-hidden="true"
    >
        <path
            d="m1 1 6 6 6-6"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
        />
    </svg>
);

export default ChevronDownIcon;
