import Button from "@/components/common/Button";

export const HomeSkeleton = () => (
    <div
        className="animate-pulse"
        role="status"
        aria-label="홈 정보 불러오는 중"
    >
        <div className="bg-disabled mx-auto mt-[18px] h-[262px] w-full max-w-[324px] rounded-[30px]" />
        <div className="mt-[37px] ml-[7px] flex w-[calc(100%-14px)] max-w-[328px] flex-col gap-[18px]">
            <div className="bg-disabled h-[24px] w-[140px] rounded" />
            <div className="bg-disabled ml-auto h-[150px] w-full max-w-[312px] rounded-[20px]" />
            <div className="bg-disabled ml-auto h-[150px] w-full max-w-[312px] rounded-[20px]" />
        </div>
    </div>
);

export const HomeErrorState = ({ onRetry }: { onRetry: () => void }) => (
    <div className="mt-10 text-center" role="alert">
        <p className="text-text-muted text-[13px] font-bold">
            정보를 불러오지 못했어요.
        </p>
        <Button className="mt-5" onClick={onRetry}>
            다시 시도
        </Button>
    </div>
);
