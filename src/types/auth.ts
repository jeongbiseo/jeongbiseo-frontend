/* 인증 및 로그인 사용자 관련 타입입니다. */

/**
 * 로그인 사용자 조회 응답입니다.
 *
 * TODO: 백엔드의 GET /members/me Swagger가 배포되면 실제 필드에 맞게
 * 이 타입과 memberApi만 수정합니다.
 */
export type UserProfile = {
    memberId: number;
    name: string | null;
    email: string | null;
    onboardingCompleted: boolean;
};

/** POST /auth/reissue의 임시 성공 응답입니다. */
export interface ReissueResult {
    accessToken: string;
    tokenType?: string;
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
