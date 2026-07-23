import { getRegionsApi } from "@/api/regionApi";
import { useApiResource } from "@/hooks/useApiResource";
import type { Sigungu } from "@/types/region";
import { useCallback } from "react";

export type RegionLoadStatus = "idle" | "loading" | "ready" | "error";

const EMPTY_SIDO_LIST: string[] = [];
const EMPTY_SIGUNGU_RESOURCE: {
    sido: string | null;
    list: Sigungu[];
} = { sido: null, list: [] };

/** 시·도 목록과 선택한 시·도의 시·군·구 목록을 순차적으로 불러옵니다. */
export const useRegionOptions = (selectedSido: string) => {
    const loadSidoList = useCallback(async () => {
        const response = await getRegionsApi();
        if (!response.isSuccess) throw new Error(response.message);
        return response.result.sidoList ?? EMPTY_SIDO_LIST;
    }, []);

    const {
        data: sidoList,
        status: sidoStatus,
        retry: retrySido,
    } = useApiResource({
        load: loadSidoList,
        initialData: EMPTY_SIDO_LIST,
    });

    const resolvedSido = sidoList.includes(selectedSido)
        ? selectedSido
        : (sidoList[0] ?? "");

    const loadSigunguList = useCallback(async () => {
        const response = await getRegionsApi(resolvedSido);
        if (!response.isSuccess) throw new Error(response.message);

        if (
            response.result.sido !== null &&
            response.result.sido !== resolvedSido
        ) {
            throw new Error("요청한 지역과 다른 응답을 받았습니다.");
        }

        return {
            sido: response.result.sido ?? resolvedSido,
            list: response.result.sigunguList ?? [],
        };
    }, [resolvedSido]);

    const {
        data: sigunguResource,
        status: rawSigunguStatus,
        retry: retrySigungu,
    } = useApiResource({
        load: loadSigunguList,
        initialData: EMPTY_SIGUNGU_RESOURCE,
        enabled: Boolean(resolvedSido),
    });

    const responseMatchesSelection = sigunguResource.sido === resolvedSido;
    const sigunguList = responseMatchesSelection
        ? sigunguResource.list
        : EMPTY_SIGUNGU_RESOURCE.list;
    const sigunguStatus = !resolvedSido
        ? "idle"
        : rawSigunguStatus === "error" || responseMatchesSelection
          ? rawSigunguStatus
          : "loading";

    return {
        sidoList,
        sigunguList,
        sigunguSido: resolvedSido || null,
        sidoStatus: sidoStatus as RegionLoadStatus,
        sigunguStatus: sigunguStatus as RegionLoadStatus,
        retrySido,
        retrySigungu,
    };
};
