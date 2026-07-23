import { getSubsidyCategoriesApi } from "@/api/subsidyApi";
import type { SubsidyCategoryOption } from "@/types/onboarding";
import { useCallback } from "react";
import { useApiResource } from "@/hooks/useApiResource";

export type CategoryLoadStatus = "idle" | "loading" | "ready" | "error";

const EMPTY_CATEGORIES: SubsidyCategoryOption[] = [];

/** 지원금 카테고리 필터 목록을 불러옵니다. */
export const useSubsidyCategories = (enabled = true) => {
    const loadCategories = useCallback(async () => {
        const response = await getSubsidyCategoriesApi();
        if (!response.isSuccess) throw new Error(response.message);
        return response.result;
    }, []);

    const { data, status, retry } = useApiResource({
        load: loadCategories,
        initialData: EMPTY_CATEGORIES,
        enabled,
    });

    return {
        categories: data,
        status: status as CategoryLoadStatus,
        retry,
    };
};
