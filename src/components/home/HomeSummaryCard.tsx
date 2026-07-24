import type {
    EstimatedBreakdownResult,
    EstimatedTotalResult,
} from "@/types/estimated";
import { classifySeparateBenefits } from "@/utils/estimated";
import { formatWon } from "@/utils/format";
import { Link } from "react-router-dom";

/** 지급 방식별로 배지에 표시할 건수를 계산합니다. */
const countBadges = (breakdown: EstimatedBreakdownResult) => {
    const { voucherLike, unconfirmed } = classifySeparateBenefits(
        breakdown.separateBenefits
    );

    return {
        voucherLike: voucherLike.length,
        unconfirmed: unconfirmed.length,
    };
};

export const HomeSummaryCard = ({
    total,
    breakdown,
}: {
    total: EstimatedTotalResult;
    breakdown: EstimatedBreakdownResult;
}) => {
    const hasConfirmedAmount = total.itemCount > 0;
    const { voucherLike, unconfirmed } = countBadges(breakdown);

    return (
        <article className="bg-primary rounded-panel relative mx-auto mt-4 min-h-[262px] w-full max-w-[305px] overflow-hidden px-4 py-6 text-white">
            <SummaryDecoration />

            <div className="relative z-10">
                <p className="text-title">지금 신청 가능한 지원금</p>
                <p className="text-display-number mt-layout-inline">
                    {total.totalCount}건
                </p>

                <div className="text-label-strong mt-layout-related gap-x-layout-related gap-y-layout-inline flex flex-wrap items-center">
                    <span>
                        {hasConfirmedAmount
                            ? `금액 확정 ${total.itemCount}건`
                            : "금액 확정은 아직 없어요, 바우처·현물 지원 위주예요"}
                    </span>
                    {hasConfirmedAmount && total.cashTotalMax !== null && (
                        <span className="rounded-badge bg-[#32e5a9] px-2 py-1 whitespace-nowrap">
                            합계 최대 {formatWon(total.cashTotalMax)}
                        </span>
                    )}
                </div>

                <div className="mt-layout-related gap-x-layout-inline gap-y-layout-inline flex flex-wrap items-center">
                    {[
                        `현금 ${total.itemCount}`,
                        `바우처·현물 ${voucherLike}`,
                        `금액 미확정 ${unconfirmed}`,
                    ].map((label) => (
                        <span
                            className="text-caption-strong rounded-badge bg-[#32e5a9] px-2 py-1 whitespace-nowrap"
                            key={label}
                        >
                            {label}
                        </span>
                    ))}
                </div>

                <p className="text-label mt-layout-inline">{total.notice}</p>

                <Link
                    className="text-label-strong mt-layout-related gap-layout-tight flex w-fit items-center"
                    to="/available-policies"
                >
                    지원금 살펴보기
                    <span
                        className="text-[16px] leading-none"
                        aria-hidden="true"
                    >
                        →
                    </span>
                </Link>
            </div>
        </article>
    );
};

const SummaryDecoration = () => (
    <div className="pointer-events-none absolute inset-0" aria-hidden="true">
        <span className="absolute -top-[58px] right-6 size-[118px] rounded-full bg-white/[0.08] blur-[2px]" />
        <span className="absolute top-0 -left-[141px] h-[280px] w-[254px] rounded-[50%] bg-white/[0.05]" />
        <span className="absolute right-[-37px] bottom-[-24px] size-[161px] rounded-full bg-white/[0.08]" />
    </div>
);
