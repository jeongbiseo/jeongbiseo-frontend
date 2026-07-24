import { useEffect, useState } from "react";

const Toast = ({
    message,
    onDismiss,
    duration = 2600,
}: {
    message: string | null;
    onDismiss: () => void;
    duration?: number;
}) => {
    if (!message) return null;

    return (
        <ToastContent
            key={message}
            message={message}
            onDismiss={onDismiss}
            duration={duration}
        />
    );
};

const ToastContent = ({
    message,
    onDismiss,
    duration,
}: {
    message: string;
    onDismiss: () => void;
    duration: number;
}) => {
    const [closing, setClosing] = useState(false);

    useEffect(() => {
        const timer = window.setTimeout(
            () => {
                if (
                    window.matchMedia("(prefers-reduced-motion: reduce)")
                        .matches
                ) {
                    onDismiss();
                    return;
                }

                setClosing(true);
            },
            Math.max(0, duration - 180)
        );

        return () => window.clearTimeout(timer);
    }, [duration, message, onDismiss]);

    return (
        <div
            className={`${closing ? "toast-exit" : "toast-enter"} fixed bottom-24 left-1/2 z-[60] w-[calc(100%-48px)] max-w-[342px] -translate-x-1/2 rounded-[12px] bg-black/80 px-5 py-3 text-center text-[13px] font-semibold text-white shadow-lg`}
            role="status"
            aria-live="polite"
            onAnimationEnd={(event) => {
                if (event.target !== event.currentTarget || !closing) return;
                onDismiss();
            }}
        >
            {message}
        </div>
    );
};

export default Toast;
