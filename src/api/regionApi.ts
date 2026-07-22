import axiosInstance from "@/api/axiosInstance";
import type { ApiResponse } from "@/types/api";
import type { RegionResult } from "@/types/region";

/**
 * 시·도 목록 또는 선택한 시·도의 시·군·구 목록을 조회합니다.
 * sido를 생략하면 시·도 목록이, 전달하면 해당 시·군·구 목록이 반환됩니다.
 */
export const getRegionsApi = async (sido?: string) => {
    const response = await axiosInstance.get<ApiResponse<RegionResult>>(
        "/regions",
        { params: sido ? { sido } : undefined }
    );

    return response.data;
};
