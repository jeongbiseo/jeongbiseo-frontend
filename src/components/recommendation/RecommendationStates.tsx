import { SearchIcon } from "@/components/recommendation/RecommendationIcons";

export const RecommendationSkeleton = () => (
    <div className="gap-layout-component mx-auto mt-6 flex w-full max-w-[298px] animate-pulse flex-col">
        {[0, 1, 2].map((item) => (
            <div className="bg-disabled rounded-card h-[164px]" key={item} />
        ))}
    </div>
);

export const LoadErrorState = ({ onRetry }: { onRetry: () => void }) => (
    <div className="mx-auto mt-14 w-full max-w-[330px] px-[14px] text-center">
        <h2 className="text-heading-section">추천 정보를 불러오지 못했어요</h2>
        <p className="text-text-muted text-body-sm mt-2">
            잠시 후 다시 시도해주세요
        </p>
        <button
            className="bg-primary text-label-strong rounded-control mt-4 cursor-pointer px-5 py-3 text-white"
            type="button"
            onClick={onRetry}
        >
            다시 시도
        </button>
    </div>
);

export const EmptyRecommendation = ({
    onEditProfile,
}: {
    onEditProfile: () => void;
}) => (
    <div className="mx-auto mt-6 w-full max-w-[330px]">
        <h2 className="text-heading-section">추천 지원금 0건</h2>
        <p className="text-text-muted text-body-sm mt-2">
            현재 입력하신 조건에 맞는 지원금을 찾지 못했어요
        </p>
        <div className="border-primary rounded-card mx-auto mt-6 min-h-[216px] w-full max-w-[302px] border-[0.5px] p-4">
            <h3 className="text-title">이런 이유일 수 있어요</h3>
            <ol className="text-text-muted text-body-sm mt-layout-related space-y-layout-related list-decimal pl-5">
                <li>
                    거주지·고용상태·연령 조건이 지원 자격과 맞지 않을 수 있어요.
                </li>
                <li>
                    소득구간 또는 가구원 수가 기준을 초과하거나 미달할 수
                    있어요.
                </li>
                <li>
                    이미 수령 중인 지원금으로 표시된 항목이 제외되었을 수
                    있어요.
                </li>
            </ol>
        </div>
        <button
            className="bg-primary text-body-strong rounded-control mx-auto mt-6 block h-[55px] w-full max-w-[302px] cursor-pointer text-white shadow-[3px_11px_8px_var(--color-green-light-active)] active:scale-[0.99]"
            type="button"
            onClick={onEditProfile}
        >
            정보 수정하고 다시 추천받기
        </button>
    </div>
);

export const SimpleEmptyState = ({
    title,
    description,
}: {
    title: string;
    description: string;
}) => (
    <div className="mx-auto mt-14 w-full max-w-[330px] px-[14px] text-center">
        <h2 className="text-title">{title}</h2>
        <p className="text-text-muted text-body-sm mt-2">{description}</p>
    </div>
);

export const SearchEmptyState = () => (
    <div
        className="gap-layout-group mx-auto mt-[177px] flex w-full max-w-[341px] flex-col items-center text-center"
        role="status"
    >
        <div className="bg-disabled flex size-[95px] items-center justify-center rounded-full text-white">
            <SearchIcon className="size-icon-display" />
        </div>
        <div className="gap-layout-inline flex w-full max-w-[313px] flex-col items-center">
            <h2 className="text-title">검색 내역이 없어요</h2>
            <p className="text-text-muted text-body-sm">
                단어의 철자나 띄어쓰기가 맞는지
                <br />
                다시 확인해 주세요
            </p>
        </div>
    </div>
);

export const FavoriteEmptyState = () => (
    <div
        className="mx-auto mt-[245px] flex w-full max-w-[313px] flex-col items-center text-center"
        role="status"
    >
        <div className="gap-layout-inline flex w-full flex-col">
            <h2 className="text-title">아직 즐겨찾기한 지원금이 없어요</h2>
            <p className="text-text-muted text-body-sm">
                마음에 드는 지원금을 담아보세요
            </p>
        </div>
    </div>
);
