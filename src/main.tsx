import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { RouterProvider } from "react-router-dom";
import { router } from "@/router";
import { getAppOrigin } from "@/utils/oauth";
import "./styles/index.css";

const PRELOAD_ERROR_RELOAD_KEY = "jeongbiseo:preload-error-reload";
const PRELOAD_ERROR_RELOAD_COOLDOWN_MS = 10_000;

const recoverFromPreloadError = (event: Event) => {
    const now = Date.now();

    try {
        const lastReloadAt = Number(
            sessionStorage.getItem(PRELOAD_ERROR_RELOAD_KEY)
        );

        if (
            Number.isFinite(lastReloadAt) &&
            lastReloadAt > 0 &&
            now - lastReloadAt < PRELOAD_ERROR_RELOAD_COOLDOWN_MS
        ) {
            return;
        }

        sessionStorage.setItem(PRELOAD_ERROR_RELOAD_KEY, String(now));
    } catch {
        // 저장소를 사용할 수 없다면 무한 새로고침을 피하고 기존 오류 화면을 표시합니다.
        return;
    }

    event.preventDefault();
    window.location.reload();
};

if (import.meta.env.PROD) {
    window.addEventListener("vite:preloadError", recoverFromPreloadError);
    window.setTimeout(() => {
        try {
            sessionStorage.removeItem(PRELOAD_ERROR_RELOAD_KEY);
        } catch {
            // 저장소 접근 제한은 복구 가드 정리에만 영향을 주므로 무시합니다.
        }
    }, PRELOAD_ERROR_RELOAD_COOLDOWN_MS);
}

const appOrigin = getAppOrigin();
const shouldRedirectToAppOrigin =
    import.meta.env.PROD && window.location.origin !== appOrigin;

if (shouldRedirectToAppOrigin) {
    const currentLocation = `${window.location.pathname}${window.location.search}${window.location.hash}`;
    window.location.replace(`${appOrigin}${currentLocation}`);
} else {
    createRoot(document.getElementById("root")!).render(
        <StrictMode>
            <RouterProvider router={router} />
        </StrictMode>
    );
}
