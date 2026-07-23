import { SearchIcon } from "@/components/recommendation/RecommendationIcons";

export const RecommendationSkeleton = () => (
    <div className="mx-auto mt-7 flex w-full max-w-[298px] animate-pulse flex-col gap-4">
        {[0, 1, 2].map((item) => (
            <div className="bg-disabled h-[164px] rounded-[20px]" key={item} />
        ))}
    </div>
);

export const LoadErrorState = ({ onRetry }: { onRetry: () => void }) => (
    <div className="mx-auto mt-14 w-full max-w-[330px] px-[14px] text-center">
        <h2 className="text-[20px] font-bold">추천 정보를 불러오지 못했어요</h2>
        <p className="text-text-muted mt-2 text-[13px] font-bold">
            잠시 후 다시 시도해주세요
        </p>
        <button
            className="bg-primary mt-5 cursor-pointer rounded-[12px] px-5 py-3 text-[14px] font-bold text-white"
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
        <h2 className="text-[20px] font-bold">추천 지원금 0건</h2>
        <p className="text-text-muted mt-2 text-[13px] font-bold">
            현재 입력하신 조건에 맞는 지원금을 찾지 못했어요
        </p>
        <div className="border-primary mx-auto mt-[25px] h-[216px] w-[302px] rounded-[20px] border-[0.5px] px-[21px] pt-6">
            <h3 className="text-[20px] font-bold">이런 이유일 수 있어요</h3>
            <ol className="text-text-muted mt-[15px] list-decimal space-y-[15px] pl-5 text-[13px] leading-normal font-bold">
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
            className="bg-primary mx-auto mt-[25px] block h-[55px] w-[302px] cursor-pointer rounded-[15px] text-[20px] font-bold text-white shadow-[3px_11px_8px_var(--color-green-light-active)] active:scale-[0.99]"
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
        <h2 className="text-[20px] font-bold">{title}</h2>
        <p className="text-text-muted mt-2 text-[13px] font-bold">
            {description}
        </p>
    </div>
);

export const SearchEmptyState = () => (
    <div
        className="mx-auto mt-[177px] flex w-full max-w-[341px] flex-col items-center gap-[34px] text-center"
        role="status"
    >
        <div className="bg-disabled flex size-[95px] items-center justify-center rounded-full text-white">
            <SearchIcon className="size-[39px]" />
        </div>
        <div className="flex w-full max-w-[313px] flex-col items-center gap-[15px]">
            <h2 className="text-[24px] leading-none font-bold">
                검색 내역이 없어요
            </h2>
            <p className="text-text-muted text-[20px] leading-normal font-semibold">
                단어의 철자나 띄어쓰기가 맞는지
                <br />
                다시 확인해 주세요
            </p>
        </div>
    </div>
);

export const FavoriteEmptyState = () => (
    <div
        className="mx-auto mt-[169px] flex w-full max-w-[313px] flex-col items-center text-center"
        role="status"
    >
        <FavoriteStarIcon />
        <div className="mt-[45px] flex w-full flex-col gap-[15px]">
            <h2 className="text-[24px] leading-none font-bold">
                아직 즐겨찾기한 지원금이 없어요
            </h2>
            <p className="text-text-muted text-[20px] leading-normal font-semibold">
                마음에 드는 지원금을 담아보세요
            </p>
        </div>
    </div>
);

const FavoriteStarIcon = () => (
    <svg
        className="h-[63px] w-[66px]"
        viewBox="0 0 66 63"
        fill="none"
        aria-hidden="true"
    >
        <path
            d="M33.0016 53.9069L16.4462 62.5937C15.8609 62.9008 15.2013 63.0383 14.5419 62.9908C13.8824 62.9433 13.2495 62.7125 12.7145 62.3247C12.1796 61.9368 11.7641 61.4074 11.5149 60.7961C11.2657 60.1848 11.1928 59.5162 11.3045 58.8657L14.4653 40.4664L1.0707 27.4326C0.5969 26.9718 0.2617 26.3878 0.1032 25.7467C-0.0553 25.1056 -0.0308 24.433 0.1738 23.8051C0.3785 23.1771 0.7552 22.6189 1.2613 22.1936C1.7673 21.7683 2.3826 21.4929 3.0374 21.3986L21.5453 18.714L29.823 1.9735C30.1155 1.3812 30.5682 0.8824 31.1299 0.5336C31.6917 0.1849 32.34 0 33.0016 0C33.6631 0 34.3115 0.1849 34.8732 0.5336C35.435 0.8824 35.8877 1.3812 36.1801 1.9735L44.4579 18.714L62.9658 21.4021C63.6198 21.4969 64.2343 21.7724 64.7397 22.1975C65.2451 22.6226 65.6214 23.1803 65.826 23.8076C66.0306 24.4349 66.0553 25.1068 65.8974 25.7474C65.7395 26.3879 65.4053 26.9717 64.9324 27.4326L51.5343 40.4664L54.6952 58.8657C54.8063 59.5157 54.7333 60.1837 54.4842 60.7945C54.2352 61.4052 53.82 61.9343 53.2857 62.322C52.7513 62.7097 52.119 62.9406 51.4602 62.9886C50.8013 63.0366 50.1421 62.8998 49.557 62.5937L33.0016 53.9069Z"
            fill="var(--color-disabled)"
        />
    </svg>
);
