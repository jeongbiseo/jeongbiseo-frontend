export const SearchIcon = ({
    className = "size-icon-md",
}: {
    className?: string;
}) => (
    <svg
        className={className}
        viewBox="0 0 25 25"
        fill="none"
        aria-hidden="true"
    >
        <circle
            cx="10.5"
            cy="10.5"
            r="8"
            stroke="currentColor"
            strokeWidth="2"
        />
        <path
            d="m16.5 16.5 6 6"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
        />
    </svg>
);

export const CloseIcon = () => (
    <svg
        className="size-icon-md"
        viewBox="0 0 20 20"
        fill="none"
        aria-hidden="true"
    >
        <path
            d="m3 3 14 14M17 3 3 17"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
        />
    </svg>
);

export const CheckIcon = () => (
    <svg
        className="size-icon-sm"
        viewBox="0 0 20 20"
        fill="none"
        aria-hidden="true"
    >
        <path
            d="m3 10 4 4 10-10"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
        />
    </svg>
);
