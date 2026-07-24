import { useState } from "react";

const FRESHNESS_WARNING_MS = 48 * 60 * 60 * 1000;

const updatedAtFormatter = new Intl.DateTimeFormat("ko-KR", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
});

export const RecommendationFreshness = ({
    dataUpdatedAt,
    className = "",
}: {
    dataUpdatedAt: string;
    className?: string;
}) => {
    const [renderedAt] = useState(() => Date.now());
    const updatedAt = new Date(dataUpdatedAt);

    if (Number.isNaN(updatedAt.getTime())) return null;

    const isStale = renderedAt - updatedAt.getTime() > FRESHNESS_WARNING_MS;

    return (
        <div
            className={`rounded-card px-3 py-2.5 ${isStale ? "bg-warning-light" : "bg-surface-soft"} ${className}`}
            role={isStale ? "note" : undefined}
        >
            <p
                className={`text-label-medium ${isStale ? "text-warning" : "text-text-muted"}`}
            >
                데이터 기준 {updatedAtFormatter.format(updatedAt)}
            </p>
            {isStale && (
                <p className="text-text-body text-label mt-1">
                    최신 데이터 갱신이 지연되고 있어요. 신청 전 공식 공고를
                    확인해주세요.
                </p>
            )}
        </div>
    );
};
