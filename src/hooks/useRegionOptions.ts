import { getRegionsApi } from "@/api/regionApi";
import type { Sigungu } from "@/types/region";
import { useEffect, useState } from "react";

export type RegionLoadStatus = "idle" | "loading" | "ready" | "error";

/** 시·도 목록과 선택한 시·도의 시·군·구 목록을 순차적으로 불러옵니다. */
export const useRegionOptions = (selectedSido: string) => {
    const [sidoList, setSidoList] = useState<string[]>([]);
    const [sigunguList, setSigunguList] = useState<Sigungu[]>([]);
    const [sigunguSido, setSigunguSido] = useState<string | null>(null);
    const [sidoStatus, setSidoStatus] = useState<RegionLoadStatus>("loading");
    const [sigunguStatus, setSigunguStatus] =
        useState<RegionLoadStatus>("idle");
    const [sidoReloadKey, setSidoReloadKey] = useState(0);
    const [sigunguReloadKey, setSigunguReloadKey] = useState(0);

    useEffect(() => {
        let active = true;

        const loadSidoList = async () => {
            setSidoStatus("loading");

            try {
                const response = await getRegionsApi();

                if (!response.isSuccess) {
                    throw new Error(response.message);
                }

                if (!active) return;

                setSidoList(response.result.sidoList ?? []);
                setSidoStatus("ready");
            } catch (error) {
                console.error(error);
                if (!active) return;

                setSidoList([]);
                setSidoStatus("error");
            }
        };

        void loadSidoList();

        return () => {
            active = false;
        };
    }, [sidoReloadKey]);

    const resolvedSido = sidoList.includes(selectedSido)
        ? selectedSido
        : (sidoList[0] ?? "");

    useEffect(() => {
        if (!resolvedSido) return;

        let active = true;

        const loadSigunguList = async () => {
            setSigunguList([]);
            setSigunguSido(resolvedSido);
            setSigunguStatus("loading");

            try {
                const response = await getRegionsApi(resolvedSido);

                if (!response.isSuccess) {
                    throw new Error(response.message);
                }

                if (
                    response.result.sido !== null &&
                    response.result.sido !== resolvedSido
                ) {
                    throw new Error("요청한 지역과 다른 응답을 받았습니다.");
                }

                if (!active) return;

                setSigunguList(response.result.sigunguList ?? []);
                setSigunguSido(response.result.sido ?? resolvedSido);
                setSigunguStatus("ready");
            } catch (error) {
                console.error(error);
                if (!active) return;

                setSigunguList([]);
                setSigunguSido(resolvedSido);
                setSigunguStatus("error");
            }
        };

        void loadSigunguList();

        return () => {
            active = false;
        };
    }, [resolvedSido, sigunguReloadKey]);

    const currentSigunguList = sigunguSido === resolvedSido ? sigunguList : [];
    const currentSigunguStatus: RegionLoadStatus = !resolvedSido
        ? "idle"
        : sigunguSido === resolvedSido
          ? sigunguStatus
          : "loading";

    return {
        sidoList,
        sigunguList: currentSigunguList,
        sigunguSido: resolvedSido ? sigunguSido : null,
        sidoStatus,
        sigunguStatus: currentSigunguStatus,
        retrySido: () => setSidoReloadKey((previous) => previous + 1),
        retrySigungu: () => setSigunguReloadKey((previous) => previous + 1),
    };
};
