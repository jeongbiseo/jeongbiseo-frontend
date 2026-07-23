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
    <section className={`ml-[7px] w-[328px] ${className ?? ""}`}>
        <div className="flex items-center justify-between">
            <h2 className="text-[24px] leading-normal font-bold">{title}</h2>
            <Link
                className="text-text-muted text-[16px] leading-none font-bold"
                to={to}
            >
                {linkLabel}
            </Link>
        </div>
        <div className="mt-[18px]">{children}</div>
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
            className="border-primary relative block min-h-[150px] rounded-[20px] border-[0.5px] bg-white px-[21px] py-[15px]"
            to={`/policies/${recommendation.subsidyId}`}
            state={{ bottomNavPath: "/" }}
        >
            <div className="pr-[76px]">
                <p className="text-text-subtle text-[13px] leading-none font-bold">
                    {recommendation.agency}
                </p>
                <h3 className="mt-[6px] truncate text-[16px] leading-none font-bold">
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
                    <p className="text-warning mt-2 truncate text-[11px] leading-none font-semibold">
                        {recommendation.uncomputableReasons[0] ??
                            "세부 조건을 추가로 확인해주세요"}
                    </p>
                )}
                <p className="text-success mt-3 truncate text-[16px] leading-none font-bold">
                    {formatAmountRange(
                        recommendation.estimatedAmountMin,
                        recommendation.estimatedAmountMax
                    )}
                </p>
            </div>

            <span
                className={`absolute top-[15px] right-[21px] rounded-[13px] px-[7px] py-[6px] text-[13px] leading-none font-bold ${badgeClassName}`}
            >
                {badgeLabel}
            </span>
            {recommendation.deadline && (
                <span className="text-text-muted absolute right-[21px] bottom-[16px] text-[13px] leading-none font-medium">
                    {formatDeadline(recommendation.deadline)}
                </span>
            )}
        </Link>
    );
};

export const HomeRecommendationSection = ({
    recommendations,
    dataUpdatedAt,
}: {
    recommendations: RecommendationItem[];
    dataUpdatedAt: string;
}) => (
    <HomeSection
        className="mt-[37px]"
        title="AI 추천 지원금"
        linkLabel="전체보기"
        to="/recommend"
    >
        <div className="ml-auto flex w-[312px] flex-col gap-[18px]">
            <RecommendationFreshness dataUpdatedAt={dataUpdatedAt} />
            {recommendations.map((recommendation) => (
                <RecommendationCard
                    key={recommendation.subsidyId}
                    recommendation={recommendation}
                />
            ))}
            {recommendations.length === 0 && (
                <p className="text-text-muted py-6 text-center text-[13px] font-semibold">
                    아직 조건에 맞는 지원금이 없어요
                </p>
            )}
        </div>
    </HomeSection>
);
