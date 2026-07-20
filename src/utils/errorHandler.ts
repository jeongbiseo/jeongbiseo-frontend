/*
 * 컴포넌트 전역에서 사용되는 API 통신 에러 공통 처리 유틸리티입니다.
 *
 * 해당 파일은 React Hook Form 전용 API 에러 핸들러를 제공합니다.
 * API 요청 실패 시, 에러 객체를 분석하여 React Hook Form의 root 에러로 띄워줍니다.
 *
 * handleApiError는 다음 요소들을 파라미터로 받습니다.
 * - err catch문에서 넘어온 에러 객체 (unknown)
 * - setError RHF의 setError 함수
 * - defaultMessage 서버에서 주는 에러 메시지가 없을 때 띄울 기본 메시지
 */

import axios from "axios";
import type { FieldValues, UseFormSetError } from "react-hook-form";

// 서버에서 보내주는 에러 데이터의 형태 정의
interface ErrorResponseData {
    isSuccess: boolean;
    code: string;
    message: string;
    result?: null;
}

export const handleApiError = <T extends FieldValues>(
    err: unknown,
    setError: UseFormSetError<T>,
    defaultMessage: string = "요청 처리 중 오류가 발생했습니다."
) => {
    // axios error이기 때문에 axios.isAxiosError로 err을 판별함
    if (axios.isAxiosError<ErrorResponseData>(err)) {
        console.warn("API 통신 실패:", err.response?.data || err.message);
        setError("root", {
            message: err.response?.data?.message || defaultMessage,
        });
    } else {
        console.warn("알 수 없는 에러:", err);
        setError("root", {
            message: "알 수 없는 오류가 발생했습니다.",
        });
    }
};

/** 서버 에러 코드를 확인해야 할 때 사용합니다. (예: ONB409_1 중복 제출) */
export const getApiErrorCode = (err: unknown) =>
    axios.isAxiosError<ErrorResponseData>(err)
        ? err.response?.data?.code
        : undefined;
