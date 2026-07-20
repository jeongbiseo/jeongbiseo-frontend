/*
 * App은 모든 페이지가 공유하는 공통 레이아웃 컴포넌트입니다.
 * 헤더/푸터 등 공통 UI가 생기면 여기에 추가하고,
 * 각 페이지는 Outlet 위치에 렌더링됩니다.
 */

import { reissueAccessToken } from "@/api/axiosInstance";
import { getMyInfoApi } from "@/api/memberApi";
import BottomNav from "@/components/common/BottomNav";
import { useAuthStore } from "@/stores/authStore";
import { useEffect } from "react";
import { Outlet, useLocation } from "react-router-dom";

const bottomNavPaths = new Set([
    "/",
    "/recommend",
    "/calendar",
    "/mypage",
    "/available-policies",
]);

function App() {
    const { pathname, state: locationState } = useLocation();
    const policyDetail = pathname.startsWith("/policies/");
    const showBottomNav = bottomNavPaths.has(pathname) || policyDetail;
    const homeSummaryDetail = pathname === "/available-policies";
    const activeBottomNavPath = homeSummaryDetail
        ? "/"
        : policyDetail
          ? ((locationState as { bottomNavPath?: string } | null)
                ?.bottomNavPath ?? "/recommend")
          : undefined;
    const authInitialized = useAuthStore((state) => state.authInitialized);

    useEffect(() => {
        if (authInitialized) return;

        let active = true;

        const bootstrapAuth = async () => {
            const { login, logout, setAuthInitialized } =
                useAuthStore.getState();

            try {
                await reissueAccessToken();
                const response = await getMyInfoApi();

                if (!response.isSuccess) {
                    throw new Error(response.message);
                }

                if (active) login(response.result);
            } catch {
                if (active) logout();
            } finally {
                if (active) setAuthInitialized(true);
            }
        };

        void bootstrapAuth();

        return () => {
            active = false;
        };
    }, [authInitialized]);

    return (
        <>
            <Outlet />
            {showBottomNav && <BottomNav activePath={activeBottomNavPath} />}
        </>
    );
}

export default App;
