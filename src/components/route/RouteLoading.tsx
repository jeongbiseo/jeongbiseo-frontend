export const RouteLoading = ({
    message = "화면을 불러오고 있어요",
}: {
    message?: string;
}) => (
    <main className="bg-surface-dim flex min-h-svh justify-center">
        <section
            className="bg-ground flex min-h-svh w-full max-w-[390px] flex-col items-center justify-center"
            role="status"
            aria-live="polite"
        >
            <span
                className="border-disabled border-t-primary size-9 animate-spin rounded-full border-[3px]"
                aria-hidden="true"
            />
            <p className="text-text-muted mt-4 text-[13px] font-bold">
                {message}
            </p>
        </section>
    </main>
);
