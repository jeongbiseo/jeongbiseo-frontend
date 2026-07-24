import ChevronDownIcon from "@/components/common/ChevronDownIcon";
import { BackButton } from "@/components/mypage/MyPageUI";
import {
    CheckIcon,
    CloseIcon,
    SearchIcon,
} from "@/components/recommendation/RecommendationIcons";
import {
    getRecommendationSortLabel,
    recommendationSearchKeywords,
    recommendationSortOptions,
    recommendationTabs,
    type RecommendationTab,
    type SortOption,
} from "@/constants/recommendationControls";
import { useDialogAccessibility } from "@/hooks/useDialogAccessibility";
import { useEffect, useRef } from "react";

type RecommendationControlsProps = {
    cameFromMyPage: boolean;
    searchOpen: boolean;
    query: string;
    activeTab: RecommendationTab;
    sortLabel: string;
    allowDuplicates: boolean;
    duplicatesDisabled: boolean;
    onToggleSearch: () => void;
    onQueryChange: (query: string) => void;
    onTabChange: (tab: RecommendationTab) => void;
    onOpenSort: () => void;
    onAllowDuplicatesChange: (allow: boolean) => void;
};

export const RecommendationControls = ({
    cameFromMyPage,
    searchOpen,
    query,
    activeTab,
    sortLabel,
    allowDuplicates,
    duplicatesDisabled,
    onToggleSearch,
    onQueryChange,
    onTabChange,
    onOpenSort,
    onAllowDuplicatesChange,
}: RecommendationControlsProps) => {
    const searchInputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        if (searchOpen) searchInputRef.current?.focus();
    }, [searchOpen]);

    return (
        <>
            <header className="px-page-inline">
                {cameFromMyPage && <BackButton label="마이페이지로 돌아가기" />}
                <div className="flex items-center justify-between px-0">
                    <h1 className="text-heading-page">
                        {searchOpen ? "검색" : "지원금 전체보기"}
                    </h1>
                    <button
                        className="focus-visible:outline-primary flex size-[34px] cursor-pointer items-center justify-center rounded-full focus-visible:outline-2"
                        type="button"
                        aria-label={searchOpen ? "검색창 닫기" : "지원금 검색"}
                        onClick={onToggleSearch}
                    >
                        {searchOpen ? <CloseIcon /> : <SearchIcon />}
                    </button>
                </div>

                {searchOpen && (
                    <div className="recommendation-search-enter relative mt-4">
                        <SearchIcon className="size-icon-sm absolute top-1/2 left-4 -translate-y-1/2" />
                        <input
                            ref={searchInputRef}
                            className="focus:border-primary focus-visible:outline-primary text-label-strong rounded-control h-[49px] w-full border border-[#b7b7b7] bg-white pr-4 pl-11 outline-none placeholder:text-[#8e98a8] focus-visible:outline-2 focus-visible:outline-offset-1"
                            aria-label="지원금 검색"
                            value={query}
                            placeholder="지원금명 또는 기관명으로 검색해보세요"
                            onChange={(event) =>
                                onQueryChange(event.target.value)
                            }
                        />
                    </div>
                )}

                {searchOpen ? (
                    <div className="recommendation-search-enter mt-layout-related gap-layout-inline flex items-center px-px">
                        {recommendationSearchKeywords.map((keyword) => (
                            <button
                                className="bg-third text-body-sm-strong rounded-badge h-[37px] cursor-pointer px-3 text-white"
                                type="button"
                                key={keyword}
                                onClick={() => onQueryChange(keyword)}
                            >
                                {keyword}
                            </button>
                        ))}
                    </div>
                ) : (
                    <div className="gap-layout-inline mt-4 grid grid-cols-3">
                        {recommendationTabs.map(({ key, label }) => {
                            const selected = activeTab === key;
                            return (
                                <button
                                    className={`text-body-sm-strong rounded-control h-[39px] cursor-pointer transition-colors ${selected ? "bg-third text-white" : "bg-disabled text-text-muted"}`}
                                    type="button"
                                    key={key}
                                    aria-pressed={selected}
                                    onClick={() => onTabChange(key)}
                                >
                                    {label}
                                </button>
                            );
                        })}
                    </div>
                )}

                {!searchOpen && (
                    <div className="mt-4 flex items-center justify-between">
                        <button
                            className="text-body-sm-strong flex cursor-pointer items-center gap-1"
                            type="button"
                            aria-haspopup="dialog"
                            onClick={onOpenSort}
                        >
                            {sortLabel}
                            <ChevronDownIcon />
                        </button>

                        <label className="text-body-sm-strong flex cursor-pointer items-center gap-2">
                            중복허용
                            <input
                                className="peer sr-only"
                                type="checkbox"
                                checked={allowDuplicates}
                                disabled={duplicatesDisabled}
                                onChange={(event) =>
                                    onAllowDuplicatesChange(
                                        event.target.checked
                                    )
                                }
                            />
                            <span className="bg-disabled peer-checked:bg-primary peer-focus-visible:outline-primary relative h-5 w-[34px] rounded-full transition-colors peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 after:absolute after:top-[2px] after:left-[2px] after:size-4 after:rounded-full after:bg-white after:transition-transform peer-checked:after:translate-x-[14px]" />
                        </label>
                    </div>
                )}
            </header>

            {!searchOpen && <div className="bg-line mt-4 h-px w-full" />}
        </>
    );
};

export const RecommendationSortSheet = ({
    open,
    activeTab,
    sortOption,
    onClose,
    onSelect,
}: {
    open: boolean;
    activeTab: RecommendationTab;
    sortOption: SortOption;
    onClose: () => void;
    onSelect: (sort: SortOption) => void;
}) => {
    const dialogRef = useDialogAccessibility<HTMLElement>(open, onClose);

    if (!open) return null;

    return (
        <div
            className="recommendation-sort-backdrop-enter fixed inset-0 z-50 flex items-end justify-center bg-[#bababa]/60"
            role="presentation"
            onClick={(event) => {
                if (event.target === event.currentTarget) onClose();
            }}
        >
            <section
                ref={dialogRef}
                tabIndex={-1}
                className="recommendation-sort-sheet-enter rounded-t-sheet px-page-inline w-full max-w-[390px] bg-white pt-4 pb-6"
                role="dialog"
                aria-modal="true"
                aria-label="정렬 방식 선택"
            >
                <div className="bg-disabled mb-layout-component mx-auto h-1 w-[39px] rounded-full" />
                <ul>
                    {recommendationSortOptions.map(({ key, label }) => (
                        <li className="border-line border-b" key={key}>
                            <button
                                className="text-body-sm-strong flex h-[46px] w-full cursor-pointer items-center justify-between"
                                type="button"
                                aria-pressed={sortOption === key}
                                onClick={() => onSelect(key)}
                            >
                                {key === "recommended"
                                    ? getRecommendationSortLabel(key, activeTab)
                                    : label}
                                {sortOption === key && <CheckIcon />}
                            </button>
                        </li>
                    ))}
                </ul>
            </section>
        </div>
    );
};
