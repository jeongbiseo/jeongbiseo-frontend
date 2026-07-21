/*
 * AI 추천 지원금 API 통신 함수입니다.
 * 홈의 추천 미리보기와 추천 페이지에서 사용합니다.
 */

import axiosInstance from "@/api/axiosInstance";
import type { ApiResponse } from "@/types/api";
import type { RecommendationResult } from "@/types/recommendation";

/**
 * [추천 지원금 조회]
 * limit 기본값은 3이며 최대 20까지 요청할 수 있습니다.
 */
export const getRecommendationsApi = async (
    limit = 3,
    includeReceived = true
) => {
    const response = await axiosInstance.get<ApiResponse<RecommendationResult>>(
        "/recommendations",
        { params: { limit, includeReceived } }
    );
    return response.data;
};
