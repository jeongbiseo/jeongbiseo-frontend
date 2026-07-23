/*
 * 신청 가능한 지원금 목록 페이지 ('/available-policies')입니다.
 *
 * GET /estimated-total/breakdown 응답을 지급 방식에 따라 세 섹션으로 나눠 보여줍니다.
 * - 현금성 지원금   : items(현금) + monthlyItems(월 지급)
 * - 바우처·현물     : separateBenefits 중 VOUCHER / IN_KIND / REDUCTION
 * - 금액 미확정     : separateBenefits 중 UNKNOWN
 *
 * 상단 기준 문구는 GET /estimated-total의 notice를 사용합니다.
 */

import {
    getEstimatedBreakdownApi,
    getEstimatedTotalApi,
} from "@/api/estimatedApi";
import ChevronDownIcon from "@/components/common/ChevronDownIcon";
import Button from "@/components/common/Button";
import SummaryPolicyCard, {
    type SummaryPolicyItem,
} from "@/components/home/SummaryPolicyCard";
import { BackButton } from "@/components/mypage/MyPageUI";
import { paymentTypeLabels } from "@/constants/paymentType";
import type { EstimatedBreakdownResult } from "@/types/estimated";
import { classifySeparateBenefits } from "@/utils/estimated";
import { formatAmountRange, formatWon } from "@/utils/format";
import { useEffect, useState } from "react";

type Sections = {
    cash: SummaryPolicyItem[];
    voucher: SummaryPolicyItem[];
    unconfirmed: SummaryPolicyItem[];
    totalCount: number;
    confirmedCount: number;
    confirmedMaximum: string;
};

/** breakdown 응답을 화면 섹션 구조로 변환합니다. */
const toSections = (breakdown: EstimatedBreakdownResult): Sections => {
    const cash: SummaryPolicyItem[] = [
        ...breakdown.items.map((item) => ({
            rowId: `cash-${item.subsidyId}`,
            policyId: item.subsidyId,
            title: item.name,
            value:
                item.includedInTotal && item.amountMax > 0
                    ? formatAmountRange(item.amountMin, item.amountMax)
                    : "확정 금액 없음",
            valueTone: (item.includedInTotal && item.amountMax > 0
                ? "success"
                : "muted") as SummaryPolicyItem["valueTone"],
        })),
        ...breakdown.monthlyItems.map((item) => ({
            rowId: `monthly-${item.subsidyId}`,
            policyId: item.subsidyId,
            title: item.name,
            value: formatAmountRange(
                item.monthlyAmountMin,
                item.monthlyAmountMax,
                " / 월"
            ),
            valueTone: "success" as const,
        })),
    ];

    const { voucherLike, unconfirmed: unconfirmedBenefits } =
        classifySeparateBenefits(breakdown.separateBenefits);

    const voucher = voucherLike.map((item) => ({
        rowId: `voucher-${item.subsidyId}`,
        policyId: item.subsidyId,
        title: item.name,
        value: paymentTypeLabels[item.paymentType],
        valueTone: "voucher" as const,
    }));

    const unconfirmed = unconfirmedBenefits.map((item) => ({
        rowId: `unconfirmed-${item.subsidyId}`,
        policyId: item.subsidyId,
        title: item.name,
        value: "금액 미확정",
        valueTone: "muted" as const,
    }));

    return {
        cash,
        voucher,
        unconfirmed,
        totalCount:
            breakdown.items.length +
            breakdown.monthlyItems.length +
            breakdown.separateBenefits.length,
        confirmedCount: breakdown.items.filter(
            ({ includedInTotal }) => includedInTotal
        ).length,
        confirmedMaximum: formatWon(breakdown.cashTotalMax),
    };
};

type PageState =
    | { status: "loading" }
    | { status: "error" }
    | { status: "ready"; sections: Sections; notice: string };

const AvailablePolicies = () => {
    const [state, setState] = useState<PageState>({ status: "loading" });
    const [voucherExpanded, setVoucherExpanded] = useState(false);
    const [reloadKey, setReloadKey] = useState(0);

    useEffect(() => {
        let active = true;

        const load = async () => {
            try {
                const [total, breakdown] = await Promise.all([
                    getEstimatedTotalApi(),
                    getEstimatedBreakdownApi(),
                ]);

                if (!active) return;

                if (!total.isSuccess || !breakdown.isSuccess) {
                    setState({ status: "error" });
                    return;
                }

                setState({
                    status: "ready",
                    sections: toSections(breakdown.result),
                    notice: total.result.notice,
                });
            } catch {
                if (active) setState({ status: "error" });
            }
        };

        void load();

        return () => {
            active = false;
        };
    }, [reloadKey]);

    return (
        <main className="bg-surface-dim flex min-h-svh justify-center">
            <section className="bg-ground text-text-strong min-h-svh w-full max-w-[390px] px-[29px] pt-[29px] pb-[96px]">
                <BackButton className="-ml-1" />
                <h1 className="mt-[2px] ml-[10px] text-[24px] leading-normal font-bold">
                    지금 신청 가능한 지원금
                </h1>

                {state.status === "loading" && (
                    <p className="text-text-muted mt-10 text-center text-[13px] font-bold">
                        불러오는 중이에요...
                    </p>
                )}

                {state.status === "error" && (
                    <div className="mt-10 text-center">
                        <p className="text-text-muted text-[13px] font-bold">
                            정보를 불러오지 못했어요.
                        </p>
                        <Button
                            className="mt-5"
                            onClick={() => {
                                setState({ status: "loading" });
                                setReloadKey((key) => key + 1);
                            }}
                        >
                            다시 시도
                        </Button>
                    </div>
                )}

                {state.status === "ready" && (
                    <AvailablePoliciesContent
                        sections={state.sections}
                        notice={state.notice}
                        voucherExpanded={voucherExpanded}
                        onToggleVoucher={() =>
                            setVoucherExpanded((expanded) => !expanded)
                        }
                    />
                )}
            </section>
        </main>
    );
};

const AvailablePoliciesContent = ({
    sections,
    notice,
    voucherExpanded,
    onToggleVoucher,
}: {
    sections: Sections;
    notice: string;
    voucherExpanded: boolean;
    onToggleVoucher: () => void;
}) => {
    const voucherItems = voucherExpanded
        ? sections.voucher
        : sections.voucher.slice(0, 3);

    return (
        <>
            <div className="mt-[9px] rounded-[15px] px-[10px] py-[8px]">
                <p className="text-text-muted text-[13px] leading-normal font-bold">
                    전체{" "}
                    <strong className="text-text-strong text-[16px]">
                        {sections.totalCount}건
                    </strong>{" "}
                    중 금액 확정{" "}
                    <strong className="text-text-strong text-[16px]">
                        {sections.confirmedCount}건
                    </strong>{" "}
                    · 합계 최대 {sections.confirmedMaximum}
                </p>
                <p className="text-text-muted/50 mt-[7px] text-[11px] leading-normal font-medium">
                    {notice}
                </p>
                <div className="mt-[11px] flex items-center gap-[14px]">
                    <CountBadge tone="cash">
                        {`현금 ${sections.cash.length}`}
                    </CountBadge>
                    <CountBadge tone="voucher">
                        {`바우처·현물 ${sections.voucher.length}`}
                    </CountBadge>
                    <CountBadge tone="unconfirmed">
                        {`금액 미확정 ${sections.unconfirmed.length}`}
                    </CountBadge>
                </div>
            </div>

            <PolicyListSection
                className="mt-[25px]"
                title={`현금성 지원금 (${sections.cash.length}건)`}
                items={sections.cash}
            />
            <PolicyListSection
                className="mt-[24px]"
                title={`바우처 · 현물 지원금 (${sections.voucher.length}건)`}
                items={voucherItems}
            />
            {sections.voucher.length > 3 && (
                <button
                    className="border-primary mx-auto mt-[14px] flex h-[23px] w-full max-w-[306px] cursor-pointer items-center justify-center rounded-[5px] border-[0.5px] bg-white"
                    type="button"
                    aria-expanded={voucherExpanded}
                    aria-label={
                        voucherExpanded
                            ? "바우처·현물 지원금 접기"
                            : "바우처·현물 지원금 더 보기"
                    }
                    onClick={onToggleVoucher}
                >
                    <ChevronDownIcon expanded={voucherExpanded} />
                </button>
            )}
            <PolicyListSection
                className="mt-[27px]"
                title={`금액 미확정 지원금 (${sections.unconfirmed.length}건)`}
                items={sections.unconfirmed}
            />
        </>
    );
};

const CountBadge = ({
    tone,
    children,
}: {
    tone: "cash" | "voucher" | "unconfirmed";
    children: string;
}) => {
    const toneClassNames = {
        cash: "bg-green-light text-success",
        voucher: "bg-warning-light text-[#936415]",
        unconfirmed: "bg-disabled text-text-muted",
    };

    return (
        <span
            className={`rounded-full px-2 py-[5px] text-[12px] leading-normal font-bold whitespace-nowrap ${toneClassNames[tone]}`}
        >
            {children}
        </span>
    );
};

const PolicyListSection = ({
    title,
    items,
    className,
}: {
    title: string;
    items: SummaryPolicyItem[];
    className?: string;
}) => (
    <section className={className}>
        <h2 className="text-text-muted ml-[9px] text-[16px] leading-normal font-bold">
            {title}
        </h2>
        {items.length > 0 ? (
            <div className="mx-auto mt-[14px] flex w-full max-w-[306px] flex-col gap-[14px]">
                {items.map((item) => (
                    <SummaryPolicyCard compact item={item} key={item.rowId} />
                ))}
            </div>
        ) : (
            <p className="text-text-muted mt-5 text-center text-[13px] font-bold">
                표시할 지원금이 없습니다.
            </p>
        )}
    </section>
);

export default AvailablePolicies;
