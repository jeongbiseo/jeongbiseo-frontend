import axiosInstance from "@/api/axiosInstance";
import type { ApiResponse } from "@/types/api";

export type FavoriteResult = {
    subsidyId: number;
    favorited: boolean;
};

export const addFavoriteApi = async (subsidyId: number) => {
    const response = await axiosInstance.post<ApiResponse<FavoriteResult>>(
        `/subsidies/${subsidyId}/favorite`
    );

    return response.data;
};

export const removeFavoriteApi = async (subsidyId: number) => {
    const response = await axiosInstance.delete<ApiResponse<FavoriteResult>>(
        `/subsidies/${subsidyId}/favorite`
    );

    return response.data;
};
