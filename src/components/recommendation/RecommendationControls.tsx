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
            <header className="px-5">
                {cameFromMyPage && <BackButton label="마이페이지로 돌아가기" />}
                <div className="flex items-center justify-between px-0">
                    <h1 className="text-[24px] leading-none font-bold">
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
                    <div className="relative mt-4">
                        <SearchIcon className="absolute top-1/2 left-4 size-[18px] -translate-y-1/2" />
                        <input
                            ref={searchInputRef}
                            className="focus:border-primary focus-visible:outline-primary h-[49px] w-full rounded-[10px] border border-[#b7b7b7] bg-white pr-4 pl-11 text-[13px] outline-none placeholder:text-[#8e98a8] focus-visible:outline-2 focus-visible:outline-offset-1"
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
                    <div className="mt-[14px] flex items-center gap-[9px] px-1.5">
                        {recommendationSearchKeywords.map((keyword) => (
                            <button
                                className="bg-third h-[37px] cursor-pointer rounded-full px-[13px] text-[16px] font-bold text-white"
                                type="button"
                                key={keyword}
                                onClick={() => onQueryChange(keyword)}
                            >
                                {keyword}
                            </button>
                        ))}
                    </div>
                ) : (
                    <div className="mt-5 grid grid-cols-3 gap-4">
                        {recommendationTabs.map(({ key, label }) => {
                            const selected = activeTab === key;
                            return (
                                <button
                                    className={`h-[39px] cursor-pointer rounded-[10px] text-[16px] font-bold transition-colors ${selected ? "bg-third text-white" : "bg-disabled text-text-muted"}`}
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
                    <div className="mt-[21px] flex items-center justify-between">
                        <button
                            className="flex cursor-pointer items-center gap-1 text-[16px] font-bold"
                            type="button"
                            aria-haspopup="dialog"
                            onClick={onOpenSort}
                        >
                            {sortLabel}
                            <ChevronDownIcon />
                        </button>

                        <label className="flex cursor-pointer items-center gap-2 text-[16px] font-semibold">
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

            {!searchOpen && <div className="bg-line mt-[19px] h-px w-full" />}
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
            className="fixed inset-0 z-50 flex items-end justify-center bg-black/35"
            role="presentation"
            onClick={(event) => {
                if (event.target === event.currentTarget) onClose();
            }}
        >
            <section
                ref={dialogRef}
                tabIndex={-1}
                className="w-full max-w-[390px] rounded-t-[28px] bg-white px-[21px] pt-[21px] pb-8"
                role="dialog"
                aria-modal="true"
                aria-label="정렬 방식 선택"
            >
                <div className="bg-disabled mx-auto mb-4 h-1 w-[39px] rounded-full" />
                <ul>
                    {recommendationSortOptions.map(({ key, label }) => (
                        <li className="border-line border-b" key={key}>
                            <button
                                className="flex h-[46px] w-full cursor-pointer items-center justify-between text-[16px] font-bold"
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
