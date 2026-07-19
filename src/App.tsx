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

const bottomNavPaths = new Set(["/", "/recommend", "/calendar", "/mypage"]);

function App() {
    const { pathname, state: locationState } = useLocation();
    const policyDetail = pathname.startsWith("/policies/");
    const showBottomNav = bottomNavPaths.has(pathname) || policyDetail;
    const activeBottomNavPath = policyDetail
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

            // 백엔드 인증 배포 전 보호 페이지 개발을 위한 명시적 로컬 옵션입니다.
            if (
                import.meta.env.DEV &&
                import.meta.env.VITE_USE_MOCK_AUTH === "true"
            ) {
                login({
                    memberId: 0,
                    name: "개발용 임시 유저",
                    email: null,
                    onboardingCompleted: true,
                });
                setAuthInitialized(true);
                return;
            }

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
