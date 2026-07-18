/*
 * App은 모든 페이지가 공유하는 공통 레이아웃 컴포넌트입니다.
 * 헤더/푸터 등 공통 UI가 생기면 여기에 추가하고,
 * 각 페이지는 Outlet 위치에 렌더링됩니다.
 */

import BottomNav from "@/components/common/BottomNav";
import { useAuthStore } from "@/stores/authStore";
import { useEffect } from "react";
import { Outlet, useLocation } from "react-router-dom";

const bottomNavPaths = new Set(["/", "/recommend", "/calendar", "/mypage"]);

function App() {
    const { pathname } = useLocation();
    const showBottomNav = bottomNavPaths.has(pathname);

    // ⚠️ 임시 코드 — 다음 이슈(axios instance + App 부팅)에서 제거 예정
    // 아직 실제 부팅 로직(reissue → 유저 정보 조회 → setAuthInitialized)이 없어서,
    // ProtectedRoute가 무한 로딩되지 않도록 임시로 로그인 상태를 강제합니다.
    useEffect(() => {
        const { login, setAuthInitialized } = useAuthStore.getState();
        login({ id: 0, name: "개발용 임시 유저" });
        setAuthInitialized(true);
    }, []);

    return (
        <>
            <Outlet />
            {showBottomNav && <BottomNav />}
        </>
    );
}

export default App;
