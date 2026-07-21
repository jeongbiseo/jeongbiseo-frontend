import axiosInstance from "@/api/axiosInstance";
import type { ApiResponse } from "@/types/api";
import type { UserProfile } from "@/types/auth";

export type MyInfoResponse = ApiResponse<UserProfile>;

/** 앱 부팅 후 로그인 사용자 정보를 조회합니다. */
export const getMyInfoApi = async () => {
    const response = await axiosInstance.get<MyInfoResponse>("/members/me");
    return response.data;
};

/** 현재 로그인한 회원을 탈퇴 처리합니다. 탈퇴 사유는 선택값입니다. */
export const withdrawMemberApi = async (reason?: string) => {
    const response = await axiosInstance.delete<ApiResponse<string>>(
        "/members/me",
        { data: reason ? { reason } : {} }
    );
    return response.data;
};
