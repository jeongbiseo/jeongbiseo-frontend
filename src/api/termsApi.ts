import axiosInstance from "@/api/axiosInstance";
import type { ApiResponse } from "@/types/api";
import type { MarketingConsentResult, TermConsentsResult } from "@/types/terms";

/** 마이페이지에 표시할 약관 및 마케팅 동의 상태를 조회합니다. */
export const getMyTermConsentsApi = async () => {
    const response =
        await axiosInstance.get<ApiResponse<TermConsentsResult>>(
            "/members/me/terms"
        );
    return response.data;
};

/** 마케팅 수신 동의를 요청한 상태로 설정합니다. */
export const updateMarketingConsentApi = async (agreed: boolean) => {
    const response = await axiosInstance.post<
        ApiResponse<MarketingConsentResult>
    >("/members/me/terms/marketing", { agreed });
    return response.data;
};
