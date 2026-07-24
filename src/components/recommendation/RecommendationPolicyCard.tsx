import {
    RecommendationAssessment,
    RecommendationUncertainty,
} from "@/components/recommendation/RecommendationAssessment";
import type { RecommendationPolicy } from "@/constants/recommendationData";
import { Link } from "react-router-dom";

type RecommendationPolicyCardProps = {
    policy: RecommendationPolicy;
    favoriteUpdating: boolean;
    onFavoriteToggle: (id: number) => void;
};

export const RecommendationPolicyCard = ({
    policy,
    favoriteUpdating,
    onFavoriteToggle,
}: RecommendationPolicyCardProps) => {
    const urgent =
        policy.deadlineDays !== null &&
        policy.deadlineDays >= 0 &&
        policy.deadlineDays <= 7;
    const scheduled = policy.deadlineDays !== null;
    const hasAssessment =
        policy.confirmedMatchCount !== null &&
        policy.unverifiedConditionCount !== null;

    return (
        <article className="border-primary relative min-h-[107px] rounded-[20px] border-[0.5px] bg-white px-[21px] py-[15px]">
            <Link
                className="block"
                to={`/policies/${policy.id}`}
                state={{ bottomNavPath: "/recommend" }}
            >
                <p className="text-label-medium pr-10 text-[#8e98a8]">
                    {policy.organization}
                </p>
                <h2 className="text-title mt-[6px] pr-10">{policy.title}</h2>
                {hasAssessment && (
                    <RecommendationAssessment
                        className="mt-3"
                        confirmedMatchCount={policy.confirmedMatchCount!}
                        unverifiedConditionCount={
                            policy.unverifiedConditionCount!
                        }
                    />
                )}
                {policy.eligibilitySummary && (
                    <p className="text-text-muted text-label mt-2 line-clamp-2 whitespace-pre-line">
                        {policy.eligibilitySummary}
                    </p>
                )}
                <div className="mt-3 flex items-end justify-between gap-3">
                    <p className="text-green-dark text-body-strong">
                        {policy.amountLabel ?? "산정 불가"}
                    </p>
                    <span
                        className={`text-label-strong shrink-0 rounded-[13px] px-[9px] py-[6px] ${urgent ? "bg-danger-light text-danger" : scheduled ? "bg-green-light text-green-dark" : "bg-disabled text-text-muted"}`}
                    >
                        {policy.deadlineLabel}
                    </span>
                </div>
                {policy.uncomputable && (
                    <RecommendationUncertainty
                        reasons={policy.uncomputableReasons}
                    />
                )}
            </Link>

            <button
                className="focus-visible:outline-primary absolute top-[12px] right-[21px] flex size-8 cursor-pointer items-center justify-center focus-visible:rounded focus-visible:outline-2 disabled:cursor-wait disabled:opacity-60"
                type="button"
                disabled={favoriteUpdating}
                aria-busy={favoriteUpdating}
                aria-label={
                    policy.isFavorite ? "즐겨찾기 해제" : "즐겨찾기 추가"
                }
                aria-pressed={policy.isFavorite}
                onClick={() => onFavoriteToggle(policy.id)}
            >
                <StarIcon filled={policy.isFavorite} />
            </button>
        </article>
    );
};

const StarIcon = ({ filled }: { filled: boolean }) => (
    <svg className="size-6" viewBox="0 0 24 24" aria-hidden="true">
        <path
            d="m12 1.8 3.1 6.3 7 .9-5.1 4.9 1.3 6.9-6.3-3.3-6.3 3.3 1.3-6.9L1.9 9l7-.9L12 1.8Z"
            fill={filled ? "var(--color-secondary)" : "var(--color-disabled)"}
        />
    </svg>
);
