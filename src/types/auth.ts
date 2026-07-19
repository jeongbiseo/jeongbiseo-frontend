/*
 * 인증/유저 관련 타입 정의 파일입니다.
 * 백엔드 유저 스키마가 확정되면 UserProfile 필드를 보강합니다.
 */

// 유저 프로필 (로그인 후 유저 정보 조회 결과)
export type UserProfile = {
    id: number;
    name: string;
    // TODO: 백엔드 유저 스키마 확정 후 필드 보강 (프로필 정보 등)
};

// 토큰 재발급 결과
export interface ReissueResult {
    accessToken: string;
}
