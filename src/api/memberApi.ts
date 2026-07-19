import axiosInstance from "@/api/axiosInstance";
import type { ApiResponse } from "@/types/api";
import type { UserProfile } from "@/types/auth";

export type MyInfoResponse = ApiResponse<UserProfile>;

/**
 * 앱 부팅 후 로그인 사용자 정보를 조회합니다.
 * TODO: 백엔드 Swagger 확정 후 경로와 응답 타입을 대조합니다.
 */
export const getMyInfoApi = async () => {
    const response = await axiosInstance.get<MyInfoResponse>("/members/me");
    return response.data;
};
