import axiosInstance from "@/api/axiosInstance";
import type { ApiResponse } from "@/types/api";
import type {
    OnboardingProfile,
    OnboardingRequest,
    OnboardingSubmitResult,
    ReceivedSubsidiesResult,
} from "@/types/onboarding";

/**
 * 온보딩을 최초 제출합니다. 이미 완료된 회원이면 ONB409_1로 거절됩니다.
 * 성공 시 onboardingCompleted가 true가 됩니다.
 */
export const submitOnboardingApi = async (body: OnboardingRequest) => {
    const response = await axiosInstance.post<
        ApiResponse<OnboardingSubmitResult>
    >("/onboarding", body);
    return response.data;
};

/** 내 온보딩 정보를 조회합니다. (마이페이지 수정 화면 초기값) */
export const getMyOnboardingApi = async () => {
    const response = await axiosInstance.get<ApiResponse<OnboardingProfile>>(
        "/members/me/onboarding"
    );
    return response.data;
};

/**
 * 내 온보딩 정보를 수정합니다.
 * 전체 교체 방식이라 생략한 선택 필드(incomeBracket, householdSize)는 null로 지워집니다.
 */
export const updateMyOnboardingApi = async (body: OnboardingRequest) => {
    const response = await axiosInstance.put<ApiResponse<OnboardingProfile>>(
        "/members/me/onboarding",
        body
    );
    return response.data;
};

/**
 * 기수령 지원금 목록을 저장합니다. 최종 목록 전체를 보내는 교체 방식이며,
 * 빈 배열이면 전체 해제됩니다. 존재하지 않는 id가 섞이면 SUBSIDY404_1로 전체 거절됩니다.
 */
export const setReceivedSubsidiesApi = async (subsidyIds: number[]) => {
    const response = await axiosInstance.put<
        ApiResponse<ReceivedSubsidiesResult>
    >("/onboarding/received-subsidies", { subsidyIds });
    return response.data;
};
