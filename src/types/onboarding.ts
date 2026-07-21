/* 온보딩 및 지원금 검색 관련 타입입니다. (백엔드 Swagger 기준) */

/** 고용 상태 */
export type EmploymentStatus =
    | "EMPLOYED"
    | "JOB_SEEKING"
    | "STUDENT"
    | "FREELANCER"
    | "SELF_EMPLOYED"
    | "OTHER";

/** 월 소득 구간 */
export type IncomeBracket =
    | "UNDER_200"
    | "FROM_200_TO_300"
    | "FROM_300_TO_400"
    | "FROM_400_TO_600"
    | "OVER_600";

/** 지원금 카테고리 */
export type SubsidyCategory =
    | "YOUTH"
    | "HOUSING"
    | "EMPLOYMENT"
    | "EDUCATION"
    | "STARTUP"
    | "WELFARE"
    | "ETC";

/**
 * 온보딩 제출/수정 요청 바디입니다.
 * POST /onboarding 과 PUT /members/me/onboarding 이 동일한 형식을 사용합니다.
 * name은 백엔드가 소셜 프로필에서 채우므로 전송하지 않습니다.
 * PUT은 전체 교체 방식이라, 생략한 선택 필드는 null로 지워집니다.
 */
export interface OnboardingRequest {
    /** YYYY-MM-DD */
    birthDate: string;
    sido: string;
    sigungu: string;
    employmentStatus: EmploymentStatus;
    incomeBracket?: IncomeBracket;
    /** 1~10 (본인 포함) */
    householdSize?: number;
}

/** POST /onboarding 성공 결과 */
export interface OnboardingSubmitResult {
    profileId: number;
    onboardingCompleted: boolean;
    age: number;
}

/** GET/PUT /members/me/onboarding 결과 */
export interface OnboardingProfile {
    name: string;
    birthDate: string;
    age: number;
    sido: string;
    sigungu: string;
    employmentStatus: EmploymentStatus;
    incomeBracket: IncomeBracket | null;
    householdSize: number | null;
}

/** PUT /onboarding/received-subsidies 결과 (전체 교체 방식) */
export interface ReceivedSubsidiesResult {
    receivedSubsidyIds: number[];
}

export interface ReceivedSubsidyItem {
    subsidyId: number;
    name: string;
}

export interface ReceivedSubsidyListResult {
    content: ReceivedSubsidyItem[];
    totalCount: number;
}

/** GET /subsidies 검색 결과 항목 */
export interface SubsidySearchItem {
    subsidyId: number;
    name: string;
    agency: string | null;
    /** 백엔드 카탈로그에 분류가 아직 없으면 null입니다. */
    category: SubsidyCategory | null;
    /** YYYY-MM-DD, 상시/마감없음이면 null */
    deadline: string | null;
}

/** GET /subsidies 질의 조건 */
export interface SubsidySearchParams {
    keyword?: string;
    category?: SubsidyCategory;
    page?: number;
    /** 기본 20, 최대 100 */
    size?: number;
}

/** GET /subsidies 페이지 응답 */
export interface SubsidyPageResult {
    content: SubsidySearchItem[];
    page: number;
    size: number;
    totalElements: number;
    totalPages: number;
    last: boolean;
}
