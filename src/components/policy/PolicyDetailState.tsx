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
        <section className="bg-ground px-page-inline flex min-h-svh w-full max-w-[390px] flex-col items-center justify-center pb-[57px] text-center">
            <h1 className="text-heading-section">{title}</h1>
            <p className="text-text-muted text-label-medium mt-2">
                {description}
            </p>
            {actionLabel && onAction && (
                <Button className="mt-6 max-w-[312px]" onClick={onAction}>
                    {actionLabel}
                </Button>
            )}
        </section>
    </main>
);
