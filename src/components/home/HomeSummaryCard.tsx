import type {
    EstimatedBreakdownResult,
    EstimatedTotalResult,
} from "@/types/estimated";
import { formatWon } from "@/utils/format";
import { Link } from "react-router-dom";

/** 지급 방식별로 배지에 표시할 건수를 계산합니다. */
const countBadges = (breakdown: EstimatedBreakdownResult) => {
    const voucherLike = breakdown.separateBenefits.filter(({ paymentType }) =>
        ["VOUCHER", "IN_KIND", "REDUCTION"].includes(paymentType)
    ).length;
    const unknown = breakdown.separateBenefits.filter(
        ({ paymentType }) => paymentType === "UNKNOWN"
    ).length;

    return { voucherLike, unknown };
};

export const HomeSummaryCard = ({
    total,
    breakdown,
}: {
    total: EstimatedTotalResult;
    breakdown: EstimatedBreakdownResult;
}) => {
    const hasConfirmedAmount = total.itemCount > 0;
    const { voucherLike, unknown } = countBadges(breakdown);

    return (
        <article className="bg-primary relative mx-auto mt-[18px] h-[262px] w-[324px] overflow-hidden rounded-[30px] px-[19px] pt-7 text-white">
            <SummaryDecoration />

            <div className="relative z-10">
                <p className="text-[16px] leading-normal font-bold">
                    지금 신청 가능한 지원금
                </p>
                <p className="mt-[13px] text-[36px] leading-normal font-bold tracking-[-0.02em]">
                    {total.totalCount}건
                </p>

                <div className="mt-[13px] flex items-center gap-3 text-[13px] font-bold">
                    <span>
                        {hasConfirmedAmount
                            ? `금액 확정 ${total.itemCount}건`
                            : "금액 확정은 아직 없어요, 바우처·현물 지원 위주예요"}
                    </span>
                    {hasConfirmedAmount && total.cashTotalMax !== null && (
                        <span className="rounded-full bg-[#32e5a9] px-2 py-[5px] whitespace-nowrap">
                            합계 최대 {formatWon(total.cashTotalMax)}
                        </span>
                    )}
                </div>

                <div className="mt-[13px] flex items-center gap-[14px]">
                    {[
                        `현금 ${total.itemCount}`,
                        `바우처·현물 ${voucherLike}`,
                        `금액 미확정 ${unknown}`,
                    ].map((label) => (
                        <span
                            className="rounded-full bg-[#32e5a9] px-2 py-[5px] text-[12px] leading-none font-bold whitespace-nowrap"
                            key={label}
                        >
                            {label}
                        </span>
                    ))}
                </div>

                <p className="mt-[11px] text-[11px] leading-none font-medium">
                    {total.notice}
                </p>

                <Link
                    className="mt-[13px] flex w-fit items-center gap-[5px] text-[13px] leading-none font-bold"
                    to="/available-policies"
                >
                    지원금 살펴보기
                    <span aria-hidden="true">→</span>
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
