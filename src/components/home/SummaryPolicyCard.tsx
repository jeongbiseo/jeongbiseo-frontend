import type { SummaryPolicyItem } from "@/constants/homeSummaryData";
import { Link } from "react-router-dom";

const valueToneClassNames = {
    success: "text-success",
    muted: "text-text-muted",
    voucher:
        "bg-warning-light text-[#936415] rounded-full px-2 py-[5px] text-[12px]",
};

const SummaryPolicyCard = ({
    item,
    compact = false,
}: {
    item: SummaryPolicyItem;
    compact?: boolean;
}) => (
    <Link
        className={`border-primary focus-visible:outline-primary flex w-full items-center justify-between gap-3 rounded-[10px] border-[0.5px] bg-white focus-visible:outline-2 ${compact ? "min-h-[65px] px-[17px] py-4 text-[15px]" : "min-h-[69px] px-[18px] py-4 text-[16px]"}`}
        to={`/policies/${item.policyId}`}
        state={{ bottomNavPath: "/" }}
    >
        <span className="min-w-0 truncate leading-none font-bold">
            {item.title}
        </span>
        <span
            className={`shrink-0 text-right leading-none font-bold ${valueToneClassNames[item.valueTone ?? "success"]}`}
        >
            {item.value}
        </span>
    </Link>
);

export default SummaryPolicyCard;
