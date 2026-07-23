import { useCallback, useEffect, useState } from "react";

export type ApiResourceStatus = "loading" | "ready" | "error";

type ApiResourceState<T> = {
    data: T;
    status: ApiResourceStatus;
    error: unknown;
};

export const useApiResource = <T>({
    load,
    initialData,
    enabled = true,
}: {
    load: () => Promise<T>;
    initialData: T;
    enabled?: boolean;
}) => {
    const [reloadKey, setReloadKey] = useState(0);
    const [state, setState] = useState<ApiResourceState<T>>({
        data: initialData,
        status: "loading",
        error: null,
    });

    useEffect(() => {
        if (!enabled) return;

        let active = true;
        const loadResource = async () => {
            setState({ data: initialData, status: "loading", error: null });

            try {
                const data = await load();
                if (active) setState({ data, status: "ready", error: null });
            } catch (error) {
                console.error(error);
                if (active) {
                    setState({ data: initialData, status: "error", error });
                }
            }
        };

        void loadResource();

        return () => {
            active = false;
        };
    }, [enabled, initialData, load, reloadKey]);

    const retry = useCallback(
        () => setReloadKey((previous) => previous + 1),
        []
    );

    return {
        data: enabled ? state.data : initialData,
        status: enabled ? state.status : ("idle" as const),
        error: enabled ? state.error : null,
        retry,
    };
};
