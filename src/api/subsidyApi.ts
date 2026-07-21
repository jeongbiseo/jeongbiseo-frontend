import axiosInstance from "@/api/axiosInstance";
import type { ApiResponse } from "@/types/api";
import type {
    SubsidyPageResult,
    SubsidySearchParams,
} from "@/types/onboarding";
import type { SubsidyDetailResult } from "@/types/subsidy";

/**
 * 지원금을 검색합니다. 온보딩 3단계(기수령 지원금 선택)에서
 * 실제 subsidyId를 얻기 위해 사용합니다.
 */
export const searchSubsidiesApi = async ({
    keyword,
    category,
    sort,
    includeClosed,
    page = 0,
    size = 20,
}: SubsidySearchParams = {}) => {
    const response = await axiosInstance.get<ApiResponse<SubsidyPageResult>>(
        "/subsidies",
        {
            params: {
                keyword: keyword || undefined,
                category,
                sort,
                includeClosed,
                page,
                size,
            },
        }
    );
    return response.data;
};

export const getSubsidyDetailApi = async (subsidyId: number) => {
    const response = await axiosInstance.get<ApiResponse<SubsidyDetailResult>>(
        `/subsidies/${subsidyId}`
    );

    return response.data;
};
