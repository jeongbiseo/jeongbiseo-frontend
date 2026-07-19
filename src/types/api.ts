/**
 * 백엔드의 공통 API 응답 형식입니다.
 */
export interface ApiResponse<T> {
    isSuccess: boolean;
    code: string;
    message: string;
    result: T;
}
