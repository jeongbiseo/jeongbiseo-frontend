import {
    addFavoriteApi,
    getFavoritesApi,
    removeFavoriteApi,
} from "@/api/favoriteApi";
import { getReceivedSubsidiesApi } from "@/api/onboardingApi";
import { getRecommendationsApi } from "@/api/recommendationApi";
import { searchSubsidiesApi } from "@/api/subsidyApi";
import Toast from "@/components/common/Toast";
import {
    RecommendationControls,
    RecommendationSortSheet,
} from "@/components/recommendation/RecommendationControls";
import { RecommendationPolicyCard } from "@/components/recommendation/RecommendationPolicyCard";
import {
    EmptyRecommendation,
    FavoriteEmptyState,
    LoadErrorState,
    RecommendationSkeleton,
    SearchEmptyState,
    SimpleEmptyState,
} from "@/components/recommendation/RecommendationStates";
import { RecommendationFreshness } from "@/components/recommendation/RecommendationFreshness";
import {
    isUrgentRecommendationPolicy,
    type RecommendationPolicy,
} from "@/constants/recommendationData";
import {
    getRecommendationSortLabel,
    type RecommendationTab,
    type SortOption,
} from "@/constants/recommendationControls";
import type { RecommendationItem } from "@/types/recommendation";
import type { SubsidySearchItem } from "@/types/onboarding";
import { formatAmountRange, formatDDay } from "@/utils/format";
import {
    mergeUniquePolicies,
    reconcilePolicyFavorites,
    reconcileReceivedPolicies,
    updateFavoriteCollection,
    updatePolicyFavorite,
} from "@/utils/recommendationPolicyState";
import { useEffect, useMemo, useRef, useState } from "react";
import { useLocation, useNavigate, useSearchParams } from "react-router-dom";

const getInitialTab = (value: string | null): RecommendationTab =>
    value === "favorites" || value === "all" ? value : "recommended";

const getInitialSort = (value: string | null): SortOption =>
    value === "deadline" || value === "title" ? value : "recommended";

const toApiSort = (sortOption: SortOption) => {
    if (sortOption === "deadline") return "DEADLINE" as const;
    if (sortOption === "title") return "NAME" as const;
    return undefined;
};

const toRecommendationPolicy = (
    item: RecommendationItem,
    favoriteIds: number[],
    receivedIds: number[]
): RecommendationPolicy => ({
    id: item.subsidyId,
    organization: item.agency,
    title: item.name,
    amount: item.estimatedAmountMax ?? item.estimatedAmountMin,
    amountLabel: formatAmountRange(
        item.estimatedAmountMin,
        item.estimatedAmountMax,
        item.paymentType === "MONTHLY" ? " / 월" : ""
    ),
    deadlineDays: item.dDay,
    deadlineLabel: formatDDay(item.dDay),
    eligibilitySummary: item.eligibilitySummary,
    confirmedMatchCount: item.confirmedMatchCount,
    unverifiedConditionCount: item.unverifiedConditionCount,
    uncomputable: item.uncomputable,
    uncomputableReasons: item.uncomputableReasons,
    isFavorite: favoriteIds.includes(item.subsidyId),
    isRecommended: true,
    isReceived: receivedIds.includes(item.subsidyId),
});

const getDeadlineDays = (deadline: string | null) => {
    if (!deadline) return null;

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const deadlineDate = new Date(`${deadline}T00:00:00`);

    return Math.ceil(
        (deadlineDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24)
    );
};

const toAllPolicy = (
    item: SubsidySearchItem,
    favoriteIds: number[],
    receivedIds: number[]
): RecommendationPolicy => {
    const deadlineDays = getDeadlineDays(item.deadline);

    return {
        id: item.subsidyId,
        organization: item.agency ?? "기관 정보 없음",
        title: item.name,
        amount: item.estimatedAmountMax ?? item.estimatedAmountMin,
        amountLabel: formatAmountRange(
            item.estimatedAmountMin,
            item.estimatedAmountMax
        ),
        deadlineDays,
        deadlineLabel:
            deadlineDays !== null && deadlineDays < 0
                ? "마감"
                : formatDDay(deadlineDays),
        eligibilitySummary: null,
        confirmedMatchCount: null,
        unverifiedConditionCount: null,
        uncomputable: false,
        uncomputableReasons: [],
        isFavorite: favoriteIds.includes(item.subsidyId),
        isRecommended: false,
        isReceived: receivedIds.includes(item.subsidyId),
    };
};

const Recommendation = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const [searchParams] = useSearchParams();
    const [recommendedPolicies, setRecommendedPolicies] = useState<
        RecommendationPolicy[]
    >([]);
    const [recommendationLoading, setRecommendationLoading] = useState(true);
    const [recommendationError, setRecommendationError] = useState(false);
    const [recommendationReloadKey, setRecommendationReloadKey] = useState(0);
    const [recommendationDataUpdatedAt, setRecommendationDataUpdatedAt] =
        useState<string | null>(null);
    const [allPolicies, setAllPolicies] = useState<RecommendationPolicy[]>([]);
    const [allLoading, setAllLoading] = useState(false);
    const [allLoadingMore, setAllLoadingMore] = useState(false);
    const [allError, setAllError] = useState(false);
    const [allReloadKey, setAllReloadKey] = useState(0);
    const [allPage, setAllPage] = useState(0);
    const [allLast, setAllLast] = useState(true);
    const [favoritePolicies, setFavoritePolicies] = useState<
        RecommendationPolicy[]
    >([]);
    const [favoritesLoading, setFavoritesLoading] = useState(false);
    const [favoritesError, setFavoritesError] = useState(false);
    const [favoritesReloadKey, setFavoritesReloadKey] = useState(0);
    const [favoritesInitialized, setFavoritesInitialized] = useState(false);
    const favoriteIdsRef = useRef<Set<number>>(new Set());
    const [favoriteUpdatingIds, setFavoriteUpdatingIds] = useState<Set<number>>(
        () => new Set()
    );
    const [receivedIds, setReceivedIds] = useState<number[]>([]);
    const receivedIdsRef = useRef<Set<number>>(new Set());
    const [receivedStatus, setReceivedStatus] = useState<
        "loading" | "ready" | "error"
    >("loading");
    const [receivedReloadKey, setReceivedReloadKey] = useState(0);
    const [activeTab, setActiveTab] = useState<RecommendationTab>(() =>
        getInitialTab(searchParams.get("tab"))
    );
    const [sortOption, setSortOption] = useState<SortOption>(() =>
        getInitialSort(searchParams.get("sort"))
    );
    const [allowDuplicates, setAllowDuplicates] = useState(true);
    const [sortSheetOpen, setSortSheetOpen] = useState(false);
    const [searchOpen, setSearchOpen] = useState(false);
    const [query, setQuery] = useState("");
    const [toastMessage, setToastMessage] = useState<string | null>(null);
    const urgentOnly = searchParams.get("filter") === "urgent";
    const cameFromMyPage =
        (location.state as { from?: string } | null)?.from === "mypage";

    const sortLabel = getRecommendationSortLabel(sortOption, activeTab);

    const policies = useMemo(() => {
        if (activeTab === "recommended") return recommendedPolicies;
        if (activeTab === "all") return allPolicies;
        return favoritePolicies;
    }, [activeTab, allPolicies, favoritePolicies, recommendedPolicies]);

    const loading =
        receivedStatus === "loading" ||
        favoritesLoading ||
        (activeTab === "recommended"
            ? recommendationLoading
            : activeTab === "all"
              ? allLoading && allPolicies.length === 0
              : false);
    const loadError =
        receivedStatus === "error" ||
        favoritesError ||
        (activeTab === "recommended"
            ? recommendationError
            : activeTab === "all"
              ? allError
              : false);

    const visiblePolicies = useMemo(() => {
        const normalizedQuery = query.replace(/\s+/g, "").toLowerCase();
        const filteredPolicies = policies.filter((policy) => {
            const matchesTab =
                activeTab === "all" ||
                (activeTab === "recommended" && policy.isRecommended) ||
                (activeTab === "favorites" && policy.isFavorite);
            const matchesDuplicateOption =
                allowDuplicates || !policy.isReceived;
            const matchesUrgentFilter =
                !urgentOnly || isUrgentRecommendationPolicy(policy);
            const matchesQuery =
                normalizedQuery.length === 0 ||
                policy.title
                    .replace(/\s+/g, "")
                    .toLowerCase()
                    .includes(normalizedQuery) ||
                policy.organization
                    .replace(/\s+/g, "")
                    .toLowerCase()
                    .includes(normalizedQuery);

            return (
                matchesTab &&
                matchesDuplicateOption &&
                matchesUrgentFilter &&
                matchesQuery
            );
        });

        if (activeTab === "all") return filteredPolicies;

        return [...filteredPolicies].sort((first, second) => {
            if (sortOption === "deadline") {
                return (
                    (first.deadlineDays ?? Number.MAX_SAFE_INTEGER) -
                    (second.deadlineDays ?? Number.MAX_SAFE_INTEGER)
                );
            }
            if (sortOption === "title") {
                return first.title.localeCompare(second.title, "ko");
            }

            return Number(second.isRecommended) - Number(first.isRecommended);
        });
    }, [activeTab, allowDuplicates, policies, query, sortOption, urgentOnly]);

    const toggleFavorite = async (id: number) => {
        if (favoriteUpdatingIds.has(id)) return;

        const target = policies.find((policy) => policy.id === id);
        if (!target) return;

        const nextFavorite = !target.isFavorite;
        const updateFavorite = (isFavorite: boolean) => {
            const updatePolicies = (previous: RecommendationPolicy[]) =>
                updatePolicyFavorite(previous, id, isFavorite);

            setRecommendedPolicies(updatePolicies);
            setAllPolicies(updatePolicies);
            setFavoritePolicies((previous) =>
                updateFavoriteCollection(previous, target, isFavorite)
            );

            if (isFavorite) favoriteIdsRef.current.add(id);
            else favoriteIdsRef.current.delete(id);
        };

        setFavoriteUpdatingIds((previous) => new Set(previous).add(id));
        updateFavorite(nextFavorite);

        try {
            const response = nextFavorite
                ? await addFavoriteApi(id)
                : await removeFavoriteApi(id);

            if (!response.isSuccess) {
                throw new Error(response.message);
            }
        } catch (error) {
            console.error(error);
            updateFavorite(!nextFavorite);
            setToastMessage("즐겨찾기를 변경하지 못했습니다.");
        } finally {
            setFavoriteUpdatingIds((previous) => {
                const next = new Set(previous);
                next.delete(id);
                return next;
            });
        }
    };

    useEffect(() => {
        let active = true;

        const loadReceivedSubsidies = async () => {
            setReceivedStatus("loading");

            try {
                const response = await getReceivedSubsidiesApi();

                if (!response.isSuccess) {
                    throw new Error(response.message);
                }

                if (!active) return;

                const ids = response.result.content.map(
                    (item) => item.subsidyId
                );
                const idSet = new Set(ids);
                receivedIdsRef.current = idSet;
                const markReceived = (previous: RecommendationPolicy[]) =>
                    reconcileReceivedPolicies(previous, idSet);

                setReceivedIds(ids);
                setRecommendedPolicies(markReceived);
                setAllPolicies(markReceived);
                setFavoritePolicies(markReceived);
                setReceivedStatus("ready");
            } catch (error) {
                console.error(error);
                if (active) setReceivedStatus("error");
            }
        };

        void loadReceivedSubsidies();

        return () => {
            active = false;
        };
    }, [receivedReloadKey]);

    useEffect(() => {
        if (!favoritesInitialized) return;

        let active = true;

        const loadRecommendations = async () => {
            setRecommendationLoading(true);
            setRecommendationError(false);

            try {
                const response = await getRecommendationsApi(
                    20,
                    allowDuplicates
                );

                if (!response.isSuccess) {
                    throw new Error(response.message);
                }

                if (!active) return;

                const favoriteIds = [...favoriteIdsRef.current];
                setRecommendedPolicies(
                    response.result.items.map((item) =>
                        toRecommendationPolicy(item, favoriteIds, receivedIds)
                    )
                );
                setRecommendationDataUpdatedAt(response.result.dataUpdatedAt);
            } catch (error) {
                console.error(error);
                if (active) setRecommendationError(true);
            } finally {
                if (active) setRecommendationLoading(false);
            }
        };

        void loadRecommendations();

        return () => {
            active = false;
        };
    }, [
        allowDuplicates,
        favoritesInitialized,
        receivedIds,
        recommendationReloadKey,
    ]);

    useEffect(() => {
        if (activeTab !== "all" || !favoritesInitialized) return;

        let active = true;
        const timer = window.setTimeout(() => {
            const loadAllPolicies = async () => {
                setAllLoading(true);
                setAllError(false);

                try {
                    const response = await searchSubsidiesApi({
                        keyword: query.trim() || undefined,
                        sort: toApiSort(sortOption),
                        page: 0,
                        size: 20,
                    });

                    if (!response.isSuccess) {
                        throw new Error(response.message);
                    }

                    if (!active) return;

                    const favoriteIds = [...favoriteIdsRef.current];
                    setAllPolicies(
                        response.result.content.map((item) =>
                            toAllPolicy(item, favoriteIds, receivedIds)
                        )
                    );
                    setAllPage(response.result.page);
                    setAllLast(response.result.last);
                } catch (error) {
                    console.error(error);
                    if (active) setAllError(true);
                } finally {
                    if (active) setAllLoading(false);
                }
            };

            void loadAllPolicies();
        }, 300);

        return () => {
            active = false;
            window.clearTimeout(timer);
        };
    }, [
        activeTab,
        allReloadKey,
        favoritesInitialized,
        query,
        receivedIds,
        sortOption,
    ]);

    const loadMoreAllPolicies = async () => {
        if (allLoadingMore || allLast) return;

        setAllLoadingMore(true);

        try {
            const response = await searchSubsidiesApi({
                keyword: query.trim() || undefined,
                sort: toApiSort(sortOption),
                page: allPage + 1,
                size: 20,
            });

            if (!response.isSuccess) {
                throw new Error(response.message);
            }

            const favoriteIds = [...favoriteIdsRef.current];
            const nextPolicies = response.result.content.map((item) =>
                toAllPolicy(item, favoriteIds, receivedIds)
            );
            setAllPolicies((previous) =>
                mergeUniquePolicies(previous, nextPolicies)
            );
            setAllPage(response.result.page);
            setAllLast(response.result.last);
        } catch (error) {
            console.error(error);
            setToastMessage("지원금을 더 불러오지 못했습니다.");
        } finally {
            setAllLoadingMore(false);
        }
    };

    useEffect(() => {
        let active = true;

        const loadFavorites = async () => {
            setFavoritesLoading(true);
            setFavoritesError(false);
            setFavoritesInitialized(false);

            try {
                const response = await getFavoritesApi();

                if (!response.isSuccess) {
                    throw new Error(response.message);
                }

                if (!active) return;

                const favoriteIds = response.result.content.map(
                    (item) => item.subsidyId
                );
                const currentReceivedIds = [...receivedIdsRef.current];
                const favoriteIdSet = new Set(favoriteIds);
                favoriteIdsRef.current = favoriteIdSet;
                setFavoritePolicies(
                    response.result.content.map((item) => ({
                        ...toAllPolicy(item, favoriteIds, currentReceivedIds),
                        isFavorite: true,
                    }))
                );
                setRecommendedPolicies((previous) =>
                    reconcilePolicyFavorites(previous, favoriteIdSet)
                );
                setAllPolicies((previous) =>
                    reconcilePolicyFavorites(previous, favoriteIdSet)
                );
                setFavoritesInitialized(true);
            } catch (error) {
                console.error(error);
                if (active) setFavoritesError(true);
            } finally {
                if (active) setFavoritesLoading(false);
            }
        };

        void loadFavorites();

        return () => {
            active = false;
        };
    }, [favoritesReloadKey]);

    return (
        <>
            <main className="bg-surface-dim flex min-h-svh justify-center">
                <section className="bg-ground text-text-strong min-h-svh w-full max-w-[390px] pt-[72px] pb-[130px]">
                    <RecommendationControls
                        cameFromMyPage={cameFromMyPage}
                        searchOpen={searchOpen}
                        query={query}
                        activeTab={activeTab}
                        sortLabel={sortLabel}
                        allowDuplicates={allowDuplicates}
                        duplicatesDisabled={receivedStatus !== "ready"}
                        onToggleSearch={() => {
                            setSearchOpen((previous) => !previous);
                            if (searchOpen) {
                                setQuery("");
                            } else {
                                setActiveTab("all");
                            }
                        }}
                        onQueryChange={setQuery}
                        onTabChange={setActiveTab}
                        onOpenSort={() => setSortSheetOpen(true)}
                        onAllowDuplicatesChange={setAllowDuplicates}
                    />
                    {!loading &&
                        !loadError &&
                        activeTab === "recommended" &&
                        recommendationDataUpdatedAt && (
                            <div className="mx-auto mt-5 w-full max-w-[312px]">
                                <RecommendationFreshness
                                    dataUpdatedAt={recommendationDataUpdatedAt}
                                />
                            </div>
                        )}

                    {loading ? (
                        <RecommendationSkeleton />
                    ) : loadError ? (
                        <LoadErrorState
                            onRetry={() => {
                                if (receivedStatus === "error") {
                                    setReceivedReloadKey(
                                        (previous) => previous + 1
                                    );
                                } else if (favoritesError) {
                                    setFavoritesReloadKey(
                                        (previous) => previous + 1
                                    );
                                } else if (activeTab === "recommended") {
                                    setRecommendationReloadKey(
                                        (previous) => previous + 1
                                    );
                                } else if (activeTab === "all") {
                                    setAllReloadKey((previous) => previous + 1);
                                } else {
                                    setFavoritesReloadKey(
                                        (previous) => previous + 1
                                    );
                                }
                            }}
                        />
                    ) : visiblePolicies.length > 0 ? (
                        <div className="mx-auto mt-7 flex w-full max-w-[312px] flex-col gap-4">
                            {visiblePolicies.map((policy) => (
                                <RecommendationPolicyCard
                                    key={policy.id}
                                    policy={policy}
                                    favoriteUpdating={favoriteUpdatingIds.has(
                                        policy.id
                                    )}
                                    onFavoriteToggle={toggleFavorite}
                                />
                            ))}
                            {activeTab === "all" && !allLast && (
                                <button
                                    className="border-primary text-primary mt-2 h-[44px] cursor-pointer rounded-[12px] border bg-white text-[14px] font-bold disabled:cursor-not-allowed disabled:opacity-60"
                                    type="button"
                                    disabled={allLoadingMore}
                                    onClick={() => void loadMoreAllPolicies()}
                                >
                                    {allLoadingMore
                                        ? "불러오는 중..."
                                        : "지원금 더 보기"}
                                </button>
                            )}
                        </div>
                    ) : query.trim().length > 0 ? (
                        <SearchEmptyState />
                    ) : activeTab === "recommended" ? (
                        <EmptyRecommendation
                            onEditProfile={() => navigate("/mypage/edit")}
                        />
                    ) : activeTab === "favorites" ? (
                        <FavoriteEmptyState />
                    ) : (
                        <SimpleEmptyState
                            title="표시할 지원금이 없어요"
                            description="중복 허용 설정이나 검색 조건을 확인해보세요"
                        />
                    )}
                </section>
            </main>

            <RecommendationSortSheet
                open={sortSheetOpen}
                activeTab={activeTab}
                sortOption={sortOption}
                onClose={() => setSortSheetOpen(false)}
                onSelect={(option) => {
                    setSortOption(option);
                    setSortSheetOpen(false);
                }}
            />
            <Toast
                message={toastMessage}
                onDismiss={() => setToastMessage(null)}
            />
        </>
    );
};

export default Recommendation;
