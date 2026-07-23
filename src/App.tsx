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

const pageTitles: Record<string, string> = {
    "/": "홈 | 정비서",
    "/login": "로그인 | 정비서",
    "/terms": "약관 동의 | 정비서",
    "/onboarding": "맞춤 정보 입력 | 정비서",
    "/recommend": "맞춤 지원금 | 정비서",
    "/calendar": "마감 캘린더 | 정비서",
    "/available-policies": "신청 가능한 지원금 | 정비서",
    "/mypage": "마이페이지 | 정비서",
    "/mypage/edit": "내 정보 수정 | 정비서",
    "/mypage/terms": "약관 및 동의 내역 | 정비서",
    "/mypage/withdraw": "회원 탈퇴 | 정비서",
};

const getPageTitle = (pathname: string) => {
    if (pathname.startsWith("/policies/")) return "지원금 상세 | 정비서";
    if (pathname.startsWith("/auth/callback/")) {
        return "로그인 처리 중 | 정비서";
    }

    return pageTitles[pathname] ?? "정비서";
};

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
        document.title = getPageTitle(pathname);
    }, [pathname]);

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
