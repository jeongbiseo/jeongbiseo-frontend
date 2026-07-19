import axiosInstance from "@/api/axiosInstance";
import type { ApiResponse } from "@/types/api";
import type {
    SocialCallbackResponse,
    SocialLoginRequest,
    SocialProvider,
} from "@/types/auth";

/**
 * 소셜 로그인 인가 코드를 백엔드에 전달해 Access Token을 교환합니다.
 * 성공 시 서버가 Refresh Token을 HttpOnly 쿠키로 내려줍니다.
 */
export const socialLoginApi = async (
    provider: SocialProvider,
    body: SocialLoginRequest
) => {
    const response = await axiosInstance.post<
        ApiResponse<SocialCallbackResponse>
    >(`/auth/${provider}`, body);
    return response.data;
};

/**
 * 로그아웃합니다. 서버가 Refresh Token 쿠키를 만료시킵니다.
 * 클라이언트 인증 상태 초기화는 호출부에서 authStore.logout으로 처리합니다.
 */
export const logoutApi = async () => {
    const response =
        await axiosInstance.post<ApiResponse<string>>("/auth/logout");
    return response.data;
};
