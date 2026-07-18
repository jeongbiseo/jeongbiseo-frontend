/*
 * ProtectedRoute는 로그인하지 않은 사용자의 접근을 제한하는 라우트 컴포넌트입니다.
 *
 * 앱이 부팅(인증 복구)되지 않은 상태에선 로딩 화면을 띄워 깜빡임을 방지하며,
 * 비 로그인 상태의 유저가 접근 시 '/login' 페이지로 리디렉션 시킵니다.
 */

import { useAuthStore } from "@/stores/authStore";
import type { ReactNode } from "react";
import { Navigate, useLocation } from "react-router-dom";

export const ProtectedRoute = ({ children }: { children: ReactNode }) => {
    const isLogin = useAuthStore((state) => state.isLogin);
    const authInitialized = useAuthStore((state) => state.authInitialized);
    const location = useLocation();

    // 부팅 중이면 로딩(깜빡임 방지)
    if (!authInitialized) {
        return (
            <div className="flex min-h-svh items-center justify-center">
                로딩중...
            </div>
        );
    }

    // 부팅 이후 로그인 상태가 아니면, 로그인 페이지로 이동
    if (!isLogin) {
        return <Navigate to="/login" replace state={{ from: location }} />;
    }

    return children;
};
