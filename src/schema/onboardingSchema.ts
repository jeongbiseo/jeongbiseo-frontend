/**
 * 온보딩 폼 데이터 검증 스키마입니다.
 * Zod로 입력값을 검증하고, 통과한 데이터의 TS 타입을 z.infer로 추론해 제공합니다.
 *
 * 생년월일은 화면에서 년/월/일 3개의 select로 입력받으므로 각각 필드로 두고,
 * 존재하지 않는 날짜(예: 2월 30일)는 .refine으로 걸러냅니다.
 *
 * incomeBracket과 householdSize는 선택 항목이라 optional이며,
 * 값이 없으면 서버로 전송하지 않습니다. (전송 시 null로 지워지는 것을 방지)
 */

import type { OnboardingRequest } from "@/types/onboarding";
import z from "zod";

const employmentStatusSchema = z.enum([
    "EMPLOYED",
    "JOB_SEEKING",
    "STUDENT",
    "FREELANCER",
    "SELF_EMPLOYED",
    "OTHER",
]);

const incomeBracketSchema = z.enum([
    "UNDER_200",
    "FROM_200_TO_300",
    "FROM_300_TO_400",
    "FROM_400_TO_600",
    "OVER_600",
]);

// 실제로 존재하는 날짜인지 확인합니다. (윤년, 30/31일 등)
const isRealDate = (year: number, month: number, day: number) => {
    const date = new Date(year, month - 1, day);
    return (
        date.getFullYear() === year &&
        date.getMonth() === month - 1 &&
        date.getDate() === day
    );
};

export const onboardingSchema = z
    .object({
        birthYear: z.number(),
        birthMonth: z.number(),
        birthDay: z.number(),
        sido: z.string().min(1, "거주지를 선택해주세요."),
        sigungu: z.string().min(1, "거주지를 선택해주세요."),
        employmentStatus: employmentStatusSchema,
        incomeBracket: incomeBracketSchema.optional(),
        householdSize: z.number().min(1).max(10).optional(),
        receivedSubsidyIds: z.array(z.number()),
    })
    .refine(
        ({ birthYear, birthMonth, birthDay }) =>
            isRealDate(birthYear, birthMonth, birthDay),
        {
            message: "존재하지 않는 날짜예요. 다시 선택해주세요.",
            path: ["birthDay"],
        }
    );

export type OnboardingFormType = z.infer<typeof onboardingSchema>;

/** 폼 값을 백엔드 온보딩 요청 형식으로 변환합니다. */
export const toOnboardingRequest = ({
    birthYear,
    birthMonth,
    birthDay,
    sido,
    sigungu,
    employmentStatus,
    incomeBracket,
    householdSize,
}: OnboardingFormType): OnboardingRequest => ({
    birthDate: `${birthYear}-${String(birthMonth).padStart(2, "0")}-${String(
        birthDay
    ).padStart(2, "0")}`,
    sido,
    sigungu,
    employmentStatus,
    ...(incomeBracket ? { incomeBracket } : {}),
    ...(householdSize ? { householdSize } : {}),
});
