import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { RouterProvider } from "react-router-dom";
import { router } from "@/router";
import { getAppOrigin } from "@/utils/oauth";
import "./styles/index.css";

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
