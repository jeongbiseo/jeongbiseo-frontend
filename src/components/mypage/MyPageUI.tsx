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
            className={`bg-ground text-text-strong px-page-inline pt-page-top min-h-svh w-full max-w-[390px] pb-[120px] ${className}`}
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
                className="size-icon-md"
                viewBox="0 0 20 20"
                fill="none"
                aria-hidden="true"
            >
                <path
                    d="M18 10H2m0 0 7-7m-7 7 7 7"
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
        className="size-icon-sm"
        viewBox="0 0 16 16"
        fill="none"
        aria-hidden="true"
    >
        <path
            d="m5.5 3 5 5-5 5"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
        />
    </svg>
);

export const StarIcon = ({
    filled = true,
    className = "size-icon-md",
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

export const CheckIcon = ({
    className = "size-icon-sm",
}: {
    className?: string;
}) => (
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
            className={`confirm-dialog-backdrop-enter px-page-inline fixed inset-0 z-50 flex items-center justify-center ${external ? "bg-black/25" : "bg-black/20"}`}
            role="presentation"
            onClick={(event) => {
                if (event.target === event.currentTarget) onCancel();
            }}
        >
            <section
                ref={dialogRef}
                tabIndex={-1}
                className={`confirm-dialog-enter rounded-panel p-container min-h-[135px] w-full max-w-[317px] bg-white shadow-lg ${external ? "text-left" : "text-center"}`}
                role="dialog"
                aria-modal="true"
                aria-labelledby="confirm-dialog-title"
            >
                <h2 className="text-title" id="confirm-dialog-title">
                    {title}
                </h2>
                <p className="text-text-muted text-label-strong mt-layout-inline">
                    {description}
                </p>
                <div
                    className={`gap-layout-related flex ${external ? "mt-layout-related justify-end" : "mt-layout-component justify-center"}`}
                >
                    <button
                        data-dialog-initial-focus
                        className="border-text-muted text-label-strong rounded-control px-container-compact min-h-11 cursor-pointer border-[0.5px]"
                        type="button"
                        onClick={onCancel}
                    >
                        취소
                    </button>
                    <button
                        className="bg-green-normal text-label-strong rounded-control px-container-compact min-h-11 cursor-pointer text-white"
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
