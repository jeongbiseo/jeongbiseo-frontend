/*
 * 예상 수령액 관련 API 통신 함수입니다.
 * 홈 요약 카드와 예상 수령액 상세 화면에서 사용합니다.
 */

import axiosInstance from "@/api/axiosInstance";
import type { ApiResponse } from "@/types/api";
import type {
    EstimatedBreakdownResult,
    EstimatedTotalResult,
} from "@/types/estimated";

/**
 * [예상 수령 총액 조회]
 * 홈 요약 카드에 표시할 건수와 금액 합계를 가져옵니다.
 */
export const getEstimatedTotalApi = async () => {
    const response =
        await axiosInstance.get<ApiResponse<EstimatedTotalResult>>(
            "/estimated-total"
        );
    return response.data;
};

/**
 * [예상 수령액 상세 조회]
 * 현금·월지급·별도혜택 항목을 각각 가져옵니다.
 * 홈에서는 배지(바우처·현물 / 금액 미확정)를 나누기 위해 함께 호출합니다.
 */
export const getEstimatedBreakdownApi = async () => {
    const response = await axiosInstance.get<
        ApiResponse<EstimatedBreakdownResult>
    >("/estimated-total/breakdown");
    return response.data;
};
