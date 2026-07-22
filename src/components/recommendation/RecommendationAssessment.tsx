export const RecommendationAssessment = ({
    confirmedMatchCount,
    unverifiedConditionCount,
    className = "",
}: {
    confirmedMatchCount: number;
    unverifiedConditionCount: number;
    className?: string;
}) => (
    <div className={`flex flex-wrap items-center gap-1.5 ${className}`}>
        <span className="bg-green-light text-green-dark rounded-full px-2 py-1 text-[11px] leading-none font-bold">
            확인된 {confirmedMatchCount}개
        </span>
        <span className="bg-warning-light text-warning rounded-full px-2 py-1 text-[11px] leading-none font-bold">
            추가 확인 {unverifiedConditionCount}개
        </span>
    </div>
);

export const RecommendationUncertainty = ({
    reasons,
}: {
    reasons: string[];
}) => (
    <div
        className="bg-warning-light mt-3 rounded-[10px] px-3 py-2.5"
        role="note"
    >
        <p className="text-warning text-[11px] font-bold">추가 확인 필요</p>
        {reasons.length > 0 ? (
            <ul className="text-text-body mt-1.5 list-disc space-y-1 pl-4 text-[11px] leading-[1.4] font-medium">
                {reasons.map((reason, index) => (
                    <li key={`${reason}-${index}`}>{reason}</li>
                ))}
            </ul>
        ) : (
            <p className="text-text-body mt-1 text-[11px] leading-[1.4] font-medium">
                세부 자격이나 지원 금액은 공고에서 확인해주세요.
            </p>
        )}
    </div>
);
