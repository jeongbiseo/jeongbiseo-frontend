import { useEffect, useRef } from "react";

const focusableSelector = [
    "a[href]",
    "button:not([disabled])",
    "input:not([disabled])",
    "select:not([disabled])",
    "textarea:not([disabled])",
    '[tabindex]:not([tabindex="-1"])',
].join(",");

export const useDialogAccessibility = <T extends HTMLElement>(
    open: boolean,
    onClose: () => void
) => {
    const dialogRef = useRef<T>(null);
    const closeRef = useRef(onClose);

    useEffect(() => {
        closeRef.current = onClose;
    }, [onClose]);

    useEffect(() => {
        if (!open) return;

        const dialog = dialogRef.current;
        const previouslyFocused = document.activeElement as HTMLElement | null;
        if (!dialog) return;

        const focusableElements = () =>
            Array.from(
                dialog.querySelectorAll<HTMLElement>(focusableSelector)
            ).filter((element) => element.offsetParent !== null);

        const firstTarget = dialog.matches("[data-dialog-initial-focus]")
            ? dialog
            : (dialog.querySelector<HTMLElement>(
                  "[data-dialog-initial-focus]"
              ) ??
              focusableElements()[0] ??
              dialog);
        firstTarget.focus();

        const handleKeyDown = (event: KeyboardEvent) => {
            if (event.key === "Escape") {
                event.preventDefault();
                closeRef.current();
                return;
            }

            if (event.key !== "Tab") return;

            const elements = focusableElements();
            if (elements.length === 0) {
                event.preventDefault();
                dialog.focus();
                return;
            }

            const first = elements[0];
            const last = elements[elements.length - 1];
            if (event.shiftKey && document.activeElement === first) {
                event.preventDefault();
                last.focus();
            } else if (!event.shiftKey && document.activeElement === last) {
                event.preventDefault();
                first.focus();
            }
        };

        document.addEventListener("keydown", handleKeyDown);
        return () => {
            document.removeEventListener("keydown", handleKeyDown);
            previouslyFocused?.focus();
        };
    }, [open]);

    return dialogRef;
};
