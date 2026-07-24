import type { ReactNode } from "react";

export const FieldLabel = ({
    children,
    spacing = "default",
}: {
    children: ReactNode;
    spacing?: "default" | "onboarding";
}) => (
    <h2
        className={`${spacing === "onboarding" ? "mt-6 mb-2" : "mt-5 mb-2"} text-label-strong`}
    >
        {children}
    </h2>
);

export const InlineLoadState = ({
    message,
    onRetry,
}: {
    message: string;
    onRetry: () => void;
}) => (
    <div className="mt-2 flex items-center justify-between gap-3" role="alert">
        <p className="text-danger text-caption-strong">{message}</p>
        <button
            className="text-primary text-caption-strong shrink-0 cursor-pointer"
            type="button"
            onClick={onRetry}
        >
            다시 시도
        </button>
    </div>
);

export const FormSelect = <T extends string | number>({
    value,
    onChange,
    children,
    ariaLabel,
    disabled = false,
    border = "default",
    size = "default",
}: {
    value: T;
    onChange: (value: T) => void;
    children: ReactNode;
    ariaLabel: string;
    disabled?: boolean;
    border?: "default" | "soft" | "strong";
    size?: "default" | "onboarding" | "compact";
}) => (
    <select
        className={`${border === "soft" ? "border-[0.5px] border-[#d8d8d8]" : border === "strong" ? "border-[0.5px] border-[#808080]" : "border-line-strong border"} ${size === "onboarding" ? "h-[50px]" : size === "compact" ? "h-[47px]" : "h-[48px]"} focus:border-primary focus-visible:outline-primary disabled:bg-disabled text-label-strong rounded-control px-container w-full cursor-pointer bg-white outline-none focus-visible:outline-2 focus-visible:outline-offset-1 disabled:cursor-not-allowed`}
        value={value}
        aria-label={ariaLabel}
        disabled={disabled}
        onChange={(event) =>
            onChange(
                (typeof value === "number"
                    ? Number(event.target.value)
                    : event.target.value) as T
            )
        }
    >
        {children}
    </select>
);

export const CounterButton = ({
    children,
    label,
    onClick,
    size = "default",
}: {
    children: ReactNode;
    label: string;
    onClick: () => void;
    size?: "default" | "compact";
}) => (
    <button
        className={`${size === "compact" ? "size-[30px]" : "size-8"} border-line-strong focus-visible:outline-primary flex cursor-pointer items-center justify-center rounded-full border text-[20px] leading-none focus-visible:outline-2 focus-visible:outline-offset-2`}
        type="button"
        aria-label={label}
        onClick={onClick}
    >
        {children}
    </button>
);
