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
        <span className="bg-green-light text-green-dark text-caption-strong rounded-badge px-2 py-1">
            확인된 {confirmedMatchCount}개
        </span>
        <span className="bg-warning-light text-warning text-caption-strong rounded-badge px-2 py-1">
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
        className="bg-warning-light rounded-card px-container-compact mt-3 py-2.5"
        role="note"
    >
        <p className="text-warning text-label-strong">추가 확인 필요</p>
        {reasons.length > 0 ? (
            <ul className="text-text-body text-label mt-1.5 list-disc space-y-1 pl-4">
                {reasons.map((reason, index) => (
                    <li key={`${reason}-${index}`}>{reason}</li>
                ))}
            </ul>
        ) : (
            <p className="text-text-body text-label mt-1">
                세부 자격이나 지원 금액은 공고에서 확인해주세요.
            </p>
        )}
    </div>
);
