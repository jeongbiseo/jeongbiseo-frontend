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
