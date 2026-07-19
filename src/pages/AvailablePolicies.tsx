import ChevronDownIcon from "@/components/common/ChevronDownIcon";
import SummaryPolicyCard from "@/components/home/SummaryPolicyCard";
import { BackButton } from "@/components/mypage/MyPageUI";
import {
    availablePoliciesData,
    type SummaryPolicyItem,
} from "@/constants/homeSummaryData";
import { useState } from "react";

const AvailablePolicies = () => {
    const [voucherExpanded, setVoucherExpanded] = useState(false);
    const voucherItems = voucherExpanded
        ? availablePoliciesData.voucher
        : availablePoliciesData.voucher.slice(0, 3);

    return (
        <main className="bg-surface-dim flex min-h-svh justify-center">
            <section className="bg-ground text-text-strong min-h-svh w-full max-w-[390px] px-[29px] pt-[72px] pb-[96px]">
                <BackButton className="-ml-1" />
                <h1 className="mt-[2px] ml-[10px] text-[24px] leading-normal font-bold">
                    지금 신청 가능한 지원금
                </h1>

                <div className="mt-[9px] rounded-[15px] px-[10px] py-[8px]">
                    <p className="text-text-muted text-[13px] leading-normal font-bold">
                        전체{" "}
                        <strong className="text-text-strong text-[16px]">
                            {availablePoliciesData.totalCount}건
                        </strong>{" "}
                        중 금액 확정{" "}
                        <strong className="text-text-strong text-[16px]">
                            {availablePoliciesData.confirmedCount}건
                        </strong>{" "}
                        · 합계 최대 {availablePoliciesData.confirmedMaximum}
                    </p>
                    <p className="text-text-muted/50 mt-[7px] text-[11px] leading-normal font-medium">
                        {availablePoliciesData.referenceDate}
                    </p>
                    <div className="mt-[11px] flex items-center gap-[14px]">
                        <CountBadge tone="cash">현금 3</CountBadge>
                        <CountBadge tone="voucher">바우처·현물 7</CountBadge>
                        <CountBadge tone="unconfirmed">
                            금액 미확정 2
                        </CountBadge>
                    </div>
                </div>

                <PolicyListSection
                    className="mt-[25px]"
                    title="현금성 지원금 (3건)"
                    items={availablePoliciesData.cash}
                />
                <PolicyListSection
                    className="mt-[24px]"
                    title="바우처 · 현물 지원금 (7건)"
                    items={voucherItems}
                />
                <button
                    className="border-primary mx-auto mt-[14px] flex h-[23px] w-[306px] cursor-pointer items-center justify-center rounded-[5px] border-[0.5px] bg-white"
                    type="button"
                    aria-expanded={voucherExpanded}
                    aria-label={
                        voucherExpanded
                            ? "바우처·현물 지원금 접기"
                            : "바우처·현물 지원금 더 보기"
                    }
                    onClick={() => setVoucherExpanded((expanded) => !expanded)}
                >
                    <ChevronDownIcon expanded={voucherExpanded} />
                </button>
                <PolicyListSection
                    className="mt-[27px]"
                    title="금액 미확정 지원금 (2건)"
                    items={availablePoliciesData.unconfirmed}
                />
            </section>
        </main>
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
        <h2 className="text-text-muted ml-[9px] text-[18px] leading-normal font-bold">
            {title}
        </h2>
        {items.length > 0 ? (
            <div className="mx-auto mt-[14px] flex w-[306px] flex-col gap-[14px]">
                {items.map((item) => (
                    <SummaryPolicyCard compact item={item} key={item.rowId} />
                ))}
            </div>
        ) : (
            <p className="text-text-muted mt-5 text-center text-[14px]">
                표시할 지원금이 없습니다.
            </p>
        )}
    </section>
);

export default AvailablePolicies;
