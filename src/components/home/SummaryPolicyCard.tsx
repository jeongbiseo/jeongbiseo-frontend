import { Link } from "react-router-dom";

/** 요약 목록 카드 한 줄에 표시할 데이터입니다. */
export interface SummaryPolicyItem {
    rowId: string;
    policyId: number;
    title: string;
    value: string;
    valueTone?: "success" | "muted" | "voucher";
}

const valueToneClassNames = {
    success: "text-success",
    muted: "text-text-muted",
    voucher: "bg-warning-light text-[#936415] rounded-badge px-2 py-1",
};

const SummaryPolicyCard = ({
    item,
    compact = false,
}: {
    item: SummaryPolicyItem;
    compact?: boolean;
}) => (
    <Link
        className={`border-primary focus-visible:outline-primary rounded-card gap-layout-related px-container flex w-full items-center justify-between border-[0.5px] bg-white focus-visible:outline-2 ${compact ? "text-body-sm py-container-compact min-h-[65px]" : "text-body py-container min-h-[69px]"}`}
        to={`/policies/${item.policyId}`}
        state={{ bottomNavPath: "/" }}
    >
        <span className="min-w-0 truncate">{item.title}</span>
        <span
            className={`text-body-sm-strong shrink-0 text-right ${valueToneClassNames[item.valueTone ?? "success"]}`}
        >
            {item.value}
        </span>
    </Link>
);

export default SummaryPolicyCard;
