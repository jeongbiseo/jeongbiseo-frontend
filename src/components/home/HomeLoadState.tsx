export const HomeSummarySkeleton = () => (
    <div
        className="bg-disabled mx-auto mt-[18px] h-[262px] w-full max-w-[305px] animate-pulse rounded-[30px]"
        role="status"
        aria-label="예상 지원금 요약 불러오는 중"
    />
);

export const HomeRecommendationSkeleton = () => (
    <div
        className="ml-[15px] flex w-[calc(100%-23px)] max-w-[305px] animate-pulse flex-col gap-[18px]"
        role="status"
        aria-label="AI 추천 지원금 불러오는 중"
    >
        <div className="bg-disabled h-[14px] w-[180px] rounded" />
        {Array.from({ length: 3 }, (_, index) => (
            <div className="bg-disabled h-[150px] rounded-[20px]" key={index} />
        ))}
    </div>
);

export const HomeCalendarSkeleton = () => (
    <div className="pt-2">
        <div
            className="bg-disabled ml-[15px] h-[267px] w-[calc(100%-23px)] max-w-[305px] animate-pulse rounded-[20px]"
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
        className={`flex flex-col items-center justify-center bg-white px-6 text-center ${className}`}
        role="alert"
    >
        <p className="text-text-muted text-[13px] font-bold">{message}</p>
        <button
            className="border-primary text-primary mt-4 h-9 rounded-full border px-5 text-[12px] font-bold"
            type="button"
            onClick={onRetry}
        >
            다시 시도
        </button>
    </div>
);

export const HomeSummaryError = ({ onRetry }: { onRetry: () => void }) => (
    <HomeSectionError
        className="mx-auto mt-[18px] min-h-[262px] w-full max-w-[305px] rounded-[30px]"
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
        className="ml-[15px] min-h-[150px] w-[calc(100%-23px)] max-w-[305px] rounded-[20px]"
        message="추천 지원금을 불러오지 못했어요."
        onRetry={onRetry}
    />
);

export const HomeCalendarError = ({ onRetry }: { onRetry: () => void }) => (
    <div className="pt-2">
        <HomeSectionError
            className="ml-[15px] min-h-[267px] w-[calc(100%-23px)] max-w-[305px] rounded-[20px]"
            message="마감 일정을 불러오지 못했어요."
            onRetry={onRetry}
        />
    </div>
);
