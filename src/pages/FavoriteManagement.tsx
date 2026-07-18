import {
    BackButton,
    MyPageLayout,
    StarIcon,
} from "@/components/mypage/MyPageUI";
import { initialRecommendationPolicies } from "@/constants/recommendationData";
import {
    getFavoritePolicyIds,
    saveFavoritePolicyIds,
} from "@/constants/mypageData";
import { useMemo, useState } from "react";

type SortOption = "deadline" | "amount" | "title";

const FavoriteManagement = () => {
    const [favoriteIds, setFavoriteIds] = useState(getFavoritePolicyIds);
    const [sortOption, setSortOption] = useState<SortOption>("deadline");
    const [allowDuplicates, setAllowDuplicates] = useState(true);

    const favoritePolicies = useMemo(() => {
        const policies = initialRecommendationPolicies.filter(
            (policy) =>
                favoriteIds.includes(policy.id) &&
                (allowDuplicates || !policy.isReceived)
        );

        return policies.sort((first, second) => {
            if (sortOption === "amount") {
                return (second.amount ?? -1) - (first.amount ?? -1);
            }
            if (sortOption === "title") {
                return first.title.localeCompare(second.title, "ko");
            }
            return (
                (first.deadlineDays ?? Number.MAX_SAFE_INTEGER) -
                (second.deadlineDays ?? Number.MAX_SAFE_INTEGER)
            );
        });
    }, [allowDuplicates, favoriteIds, sortOption]);

    const removeFavorite = (id: number) => {
        const nextIds = favoriteIds.filter((favoriteId) => favoriteId !== id);
        setFavoriteIds(nextIds);
        saveFavoritePolicyIds(nextIds);
    };

    return (
        <MyPageLayout className="px-0 pt-[56px]">
            <header className="px-[0px]">
                <BackButton />
                <h1 className="mt-0 text-[24px] font-bold">즐겨찾기 관리</h1>
                <div className="mt-4 flex items-center justify-between">
                    <select
                        className="cursor-pointer bg-transparent text-[16px] font-bold outline-none"
                        value={sortOption}
                        aria-label="즐겨찾기 정렬 방식"
                        onChange={(event) =>
                            setSortOption(event.target.value as SortOption)
                        }
                    >
                        <option value="deadline">마감일순</option>
                        <option value="amount">지원금액순</option>
                        <option value="title">가나다순</option>
                    </select>

                    <label className="flex cursor-pointer items-center gap-2 text-[16px] font-semibold">
                        중복허용
                        <input
                            className="peer sr-only"
                            type="checkbox"
                            checked={allowDuplicates}
                            onChange={(event) =>
                                setAllowDuplicates(event.target.checked)
                            }
                        />
                        <span className="bg-disabled peer-checked:bg-primary relative h-5 w-[34px] rounded-full transition-colors after:absolute after:top-[2px] after:left-[2px] after:size-4 after:rounded-full after:bg-white after:transition-transform peer-checked:after:translate-x-[14px]" />
                    </label>
                </div>
            </header>

            <div className="bg-line mt-4 h-px" />

            {favoritePolicies.length > 0 ? (
                <div className="mt-6 flex flex-col gap-4 px-[15px]">
                    {favoritePolicies.map((policy) => (
                        <article
                            className="border-primary relative min-h-[74px] rounded-[20px] border bg-white px-4 py-[14px]"
                            key={policy.id}
                        >
                            <h2 className="pr-[90px] text-[16px] font-bold">
                                {policy.title}
                            </h2>
                            <p className="text-text-subtle mt-1 text-[13px] font-bold">
                                {policy.organization} · {policy.deadlineLabel}
                            </p>
                            <button
                                className="focus-visible:outline-primary absolute top-[12px] right-4 flex size-8 cursor-pointer items-center justify-center rounded focus-visible:outline-2"
                                type="button"
                                aria-label={`${policy.title} 즐겨찾기 해제`}
                                onClick={() => removeFavorite(policy.id)}
                            >
                                <StarIcon />
                            </button>
                            <strong className="absolute right-4 bottom-[14px] text-[13px]">
                                {policy.amountLabel ?? "산정불가"}
                            </strong>
                        </article>
                    ))}
                </div>
            ) : (
                <div className="mt-36 px-8 text-center" role="status">
                    <div className="text-disabled text-[54px]">★</div>
                    <h2 className="mt-6 text-[20px] font-bold">
                        즐겨찾기한 지원금이 없어요
                    </h2>
                    <p className="text-text-muted mt-2 text-[14px] font-semibold">
                        추천 화면에서 관심 지원금을 등록해보세요
                    </p>
                </div>
            )}
        </MyPageLayout>
    );
};

export default FavoriteManagement;
