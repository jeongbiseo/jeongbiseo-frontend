export type RecommendationTab = "recommended" | "favorites" | "all";
export type SortOption = "recommended" | "deadline" | "title";

export const recommendationTabs: Array<{
    key: RecommendationTab;
    label: string;
}> = [
    { key: "recommended", label: "AI추천" },
    { key: "favorites", label: "즐겨찾기" },
    { key: "all", label: "전체" },
];

export const recommendationSearchKeywords = ["청년", "월세", "창업"];

export const recommendationSortOptions: Array<{
    key: SortOption;
    label: string;
}> = [
    { key: "recommended", label: "추천순" },
    { key: "deadline", label: "마감일순" },
    { key: "title", label: "가나다순" },
];

export const getRecommendationSortLabel = (
    sort: SortOption,
    tab: RecommendationTab
) => {
    if (sort === "recommended" && tab !== "recommended") return "기본순";
    return (
        recommendationSortOptions.find(({ key }) => key === sort)?.label ??
        "추천순"
    );
};
