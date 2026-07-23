import { useAuthStore } from "@/stores/authStore";
import type { ReactNode } from "react";
import { Navigate } from "react-router-dom";

/** 온보딩을 완료한 회원이 가입 절차에 다시 진입하지 못하도록 보호합니다. */
export const OnboardingFlowRoute = ({ children }: { children: ReactNode }) => {
    const onboardingCompleted = useAuthStore(
        (state) => state.user?.onboardingCompleted
    );

    if (onboardingCompleted) {
        return <Navigate to="/" replace />;
    }

    return children;
};
