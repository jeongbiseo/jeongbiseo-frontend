/*
 * 온보딩 · 마이페이지 수정에서 공통으로 사용하는 선택지 상수입니다.
 * 지원금 검색 카테고리 선택지는 GET /subsidies/categories 응답을 사용합니다.
 */

import type {
    EmploymentStatus,
    IncomeBracket,
    SubsidyCategory,
} from "@/types/onboarding";

export const employmentOptions: {
    label: string;
    value: EmploymentStatus;
}[] = [
    { label: "재직중", value: "EMPLOYED" },
    { label: "구직중", value: "JOB_SEEKING" },
    { label: "학생", value: "STUDENT" },
    { label: "프리랜서", value: "FREELANCER" },
    { label: "자영업", value: "SELF_EMPLOYED" },
    { label: "기타", value: "OTHER" },
];

/**
 * 월 소득 기준 5구간입니다.
 * 소득 없음/0원은 UNDER_200으로 보내고, 건너뛰면 값을 보내지 않습니다.
 * 400만원 이상은 소득 상한 판정을 위해 400~600과 600 이상으로 반드시 구분합니다.
 */
export const incomeOptions: { label: string; value: IncomeBracket }[] = [
    { label: "월 200만원 미만", value: "UNDER_200" },
    { label: "월 200 ~ 300만원", value: "FROM_200_TO_300" },
    { label: "월 300 ~ 400만원", value: "FROM_300_TO_400" },
    { label: "월 400 ~ 600만원", value: "FROM_400_TO_600" },
    { label: "월 600만원 이상", value: "OVER_600" },
];

export const employmentLabelOf = (value: EmploymentStatus) =>
    employmentOptions.find((option) => option.value === value)?.label ?? "";

export const incomeLabelOf = (value: IncomeBracket | null) =>
    incomeOptions.find((option) => option.value === value)?.label ?? "";

/** 상세 API는 카테고리 라벨을 주지 않으므로 enum 표시용으로만 사용합니다. */
const subsidyCategoryLabels: Record<SubsidyCategory, string> = {
    YOUTH: "청년",
    HOUSING: "주거",
    EMPLOYMENT: "고용",
    EDUCATION: "교육",
    STARTUP: "창업",
    WELFARE: "복지",
    ETC: "기타",
};

export const subsidyCategoryLabelOf = (value: SubsidyCategory) =>
    subsidyCategoryLabels[value];
