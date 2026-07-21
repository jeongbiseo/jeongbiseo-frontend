import { useAuthStore } from "@/stores/authStore";
import type { ApiResponse } from "@/types/api";
import type { ReissueResult } from "@/types/auth";
import axios, { type InternalAxiosRequestConfig } from "axios";

const REISSUE_PATH = "/auth/reissue";

// 개발 환경에서는 Vite proxy를 사용하고, 배포 환경에서는 백엔드 주소를 사용합니다.
const apiOrigin = import.meta.env.PROD
    ? (import.meta.env.VITE_API_URL ?? "").replace(/\/$/, "")
    : "";

const axiosInstance = axios.create({
    baseURL: `${apiOrigin}/api/v1`,
    withCredentials: true,
    timeout: 10_000,
});

const NO_TOKEN_PATHS = [REISSUE_PATH, "/auth/kakao", "/auth/google"] as const;
// 인증 흐름 엔드포인트는 401이 나도 재발급을 시도하지 않습니다.
const NO_REISSUE_PATHS = [
    REISSUE_PATH,
    "/auth/logout",
    "/auth/kakao",
    "/auth/google",
] as const;

let refreshPromise: Promise<string> | null = null;

const matchesPath = (url: string, paths: readonly string[]) =>
    paths.some((path) => url.includes(path));

axiosInstance.interceptors.request.use((config: InternalAxiosRequestConfig) => {
    const accessToken = useAuthStore.getState().accessToken;
    const url = config.url ?? "";

    if (accessToken && !matchesPath(url, NO_TOKEN_PATHS)) {
        config.headers.Authorization = `Bearer ${accessToken}`;
    }

    return config;
});

/**
 * HttpOnly Refresh Token 쿠키를 이용해 Access Token을 재발급합니다.
 * 앱 부팅과 401 재시도가 이 Promise를 공유해 토큰 회전 요청 중복을 막습니다.
 */
export const reissueAccessToken = async (): Promise<string> => {
    if (!refreshPromise) {
        refreshPromise = (async () => {
            const response =
                await axiosInstance.post<ApiResponse<ReissueResult>>(
                    REISSUE_PATH
                );
            const { isSuccess, result } = response.data;

            if (!isSuccess || !result?.accessToken) {
                throw new Error("Access Token 재발급에 실패했습니다.");
            }

            useAuthStore.getState().setAccessToken(result.accessToken);
            return result.accessToken;
        })().finally(() => {
            refreshPromise = null;
        });
    }

    return refreshPromise;
};

axiosInstance.interceptors.response.use(
    (response) => response,
    async (error: unknown) => {
        if (!axios.isAxiosError(error)) {
            return Promise.reject(
                new Error("알 수 없는 API 오류가 발생했습니다.")
            );
        }

        const originalRequest = error.config as
            (InternalAxiosRequestConfig & { _retry?: boolean }) | undefined;

        if (!originalRequest) return Promise.reject(error);

        const status = error.response?.status;
        const url = originalRequest.url ?? "";
        const shouldReissue =
            status === 401 &&
            !originalRequest._retry &&
            !matchesPath(url, NO_REISSUE_PATHS);

        if (!shouldReissue) return Promise.reject(error);

        originalRequest._retry = true;

        try {
            const accessToken = await reissueAccessToken();
            originalRequest.headers.Authorization = `Bearer ${accessToken}`;
            return axiosInstance(originalRequest);
        } catch (reissueError) {
            useAuthStore.getState().logout();
            return Promise.reject(reissueError);
        }
    }
);

export default axiosInstance;
