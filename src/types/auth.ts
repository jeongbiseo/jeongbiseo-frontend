/* 인증 및 로그인 사용자 관련 타입입니다. */

/** GET /members/me 로그인 사용자 조회 응답입니다. */
export type UserProfile = {
    memberId: number;
    name: string | null;
    email: string | null;
    onboardingCompleted: boolean;
};

/** POST /auth/reissue 성공 응답입니다. */
export interface ReissueResult {
    accessToken: string;
}

/** 지원하는 소셜 로그인 제공자입니다. */
export type SocialProvider = "kakao" | "google";

/** POST /auth/{provider} 요청 바디입니다. (PKCE 인가 코드 교환) */
export interface SocialLoginRequest {
    code: string;
    codeVerifier: string;
    redirectUri: string;
}

/** POST /auth/{provider} 성공 응답입니다. */
export interface SocialCallbackResponse {
    accessToken: string;
    isNewMember: boolean;
    onboardingCompleted: boolean;
}
