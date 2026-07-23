import Button from "@/components/common/Button";

export const PolicyDetailState = ({
    title,
    description,
    actionLabel,
    onAction,
}: {
    title: string;
    description: string;
    actionLabel?: string;
    onAction?: () => void;
}) => (
    <main className="bg-surface-dim flex min-h-svh justify-center">
        <section className="bg-ground flex min-h-svh w-full max-w-[390px] flex-col items-center justify-center px-10 pb-[57px] text-center">
            <h1 className="text-[20px] font-bold">{title}</h1>
            <p className="text-text-muted mt-2 text-[13px] font-semibold">
                {description}
            </p>
            {actionLabel && onAction && (
                <Button className="mt-7 max-w-[312px]" onClick={onAction}>
                    {actionLabel}
                </Button>
            )}
        </section>
    </main>
);
