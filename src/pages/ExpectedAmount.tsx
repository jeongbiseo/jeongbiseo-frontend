import SummaryPolicyCard from "@/components/home/SummaryPolicyCard";
import {
    expectedAmountData,
    type SummaryPolicyItem,
} from "@/constants/homeSummaryData";

const ExpectedAmount = () => (
    <main className="bg-surface-dim flex min-h-svh justify-center">
        <section className="bg-ground text-text-strong min-h-svh w-full max-w-[390px] px-[18px] pt-[83px] pb-[96px]">
            <h1 className="ml-4 text-[24px] leading-normal font-bold">
                예상 수령액
            </h1>

            <article className="bg-primary relative mx-auto mt-[23px] h-[228px] w-[324px] overflow-hidden rounded-[30px] text-center text-white">
                <SummaryDecoration />
                <div className="relative z-10 pt-[27px]">
                    <p className="text-[20px] leading-normal font-bold">
                        이번 달 예상 수령 총액
                    </p>
                    <p className="mt-[10px] text-[48px] leading-none font-bold tracking-[-0.04em]">
                        <span className="block">
                            {expectedAmountData.minimum} ~
                        </span>
                        <span className="mt-1 block">
                            {expectedAmountData.maximum}
                        </span>
                    </p>
                    <p className="mt-[10px] text-[13px] leading-normal font-bold text-[#e9ebf8]">
                        {expectedAmountData.notice}
                    </p>
                </div>
            </article>

            <PolicySection
                className="mt-[40px]"
                title="현금성 지원"
                items={expectedAmountData.cash}
            />
            <PolicySection
                className="mt-[40px]"
                title="비현금성 지원(교육이용권 / 지역상품권 등)"
                items={expectedAmountData.nonCash}
            />
        </section>
    </main>
);

const SummaryDecoration = () => (
    <div className="pointer-events-none absolute inset-0" aria-hidden="true">
        <span className="absolute top-[-61px] left-[190px] size-[110px] rounded-full border-[7px] border-white/10" />
        <span className="absolute top-[2px] left-[-65px] h-[226px] w-[182px] rounded-[50%] border-[8px] border-white/[0.08]" />
        <span className="absolute top-[92px] left-[223px] size-[161px] rounded-full border-[7px] border-white/10" />
    </div>
);

const PolicySection = ({
    title,
    items,
    className,
}: {
    title: string;
    items: SummaryPolicyItem[];
    className?: string;
}) => (
    <section className={className}>
        <h2 className="text-text-muted text-[18px] leading-normal font-bold">
            {title}
        </h2>
        {items.length > 0 ? (
            <div className="mx-auto mt-[19px] flex w-[328px] flex-col gap-[19px]">
                {items.map((item) => (
                    <SummaryPolicyCard item={item} key={item.rowId} />
                ))}
            </div>
        ) : (
            <p className="text-text-muted mt-5 text-center text-[14px]">
                표시할 지원금이 없습니다.
            </p>
        )}
    </section>
);

export default ExpectedAmount;
