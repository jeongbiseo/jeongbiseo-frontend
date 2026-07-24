export const HomeSummarySkeleton = () => (
    <div
        className="bg-disabled rounded-panel mx-auto mt-4 h-[262px] w-full animate-pulse"
        role="status"
        aria-label="예상 지원금 요약 불러오는 중"
    />
);

export const HomeRecommendationSkeleton = () => (
    <div
        className="gap-layout-component mx-auto flex w-full animate-pulse flex-col"
        role="status"
        aria-label="AI 추천 지원금 불러오는 중"
    >
        <div className="bg-disabled h-[14px] w-[180px] rounded" />
        {Array.from({ length: 3 }, (_, index) => (
            <div className="bg-disabled rounded-card h-[150px]" key={index} />
        ))}
    </div>
);

export const HomeCalendarSkeleton = () => (
    <div className="pt-2">
        <div
            className="bg-disabled rounded-panel mx-auto h-[267px] w-full animate-pulse"
            role="status"
            aria-label="마감 캘린더 불러오는 중"
        />
    </div>
);

export const HomeSectionError = ({
    message,
    onRetry,
    className = "",
}: {
    message: string;
    onRetry: () => void;
    className?: string;
}) => (
    <div
        className={`px-container-comfortable flex flex-col items-center justify-center bg-white text-center ${className}`}
        role="alert"
    >
        <p className="text-body-sm text-text-muted">{message}</p>
        <button
            className="text-label-strong border-primary text-primary rounded-control mt-4 min-h-11 border px-5"
            type="button"
            onClick={onRetry}
        >
            다시 시도
        </button>
    </div>
);

export const HomeSummaryError = ({ onRetry }: { onRetry: () => void }) => (
    <HomeSectionError
        className="rounded-panel mx-auto mt-4 min-h-[262px] w-full"
        message="예상 지원금 정보를 불러오지 못했어요."
        onRetry={onRetry}
    />
);

export const HomeRecommendationError = ({
    onRetry,
}: {
    onRetry: () => void;
}) => (
    <HomeSectionError
        className="rounded-card mx-auto min-h-[150px] w-full"
        message="추천 지원금을 불러오지 못했어요."
        onRetry={onRetry}
    />
);

export const HomeCalendarError = ({ onRetry }: { onRetry: () => void }) => (
    <div className="pt-2">
        <HomeSectionError
            className="rounded-panel mx-auto min-h-[267px] w-full"
            message="마감 일정을 불러오지 못했어요."
            onRetry={onRetry}
        />
    </div>
);
