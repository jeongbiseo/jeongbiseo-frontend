import { getSubsidyCategoriesApi } from "@/api/subsidyApi";
import type { SubsidyCategoryOption } from "@/types/onboarding";
import { useEffect, useState } from "react";

export type CategoryLoadStatus = "idle" | "loading" | "ready" | "error";

/** 지원금 카테고리 필터 목록을 불러옵니다. */
export const useSubsidyCategories = (enabled = true) => {
    const [categories, setCategories] = useState<SubsidyCategoryOption[]>([]);
    const [status, setStatus] = useState<CategoryLoadStatus>("loading");
    const [reloadKey, setReloadKey] = useState(0);

    useEffect(() => {
        if (!enabled) return;

        let active = true;

        const loadCategories = async () => {
            setStatus("loading");

            try {
                const response = await getSubsidyCategoriesApi();

                if (!response.isSuccess) {
                    throw new Error(response.message);
                }

                if (!active) return;

                setCategories(response.result);
                setStatus("ready");
            } catch (error) {
                console.error(error);
                if (!active) return;

                setCategories([]);
                setStatus("error");
            }
        };

        void loadCategories();

        return () => {
            active = false;
        };
    }, [enabled, reloadKey]);

    return {
        categories: enabled ? categories : [],
        status: enabled ? status : ("idle" as const),
        retry: () => setReloadKey((previous) => previous + 1),
    };
};
