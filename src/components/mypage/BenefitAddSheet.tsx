import { searchSubsidiesApi } from "@/api/subsidyApi";
import { InlineLoadState } from "@/components/common/form/FormControls";
import { CheckIcon } from "@/components/mypage/MyPageUI";
import { useSubsidyCategories } from "@/hooks/useSubsidyCategories";
import type { ReceivedBenefit, SubsidyCategory } from "@/types/onboarding";
import { useEffect, useMemo, useState } from "react";

export const BenefitAddSheet = ({
    open,
    receivedBenefits,
    onClose,
    onSave,
}: {
    open: boolean;
    receivedBenefits: ReceivedBenefit[];
    onClose: () => void;
    onSave: (benefits: ReceivedBenefit[]) => void;
}) => {
    const [query, setQuery] = useState("");
    const [selectedCategory, setSelectedCategory] =
        useState<SubsidyCategory | null>(null);
    const [selectedBenefits, setSelectedBenefits] = useState<ReceivedBenefit[]>(
        []
    );
    const [searchResults, setSearchResults] = useState<ReceivedBenefit[]>([]);
    const [searching, setSearching] = useState(false);
    const [searchError, setSearchError] = useState(false);
    const {
        categories,
        status: categoryStatus,
        retry: retryCategories,
    } = useSubsidyCategories(open);
    const availableCategory = categories.some(
        ({ code }) => code === selectedCategory
    )
        ? selectedCategory
        : null;

    useEffect(() => {
        if (!open) return;

        let active = true;
        const timer = window.setTimeout(() => {
            const searchBenefits = async () => {
                setSearching(true);
                setSearchError(false);

                try {
                    const response = await searchSubsidiesApi({
                        keyword: query.trim() || undefined,
                        category: availableCategory ?? undefined,
                        includeClosed: true,
                        page: 0,
                        size: 50,
                    });

                    if (!response.isSuccess) {
                        throw new Error(response.message);
                    }

                    if (!active) return;

                    setSearchResults(
                        response.result.content.map((benefit) => ({
                            id: benefit.subsidyId,
                            title: benefit.name,
                            organization: benefit.agency ?? "기관 정보 없음",
                            categories: benefit.category
                                ? [benefit.category]
                                : [],
                        }))
                    );
                } catch (error) {
                    console.error(error);
                    if (active) setSearchError(true);
                } finally {
                    if (active) setSearching(false);
                }
            };

            void searchBenefits();
        }, 300);

        return () => {
            active = false;
            window.clearTimeout(timer);
        };
    }, [availableCategory, open, query]);

    const visibleBenefits = useMemo(() => {
        const receivedIds = new Set(receivedBenefits.map(({ id }) => id));

        return searchResults.filter((benefit) => !receivedIds.has(benefit.id));
    }, [receivedBenefits, searchResults]);

    if (!open) return null;

    const handleSave = () => {
        onSave([...receivedBenefits, ...selectedBenefits]);
        setSelectedBenefits([]);
    };

    return (
        <div
            className="fixed inset-0 z-50 flex items-end justify-center bg-black/25"
            role="presentation"
            onClick={onClose}
        >
            <section
                className="max-h-[82svh] w-full max-w-[390px] overflow-y-auto rounded-t-[28px] bg-white px-6 pt-4 pb-8"
                role="dialog"
                aria-modal="true"
                aria-labelledby="benefit-sheet-title"
                onClick={(event) => event.stopPropagation()}
            >
                <div className="bg-disabled mx-auto h-1 w-[44px] rounded-full" />
                <h2
                    className="mt-5 text-[18px] font-bold"
                    id="benefit-sheet-title"
                >
                    기존 수령중인 지원금 추가
                </h2>

                <div className="relative mt-5">
                    <SearchIcon />
                    <input
                        className="border-line-strong placeholder:text-text-subtle focus:border-primary h-[50px] w-full rounded-[10px] border pr-4 pl-11 text-[13px] outline-none"
                        value={query}
                        placeholder="지원금명 또는 기관명으로 검색해보세요"
                        onChange={(event) => setQuery(event.target.value)}
                    />
                </div>

                <div className="mt-4 flex flex-wrap gap-1.5">
                    {[
                        { label: "전체", value: null },
                        ...categories.map(({ code, label }) => ({
                            label,
                            value: code,
                        })),
                    ].map(({ label, value }) => (
                        <button
                            className={`shrink-0 cursor-pointer rounded-full px-2.5 py-1.5 text-[12px] font-bold ${availableCategory === value ? "bg-third text-white" : "bg-line text-text-body"}`}
                            type="button"
                            key={value ?? "all"}
                            aria-pressed={availableCategory === value}
                            onClick={() => setSelectedCategory(value)}
                        >
                            {label}
                        </button>
                    ))}
                </div>
                {categoryStatus === "loading" && categories.length === 0 && (
                    <p className="text-text-subtle mt-2 text-[12px] font-semibold">
                        카테고리를 불러오는 중이에요
                    </p>
                )}
                {categoryStatus === "error" && (
                    <InlineLoadState
                        message="카테고리를 불러오지 못했어요"
                        onRetry={retryCategories}
                    />
                )}
                {categoryStatus === "ready" && categories.length === 0 && (
                    <InlineLoadState
                        message="표시할 카테고리가 없어요"
                        onRetry={retryCategories}
                    />
                )}

                <div className="mt-8 flex flex-col gap-3">
                    {searching && (
                        <p className="text-text-subtle py-8 text-center text-[13px]">
                            지원금을 검색하는 중이에요
                        </p>
                    )}
                    {searchError && (
                        <p className="text-danger py-8 text-center text-[13px] font-semibold">
                            지원금을 불러오지 못했어요
                        </p>
                    )}
                    {!searching &&
                        !searchError &&
                        visibleBenefits.map((benefit) => {
                            const selected = selectedBenefits.some(
                                ({ id }) => id === benefit.id
                            );
                            return (
                                <button
                                    className={`flex min-h-[74px] cursor-pointer items-center gap-4 rounded-[10px] border px-5 text-left ${selected ? "border-primary bg-selection-light" : "border-line-strong bg-white"}`}
                                    type="button"
                                    key={benefit.id}
                                    onClick={() =>
                                        setSelectedBenefits((previous) =>
                                            selected
                                                ? previous.filter(
                                                      ({ id }) =>
                                                          id !== benefit.id
                                                  )
                                                : [...previous, benefit]
                                        )
                                    }
                                >
                                    <span
                                        className={`flex size-8 shrink-0 items-center justify-center rounded-full border ${selected ? "border-primary bg-primary text-white" : "border-line-strong"}`}
                                    >
                                        {selected && <CheckIcon />}
                                    </span>
                                    <span>
                                        <strong className="block text-[14px]">
                                            {benefit.title}
                                        </strong>
                                        <span className="text-text-subtle mt-1 block text-[12px] font-semibold">
                                            {benefit.organization}
                                        </span>
                                    </span>
                                </button>
                            );
                        })}
                    {!searching &&
                        !searchError &&
                        visibleBenefits.length === 0 && (
                            <p className="text-text-subtle py-8 text-center text-[13px]">
                                추가할 수 있는 지원금이 없어요
                            </p>
                        )}
                </div>

                <button
                    className="bg-primary disabled:bg-disabled mt-6 h-[48px] w-full cursor-pointer rounded-[14px] text-[16px] font-bold text-white disabled:cursor-not-allowed"
                    type="button"
                    disabled={selectedBenefits.length === 0}
                    onClick={handleSave}
                >
                    {selectedBenefits.length > 0
                        ? `${selectedBenefits.length}개 추가하기`
                        : "추가할 지원금을 선택해주세요"}
                </button>
            </section>
        </div>
    );
};

const SearchIcon = () => (
    <svg
        className="absolute top-1/2 left-4 size-[18px] -translate-y-1/2"
        viewBox="0 0 20 20"
        fill="none"
        aria-hidden="true"
    >
        <circle
            cx="8.5"
            cy="8.5"
            r="5.5"
            stroke="currentColor"
            strokeWidth="1.5"
        />
        <path
            d="m13 13 4 4"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
        />
    </svg>
);
