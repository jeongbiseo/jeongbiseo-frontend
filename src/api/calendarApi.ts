/*
 * 마감 캘린더 API 통신 함수입니다.
 * 홈의 캘린더 미리보기와 캘린더 페이지에서 사용합니다.
 */

import axiosInstance from "@/api/axiosInstance";
import type { ApiResponse } from "@/types/api";
import type { CalendarResult } from "@/types/calendar";

/**
 * [마감 캘린더 조회]
 * year, month를 생략하면 서버가 현재 월을 기준으로 응답합니다.
 */
export const getCalendarApi = async (year?: number, month?: number) => {
    const response = await axiosInstance.get<ApiResponse<CalendarResult>>(
        "/calendar",
        { params: { year, month } }
    );
    return response.data;
};
