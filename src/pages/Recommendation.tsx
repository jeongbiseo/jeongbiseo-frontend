import { BackButton } from "@/components/mypage/MyPageUI";
import ChevronDownIcon from "@/components/common/ChevronDownIcon";
import {
    getFavoritePolicyIds,
    saveFavoritePolicyIds,
} from "@/constants/mypageData";
import {
    initialRecommendationPolicies,
    isUrgentRecommendationPolicy,
    type RecommendationPolicy,
} from "@/constants/recommendationData";
import { useEffect, useMemo, useState } from "react";
import {
    Link,
    useLocation,
    useNavigate,
    useSearchParams,
} from "react-router-dom";

type RecommendationTab = "recommended" | "favorites" | "all";
type SortOption = "recommended" | "amount" | "deadline" | "title";

const tabs: Array<{ key: RecommendationTab; label: string }> = [
    { key: "recommended", label: "AI추천" },
    { key: "favorites", label: "즐겨찾기" },
    { key: "all", label: "전체" },
];

const searchKeywords = ["청년", "월세", "창업"];

const sortOptions: Array<{ key: SortOption; label: string }> = [
    { key: "recommended", label: "추천순" },
    { key: "amount", label: "지원금액순" },
    { key: "deadline", label: "마감일순" },
    { key: "title", label: "가나다순" },
];

const getInitialTab = (value: string | null): RecommendationTab =>
    value === "favorites" || value === "all" ? value : "recommended";

const getInitialSort = (value: string | null): SortOption =>
    value === "amount" || value === "deadline" || value === "title"
        ? value
        : "recommended";

const Recommendation = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const [searchParams] = useSearchParams();
    const [policies, setPolicies] = useState(() => {
        const favoriteIds = getFavoritePolicyIds();
        return initialRecommendationPolicies.map((policy) => ({
            ...policy,
            isFavorite: favoriteIds.includes(policy.id),
        }));
    });
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
    const urgentOnly = searchParams.get("filter") === "urgent";
    const cameFromMyPage =
        (location.state as { from?: string } | null)?.from === "mypage";

    const sortLabel = sortOptions.find(({ key }) => key === sortOption)?.label;

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

        return [...filteredPolicies].sort((first, second) => {
            if (sortOption === "amount") {
                return (second.amount ?? -1) - (first.amount ?? -1);
            }
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

    const toggleFavorite = (id: number) => {
        setPolicies((previous) => {
            const nextPolicies = previous.map((policy) =>
                policy.id === id
                    ? { ...policy, isFavorite: !policy.isFavorite }
                    : policy
            );
            saveFavoritePolicyIds(
                nextPolicies
                    .filter(({ isFavorite }) => isFavorite)
                    .map(({ id: policyId }) => policyId)
            );
            return nextPolicies;
        });
    };

    useEffect(() => {
        if (!sortSheetOpen) return;

        const handleEscape = (event: KeyboardEvent) => {
            if (event.key === "Escape") setSortSheetOpen(false);
        };

        document.addEventListener("keydown", handleEscape);
        return () => document.removeEventListener("keydown", handleEscape);
    }, [sortSheetOpen]);

    return (
        <>
            <main className="bg-surface-dim flex min-h-svh justify-center">
                <section className="bg-ground text-text-strong min-h-svh w-full max-w-[390px] pt-[72px] pb-[130px]">
                    <header className="px-5">
                        {cameFromMyPage && (
                            <BackButton label="마이페이지로 돌아가기" />
                        )}
                        <div className="flex items-center justify-between px-0">
                            <h1 className="text-[24px] leading-none font-bold">
                                {searchOpen ? "검색" : "지원금 전체보기"}
                            </h1>
                            <button
                                className="focus-visible:outline-primary flex size-[34px] cursor-pointer items-center justify-center rounded-full focus-visible:outline-2"
                                type="button"
                                aria-label={
                                    searchOpen ? "검색창 닫기" : "지원금 검색"
                                }
                                onClick={() => {
                                    setSearchOpen((previous) => !previous);
                                    if (searchOpen) {
                                        setQuery("");
                                    } else {
                                        setActiveTab("all");
                                    }
                                }}
                            >
                                {searchOpen ? <CloseIcon /> : <SearchIcon />}
                            </button>
                        </div>

                        {searchOpen && (
                            <div className="relative mt-4">
                                <SearchIcon className="absolute top-1/2 left-4 size-[18px] -translate-y-1/2" />
                                <input
                                    className="focus:border-primary h-[49px] w-full rounded-[10px] border border-[#b7b7b7] bg-white pr-4 pl-11 text-[13px] outline-none placeholder:text-[#8e98a8]"
                                    value={query}
                                    autoFocus
                                    placeholder="지원금명 또는 기관명으로 검색해보세요"
                                    onChange={(event) =>
                                        setQuery(event.target.value)
                                    }
                                />
                            </div>
                        )}

                        {searchOpen ? (
                            <div className="mt-[14px] flex items-center gap-[9px] px-1.5">
                                {searchKeywords.map((keyword) => (
                                    <button
                                        className="bg-third h-[37px] cursor-pointer rounded-full px-[13px] text-[16px] font-bold text-white"
                                        type="button"
                                        key={keyword}
                                        onClick={() => setQuery(keyword)}
                                    >
                                        {keyword}
                                    </button>
                                ))}
                            </div>
                        ) : (
                            <div className="mt-5 grid grid-cols-3 gap-4">
                                {tabs.map(({ key, label }) => {
                                    const selected = activeTab === key;
                                    return (
                                        <button
                                            className={`h-[39px] cursor-pointer rounded-[10px] text-[16px] font-bold transition-colors ${selected ? "bg-third text-white" : "bg-disabled text-text-muted"}`}
                                            type="button"
                                            key={key}
                                            aria-pressed={selected}
                                            onClick={() => setActiveTab(key)}
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
                                    onClick={() => setSortSheetOpen(true)}
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
                                        onChange={(event) =>
                                            setAllowDuplicates(
                                                event.target.checked
                                            )
                                        }
                                    />
                                    <span className="bg-disabled peer-checked:bg-primary relative h-5 w-[34px] rounded-full transition-colors after:absolute after:top-[2px] after:left-[2px] after:size-4 after:rounded-full after:bg-white after:transition-transform peer-checked:after:translate-x-[14px]" />
                                </label>
                            </div>
                        )}
                    </header>

                    {!searchOpen && (
                        <div className="bg-line mt-[19px] h-px w-full" />
                    )}

                    {visiblePolicies.length > 0 ? (
                        <div className="mx-auto mt-7 flex w-full max-w-[312px] flex-col gap-4">
                            {visiblePolicies.map((policy) => (
                                <PolicyCard
                                    key={policy.id}
                                    policy={policy}
                                    onFavoriteToggle={toggleFavorite}
                                />
                            ))}
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

            {sortSheetOpen && (
                <div
                    className="fixed inset-0 z-50 flex items-end justify-center bg-black/35"
                    role="presentation"
                    onClick={() => setSortSheetOpen(false)}
                >
                    <section
                        className="w-full max-w-[390px] rounded-t-[28px] bg-white px-[21px] pt-[21px] pb-8"
                        role="dialog"
                        aria-modal="true"
                        aria-label="정렬 방식 선택"
                        onClick={(event) => event.stopPropagation()}
                    >
                        <div className="bg-disabled mx-auto mb-4 h-1 w-[39px] rounded-full" />
                        <ul>
                            {sortOptions.map(({ key, label }) => (
                                <li className="border-line border-b" key={key}>
                                    <button
                                        className="flex h-[46px] w-full cursor-pointer items-center justify-between text-[16px] font-bold"
                                        type="button"
                                        onClick={() => {
                                            setSortOption(key);
                                            setSortSheetOpen(false);
                                        }}
                                    >
                                        {label}
                                        {sortOption === key && <CheckIcon />}
                                    </button>
                                </li>
                            ))}
                        </ul>
                    </section>
                </div>
            )}
        </>
    );
};

const PolicyCard = ({
    policy,
    onFavoriteToggle,
}: {
    policy: RecommendationPolicy;
    onFavoriteToggle: (id: number) => void;
}) => {
    const urgent = policy.deadlineDays !== null && policy.deadlineDays <= 7;
    const scheduled = policy.deadlineDays !== null;

    return (
        <article className="border-primary relative min-h-[107px] rounded-[20px] border bg-white px-[21px] py-[15px]">
            <Link
                className="block pr-[82px]"
                to={`/policies/${policy.id}`}
                state={{ bottomNavPath: "/recommend" }}
            >
                <p className="text-[13px] leading-none font-bold text-[#8e98a8]">
                    {policy.organization}
                </p>
                <h2 className="mt-[6px] text-[16px] leading-tight font-bold">
                    {policy.title}
                </h2>
                <p className="text-green-dark mt-[15px] text-[16px] leading-none font-bold">
                    {policy.amountLabel ?? "산정 불가"}
                </p>
            </Link>

            <button
                className="focus-visible:outline-primary absolute top-[12px] right-[21px] flex size-8 cursor-pointer items-center justify-center focus-visible:rounded focus-visible:outline-2"
                type="button"
                aria-label={
                    policy.isFavorite ? "즐겨찾기 해제" : "즐겨찾기 추가"
                }
                aria-pressed={policy.isFavorite}
                onClick={() => onFavoriteToggle(policy.id)}
            >
                <StarIcon filled={policy.isFavorite} />
            </button>

            <span
                className={`absolute right-[21px] bottom-[14px] rounded-[13px] px-[9px] py-[6px] text-[13px] leading-none font-bold ${urgent ? "bg-danger-light text-danger" : scheduled ? "bg-green-light text-green-dark" : "bg-disabled text-text-muted"}`}
            >
                {policy.deadlineLabel}
            </span>
        </article>
    );
};

const EmptyRecommendation = ({
    onEditProfile,
}: {
    onEditProfile: () => void;
}) => (
    <div className="mx-auto mt-6 w-full max-w-[330px] px-[14px]">
        <h2 className="text-[20px] font-bold">추천 지원금 0건</h2>
        <p className="text-text-muted mt-2 text-[13px] font-bold">
            현재 입력하신 조건에 맞는 지원금을 찾지 못했어요
        </p>

        <div className="border-primary mt-7 rounded-[20px] border px-[21px] py-6">
            <h3 className="text-[20px] font-bold">이런 이유일 수 있어요</h3>
            <ol className="text-text-muted mt-4 list-decimal space-y-[15px] pl-5 text-[13px] leading-[1.45] font-bold">
                <li>
                    거주지·고용상태·연령 조건이 지원 자격과 맞지 않을 수 있어요.
                </li>
                <li>
                    소득구간 또는 가구원 수가 기준을 초과하거나 미달할 수
                    있어요.
                </li>
                <li>
                    이미 수령 중인 지원금으로 표시된 항목이 제외되었을 수
                    있어요.
                </li>
            </ol>
        </div>

        <button
            className="bg-primary mt-6 h-[55px] w-full cursor-pointer rounded-[15px] text-[20px] font-bold text-white shadow-[3px_11px_8px_var(--color-green-light-active)] active:scale-[0.99]"
            type="button"
            onClick={onEditProfile}
        >
            정보 수정하고 다시 추천받기
        </button>
    </div>
);

const SimpleEmptyState = ({
    title,
    description,
}: {
    title: string;
    description: string;
}) => (
    <div className="mx-auto mt-14 w-full max-w-[330px] px-[14px] text-center">
        <h2 className="text-[20px] font-bold">{title}</h2>
        <p className="text-text-muted mt-2 text-[13px] font-bold">
            {description}
        </p>
    </div>
);

const SearchEmptyState = () => (
    <div
        className="mx-auto mt-[177px] flex w-full max-w-[341px] flex-col items-center gap-[34px] text-center"
        role="status"
    >
        <div className="bg-disabled flex size-[118px] items-center justify-center rounded-full text-white">
            <SearchIcon className="size-[46px]" />
        </div>

        <div className="flex w-full max-w-[313px] flex-col items-center gap-[15px]">
            <h2 className="text-[20px] leading-none font-bold">
                검색 내역이 없어요
            </h2>
            <p className="text-text-muted text-[16px] leading-normal font-semibold">
                단어의 철자나 띄어쓰기가 맞는지
                <br />
                다시 확인해 주세요
            </p>
        </div>
    </div>
);

const FavoriteEmptyState = () => (
    <div
        className="mx-auto mt-[169px] flex w-full max-w-[313px] flex-col items-center text-center"
        role="status"
    >
        <FavoriteStarIcon />
        <div className="mt-[45px] flex w-full flex-col gap-[15px]">
            <h2 className="text-[24px] leading-none font-bold">
                아직 즐겨찾기한 지원금이 없어요
            </h2>
            <p className="text-text-muted text-[20px] leading-normal font-semibold">
                마음에 드는 지원금을 담아보세요
            </p>
        </div>
    </div>
);

const SearchIcon = ({ className = "size-[25px]" }: { className?: string }) => (
    <svg
        className={className}
        viewBox="0 0 25 25"
        fill="none"
        aria-hidden="true"
    >
        <circle
            cx="10.5"
            cy="10.5"
            r="8"
            stroke="currentColor"
            strokeWidth="2"
        />
        <path
            d="m16.5 16.5 6 6"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
        />
    </svg>
);

const CloseIcon = () => (
    <svg className="size-5" viewBox="0 0 20 20" fill="none" aria-hidden="true">
        <path
            d="m3 3 14 14M17 3 3 17"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
        />
    </svg>
);

const StarIcon = ({ filled }: { filled: boolean }) => (
    <svg className="size-6" viewBox="0 0 24 24" aria-hidden="true">
        <path
            d="m12 1.8 3.1 6.3 7 .9-5.1 4.9 1.3 6.9-6.3-3.3-6.3 3.3 1.3-6.9L1.9 9l7-.9L12 1.8Z"
            fill={filled ? "var(--color-secondary)" : "var(--color-disabled)"}
        />
    </svg>
);

const FavoriteStarIcon = () => (
    <svg
        className="h-[63px] w-[66px]"
        viewBox="0 0 66 63"
        fill="none"
        aria-hidden="true"
    >
        <path
            d="M33.0016 53.9069L16.4462 62.5937C15.8609 62.9008 15.2013 63.0383 14.5419 62.9908C13.8824 62.9433 13.2495 62.7125 12.7145 62.3247C12.1796 61.9368 11.7641 61.4074 11.5149 60.7961C11.2657 60.1848 11.1928 59.5162 11.3045 58.8657L14.4653 40.4664L1.0707 27.4326C0.5969 26.9718 0.2617 26.3878 0.1032 25.7467C-0.0553 25.1056 -0.0308 24.433 0.1738 23.8051C0.3785 23.1771 0.7552 22.6189 1.2613 22.1936C1.7673 21.7683 2.3826 21.4929 3.0374 21.3986L21.5453 18.714L29.823 1.9735C30.1155 1.3812 30.5682 0.8824 31.1299 0.5336C31.6917 0.1849 32.34 0 33.0016 0C33.6631 0 34.3115 0.1849 34.8732 0.5336C35.435 0.8824 35.8877 1.3812 36.1801 1.9735L44.4579 18.714L62.9658 21.4021C63.6198 21.4969 64.2343 21.7724 64.7397 22.1975C65.2451 22.6226 65.6214 23.1803 65.826 23.8076C66.0306 24.4349 66.0553 25.1068 65.8974 25.7474C65.7395 26.3879 65.4053 26.9717 64.9324 27.4326L51.5343 40.4664L54.6952 58.8657C54.8063 59.5157 54.7333 60.1837 54.4842 60.7945C54.2352 61.4052 53.82 61.9343 53.2857 62.322C52.7513 62.7097 52.119 62.9406 51.4602 62.9886C50.8013 63.0366 50.1421 62.8998 49.557 62.5937L33.0016 53.9069Z"
            fill="var(--color-disabled)"
        />
    </svg>
);

const CheckIcon = () => (
    <svg className="size-5" viewBox="0 0 20 20" fill="none" aria-hidden="true">
        <path
            d="m3 10 4 4 10-10"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
        />
    </svg>
);

export default Recommendation;
