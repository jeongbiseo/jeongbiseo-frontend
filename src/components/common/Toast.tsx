import { useEffect } from "react";

const Toast = ({
    message,
    onDismiss,
    duration = 2600,
}: {
    message: string | null;
    onDismiss: () => void;
    duration?: number;
}) => {
    useEffect(() => {
        if (!message) return;

        const timer = window.setTimeout(onDismiss, duration);
        return () => window.clearTimeout(timer);
    }, [duration, message, onDismiss]);

    if (!message) return null;

    return (
        <div
            className="fixed bottom-24 left-1/2 z-[60] w-[calc(100%-48px)] max-w-[342px] -translate-x-1/2 rounded-[12px] bg-black/80 px-5 py-3 text-center text-[13px] font-semibold text-white shadow-lg"
            role="status"
            aria-live="polite"
        >
            {message}
        </div>
    );
};

export default Toast;
