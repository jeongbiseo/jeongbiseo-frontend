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
        className={`border-primary focus-visible:outline-primary rounded-card gap-layout-related flex w-full items-center justify-between border-[0.5px] bg-white px-4 focus-visible:outline-2 ${compact ? "text-body-sm min-h-[65px] py-3" : "text-body min-h-[69px] py-4"}`}
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
