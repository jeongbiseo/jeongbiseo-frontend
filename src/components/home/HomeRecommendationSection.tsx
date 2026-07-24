import { RecommendationAssessment } from "@/components/recommendation/RecommendationAssessment";
import { RecommendationFreshness } from "@/components/recommendation/RecommendationFreshness";
import { isNonCashPayment, paymentTypeLabels } from "@/constants/paymentType";
import type { RecommendationItem } from "@/types/recommendation";
import { formatAmountRange, formatDDay, formatDeadline } from "@/utils/format";
import type { ReactNode } from "react";
import { Link } from "react-router-dom";

export const HomeSection = ({
    title,
    linkLabel,
    to,
    className,
    children,
}: {
    title: string;
    linkLabel: string;
    to: string;
    className?: string;
    children: ReactNode;
}) => (
    <section className={`mx-auto w-full max-w-[328px] ${className ?? ""}`}>
        <div className="flex items-center justify-between">
            <h2 className="text-heading-section">{title}</h2>
            <Link className="text-body-sm-strong text-text-muted" to={to}>
                {linkLabel}
            </Link>
        </div>
        <div className="mt-layout-component">{children}</div>
    </section>
);

const RecommendationCard = ({
    recommendation,
}: {
    recommendation: RecommendationItem;
}) => {
    // 바우처·현물성 지원금은 마감일 대신 지급 방식을 배지로 보여줍니다.
    const nonCash = isNonCashPayment(recommendation.paymentType);
    const isUrgent =
        recommendation.dDay !== null &&
        recommendation.dDay >= 0 &&
        recommendation.dDay <= 7;
    const badgeLabel = nonCash
        ? paymentTypeLabels[recommendation.paymentType]
        : formatDDay(recommendation.dDay);
    const badgeClassName =
        nonCash || recommendation.dDay === null
            ? "bg-warning-light text-warning"
            : isUrgent
              ? "bg-danger-light text-danger"
              : "bg-green-light text-success";

    return (
        <Link
            className="border-primary rounded-card relative block min-h-[150px] border-[0.5px] bg-white p-4"
            to={`/policies/${recommendation.subsidyId}`}
            state={{ bottomNavPath: "/" }}
        >
            <div className="pr-[76px]">
                <p className="text-label-medium text-text-subtle">
                    {recommendation.agency}
                </p>
                <h3 className="text-title mt-layout-tight truncate">
                    {recommendation.name}
                </h3>
                <RecommendationAssessment
                    className="mt-3"
                    confirmedMatchCount={recommendation.confirmedMatchCount}
                    unverifiedConditionCount={
                        recommendation.unverifiedConditionCount
                    }
                />
                {recommendation.uncomputable && (
                    <p className="text-label text-warning mt-2 truncate">
                        {recommendation.uncomputableReasons[0] ??
                            "세부 조건을 추가로 확인해주세요"}
                    </p>
                )}
                <p className="text-body-strong text-success mt-3 truncate">
                    {formatAmountRange(
                        recommendation.estimatedAmountMin,
                        recommendation.estimatedAmountMax
                    )}
                </p>
            </div>

            <span
                className={`text-label-strong rounded-badge absolute top-4 right-4 px-2 py-1 ${badgeClassName}`}
            >
                {badgeLabel}
            </span>
            {recommendation.deadline && (
                <span className="text-label text-text-muted absolute right-4 bottom-4">
                    {formatDeadline(recommendation.deadline)}
                </span>
            )}
        </Link>
    );
};

export const HomeRecommendationContent = ({
    recommendations,
    dataUpdatedAt,
}: {
    recommendations: RecommendationItem[];
    dataUpdatedAt: string;
}) => (
    <div className="gap-layout-component mx-auto flex w-full max-w-[305px] flex-col">
        <RecommendationFreshness dataUpdatedAt={dataUpdatedAt} />
        {recommendations.map((recommendation) => (
            <RecommendationCard
                key={recommendation.subsidyId}
                recommendation={recommendation}
            />
        ))}
        {recommendations.length === 0 && (
            <p className="text-body-sm text-text-muted py-6 text-center">
                아직 조건에 맞는 지원금이 없어요
            </p>
        )}
    </div>
);
