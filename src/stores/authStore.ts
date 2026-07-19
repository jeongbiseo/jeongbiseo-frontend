/*
 * 앱의 유저 인증 상태와 정보를 관리하는 Zustand 스토어입니다.
 *
 * 정비서 앱의 핵심 인증 방식은 다음과 같습니다.
 * 1) accessToken은 XSS 공격 방지를 위해 메모리(스토어)에만 저장합니다.
 * 2) refreshToken은 서버에서 HttpOnly 쿠키로 관리하며 프론트에서 직접 접근하지 않습니다.
 * 3) isLogin 여부는 유저 정보 조회가 완전히 성공한 시점에만 true로 전환됩니다.
 * 4) authInitialized는 앱 초기 로딩 시 인증 복구(reissue)가 끝났는지를 나타내며, 화면 깜빡임을 방지합니다.
 *
 * axios 인터셉터 등 React 외부에서는 useAuthStore.getState()로 접근합니다.
 */

import type { UserProfile } from "@/types/auth";
import { create } from "zustand";

interface AuthState {
    accessToken: string | null;
    isLogin: boolean;
    user: UserProfile | null;
    authInitialized: boolean;

    // 로그인 처리: 유저 정보 조회 성공 후 호출, 이 시점에 isLogin을 true로 전환
    login: (user: UserProfile) => void;
    // 로그아웃 처리: 인증 state 초기화 (authInitialized는 부팅 여부이므로 유지)
    logout: () => void;
    // accessToken 저장: 로그인 여부(isLogin)는 여기서 변경하지 않음
    setAccessToken: (accessToken: string | null) => void;
    // 인증 부팅 여부: App에서 reissue 및 유저 정보 조회가 끝난 이후 true
    setAuthInitialized: (authInitialized: boolean) => void;
}

export const useAuthStore = create<AuthState>((set) => ({
    accessToken: null,
    isLogin: false,
    user: null,
    authInitialized: false,

    login: (user) => set({ isLogin: true, user }),
    logout: () => set({ isLogin: false, user: null, accessToken: null }),
    setAccessToken: (accessToken) => set({ accessToken }),
    setAuthInitialized: (authInitialized) => set({ authInitialized }),
}));
