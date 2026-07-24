import { useDialogAccessibility } from "@/hooks/useDialogAccessibility";
import type { ReactNode } from "react";
import { useNavigate } from "react-router-dom";

export const MyPageLayout = ({
    children,
    className = "",
}: {
    children: ReactNode;
    className?: string;
}) => (
    <main className="bg-surface-dim flex min-h-svh justify-center">
        <section
            className={`bg-ground text-text-strong min-h-svh w-full max-w-[390px] px-[23px] pt-[23px] pb-[120px] ${className}`}
        >
            {children}
        </section>
    </main>
);

export const BackButton = ({
    label = "이전 화면",
    className = "-ml-1",
}: {
    label?: string;
    className?: string;
}) => {
    const navigate = useNavigate();

    return (
        <button
            className={`focus-visible:outline-primary flex size-8 cursor-pointer items-center justify-start rounded focus-visible:outline-2 ${className}`}
            type="button"
            aria-label={label}
            onClick={() => navigate(-1)}
        >
            <svg
                className="h-[11px] w-[19px]"
                viewBox="0 0 19 11"
                fill="none"
                aria-hidden="true"
            >
                <path
                    d="M18 5.5H1M1 5.5 6 1M1 5.5 6 10"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                />
            </svg>
        </button>
    );
};

export const ChevronRightIcon = () => (
    <svg
        className="h-[13px] w-2"
        viewBox="0 0 8 13"
        fill="none"
        aria-hidden="true"
    >
        <path
            d="m1.5 1.5 5 5-5 5"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
        />
    </svg>
);

export const StarIcon = ({
    filled = true,
    className = "size-6",
}: {
    filled?: boolean;
    className?: string;
}) => (
    <svg className={className} viewBox="0 0 24 24" aria-hidden="true">
        <path
            d="m12 1.8 3.1 6.3 7 .9-5.1 4.9 1.3 6.9-6.3-3.3-6.3 3.3 1.3-6.9L1.9 9l7-.9L12 1.8Z"
            fill={filled ? "var(--color-secondary)" : "var(--color-disabled)"}
        />
    </svg>
);

export const CheckIcon = ({ className = "size-5" }: { className?: string }) => (
    <svg
        className={className}
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

export const ConfirmDialog = ({
    open,
    title,
    description,
    confirmLabel,
    onCancel,
    onConfirm,
    variant = "default",
}: {
    open: boolean;
    title: string;
    description: string;
    confirmLabel: string;
    onCancel: () => void;
    onConfirm: () => void;
    variant?: "default" | "external";
}) => {
    const dialogRef = useDialogAccessibility<HTMLElement>(open, onCancel);

    if (!open) return null;

    const external = variant === "external";

    return (
        <div
            className={`confirm-dialog-backdrop-enter fixed inset-0 z-50 flex items-center justify-center px-9 ${external ? "bg-black/25" : "bg-black/20"}`}
            role="presentation"
            onClick={(event) => {
                if (event.target === event.currentTarget) onCancel();
            }}
        >
            <section
                ref={dialogRef}
                tabIndex={-1}
                className={`confirm-dialog-enter w-full rounded-[10px] bg-white shadow-lg ${external ? "min-h-[135px] max-w-[317px] px-[21px] pt-[25px] pb-[13px] text-left" : "min-h-[135px] max-w-[317px] px-10 pt-[22px] pb-[13px] text-center"}`}
                role="dialog"
                aria-modal="true"
                aria-labelledby="confirm-dialog-title"
            >
                <h2 className="text-[16px] font-bold" id="confirm-dialog-title">
                    {title}
                </h2>
                <p
                    className={`text-text-muted text-[13px] font-bold ${external ? "mt-[11px] leading-normal" : "mt-[11px]"}`}
                >
                    {description}
                </p>
                <div
                    className={`flex gap-3 ${external ? "mt-[9px] justify-end" : "mt-[19px] justify-center"}`}
                >
                    <button
                        data-dialog-initial-focus
                        className="border-text-muted h-[26px] cursor-pointer rounded-[5px] border-[0.5px] px-[14px] text-[13px] font-bold"
                        type="button"
                        onClick={onCancel}
                    >
                        취소
                    </button>
                    <button
                        className="bg-green-normal h-[26px] cursor-pointer rounded-[5px] px-[14px] text-[13px] font-bold text-white"
                        type="button"
                        onClick={onConfirm}
                    >
                        {confirmLabel}
                    </button>
                </div>
            </section>
        </div>
    );
};
