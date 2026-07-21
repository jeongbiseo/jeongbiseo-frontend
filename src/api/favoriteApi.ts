import axiosInstance from "@/api/axiosInstance";
import type { ApiResponse } from "@/types/api";
import type { SubsidySearchItem } from "@/types/onboarding";

export type FavoriteResult = {
    subsidyId: number;
    favorited: boolean;
};

export type FavoriteListResult = {
    content: SubsidySearchItem[];
    totalCount: number;
};

export const getFavoritesApi = async () => {
    const response = await axiosInstance.get<ApiResponse<FavoriteListResult>>(
        "/subsidies/favorites"
    );

    return response.data;
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
