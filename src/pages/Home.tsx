import {
    homeCalendarData,
    homeViewData,
    type HomeRecommendation,
    type HomeSummary,
    type HomeViewState,
} from "@/constants/homeData";
import type { ReactNode } from "react";
import { Link, useSearchParams } from "react-router-dom";

const getHomeViewState = (value: string | null): HomeViewState => {
    if (value === "expected" || value === "unconfirmed") return value;
    return "confirmed";
};

const Home = () => {
    const [searchParams] = useSearchParams();
    // API 연동 전에는 ?homeState=expected|unconfirmed 로 상태별 화면을 확인합니다.
    const viewState = getHomeViewState(searchParams.get("homeState"));
    const data = homeViewData[viewState];

    return (
        <main className="bg-surface-dim flex min-h-svh justify-center">
            <section className="bg-ground text-text-strong min-h-svh w-full max-w-[390px] px-5 pt-[69px] pb-[104px]">
                <header className="px-[7px]">
                    <p className="text-text-muted text-[16px] leading-normal font-bold">
                        {data.greetingName}님, 반가워요
                    </p>
                    <h1 className="mt-[10px] text-[24px] leading-[1.25] font-bold whitespace-pre-line">
                        {data.heading}
                    </h1>
                </header>

                <SummaryCard
                    summary={data.summary}
                    compact={viewState === "expected"}
                    linkTo={
                        viewState === "expected"
                            ? "/expected-amount"
                            : "/available-policies"
                    }
                />

                <HomeSection
                    className="mt-[37px]"
                    title="AI 추천 지원금"
                    linkLabel="전체보기"
                    to="/recommend"
                >
                    <div className="ml-auto flex w-[312px] flex-col gap-[18px]">
                        {data.recommendations.map((recommendation) => (
                            <RecommendationCard
                                key={recommendation.id}
                                recommendation={recommendation}
                            />
                        ))}
                    </div>
                </HomeSection>

                <HomeSection
                    className="mt-[37px]"
                    title="마감 캘린더"
                    linkLabel="자세히 보기"
                    to="/calendar"
                >
                    <div className="pt-2">
                        <CalendarPreview />
                    </div>
                </HomeSection>
            </section>
        </main>
    );
};

const SummaryCard = ({
    summary,
    compact,
    linkTo,
}: {
    summary: HomeSummary;
    compact: boolean;
    linkTo: string;
}) => (
    <article
        className={`bg-primary relative mx-auto w-[324px] overflow-hidden rounded-[30px] px-[19px] text-white ${compact ? "mt-4 h-[184px] pt-[27px]" : "mt-[18px] h-[262px] pt-7"}`}
    >
        <SummaryDecoration />

        <div className="relative z-10">
            <p className="text-[16px] leading-normal font-bold">
                {summary.eyebrow}
            </p>
            <p className="mt-[13px] text-[36px] leading-normal font-bold tracking-[-0.02em]">
                {summary.value}
            </p>

            {compact ? (
                <>
                    <p className="mt-4 text-[13px] font-medium">
                        {summary.description}
                    </p>
                    <SummaryLink
                        label={summary.linkLabel}
                        className="mt-[13px]"
                        to={linkTo}
                    />
                </>
            ) : (
                <>
                    <div className="mt-[13px] flex items-center gap-3 text-[13px] font-bold">
                        <span>{summary.description}</span>
                        {summary.highlight && (
                            <span className="rounded-full bg-[#32e5a9] px-2 py-[5px]">
                                {summary.highlight}
                            </span>
                        )}
                    </div>

                    <div className="mt-[13px] flex items-center gap-[14px]">
                        {summary.badges.map(({ label }) => (
                            <span
                                className="rounded-full bg-[#32e5a9] px-2 py-[5px] text-[12px] leading-none font-bold"
                                key={label}
                            >
                                {label}
                            </span>
                        ))}
                    </div>

                    {summary.referenceDate && (
                        <p className="mt-[11px] text-[11px] leading-none font-medium">
                            {summary.referenceDate}
                        </p>
                    )}
                    <SummaryLink
                        label={summary.linkLabel}
                        className="mt-[13px]"
                        to={linkTo}
                    />
                </>
            )}
        </div>
    </article>
);

const SummaryDecoration = () => (
    <div className="pointer-events-none absolute inset-0" aria-hidden="true">
        <span className="absolute -top-[58px] right-6 size-[118px] rounded-full bg-white/[0.08] blur-[2px]" />
        <span className="absolute top-0 -left-[141px] h-[280px] w-[254px] rounded-[50%] bg-white/[0.05]" />
        <span className="absolute right-[-37px] bottom-[-24px] size-[161px] rounded-full bg-white/[0.08]" />
    </div>
);

const SummaryLink = ({
    label,
    className,
    to,
}: {
    label: string;
    className: string;
    to: string;
}) => (
    <Link
        className={`flex w-fit items-center gap-[5px] text-[13px] leading-none font-bold ${className}`}
        to={to}
    >
        {label}
        <span aria-hidden="true">→</span>
    </Link>
);

const HomeSection = ({
    title,
    linkLabel,
    to,
    className,
    children,
}: {
    title: string;
    linkLabel: string;
    to: string;
    className?: string;
    children: ReactNode;
}) => (
    <section className={`ml-[7px] w-[328px] ${className ?? ""}`}>
        <div className="flex items-center justify-between">
            <h2 className="text-[24px] leading-normal font-bold">{title}</h2>
            <Link
                className="text-text-muted text-[16px] leading-none font-bold"
                to={to}
            >
                {linkLabel}
            </Link>
        </div>
        <div className="mt-[18px]">{children}</div>
    </section>
);

const badgeClassNames: Record<HomeRecommendation["badgeTone"], string> = {
    urgent: "bg-danger-light text-danger",
    normal: "bg-green-light text-success",
    voucher: "bg-[#fff1d8] text-warning",
};

const RecommendationCard = ({
    recommendation,
}: {
    recommendation: HomeRecommendation;
}) => (
    <article className="border-primary relative h-[107px] rounded-[20px] border-[0.5px] bg-white px-[21px] py-[15px]">
        <div className="pr-[76px]">
            <p className="text-text-subtle text-[13px] leading-none font-bold">
                {recommendation.organization}
            </p>
            <h3 className="mt-[6px] truncate text-[16px] leading-none font-bold">
                {recommendation.title}
            </h3>
            <p className="text-success mt-[15px] truncate text-[16px] leading-none font-bold">
                {recommendation.benefit}
            </p>
        </div>

        <span
            className={`absolute top-[15px] right-[21px] rounded-[13px] px-[7px] py-[6px] text-[13px] leading-none font-bold ${badgeClassNames[recommendation.badgeTone]}`}
        >
            {recommendation.badge}
        </span>
        <span className="text-text-muted absolute right-[21px] bottom-[16px] text-[13px] leading-none font-medium">
            {recommendation.deadline}
        </span>
    </article>
);

const WEEK_DAYS = ["일", "월", "화", "수", "목", "금", "토"];
const CALENDAR_DAYS = [
    { day: 31, muted: true },
    ...Array.from({ length: 30 }, (_, index) => ({
        day: index + 1,
        muted: false,
    })),
    ...Array.from({ length: 4 }, (_, index) => ({
        day: index + 1,
        muted: true,
    })),
];

const CalendarPreview = () => (
    <article className="mx-auto h-[267px] w-[307px] rounded-[20px] bg-white px-4 pt-4 shadow-[0_4px_12px_rgba(0,0,0,0.08)]">
        <header className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-[13px] font-bold">
                <span>{homeCalendarData.year}년</span>
                <span>{homeCalendarData.month}월</span>
            </div>
            <div
                className="flex gap-3 text-[18px] leading-none font-bold"
                aria-hidden="true"
            >
                <span>‹</span>
                <span>›</span>
            </div>
        </header>

        <div className="text-text-muted mt-[13px] grid grid-cols-7 text-center text-[13px] leading-none font-bold">
            {WEEK_DAYS.map((day) => (
                <span key={day}>{day}</span>
            ))}
        </div>

        <div className="mt-[5px] grid grid-cols-7">
            {CALENDAR_DAYS.map(({ day, muted }, index) => {
                const selected = !muted && day === homeCalendarData.selectedDay;
                const hasEvent = !muted && homeCalendarData.eventDays.has(day);

                return (
                    <div
                        className={`relative flex h-[36.8px] items-center justify-center rounded-full text-[13px] font-bold ${muted ? "text-text-strong/15" : selected ? "bg-text-strong text-white" : "text-text-strong"}`}
                        key={`${muted ? "outside" : "current"}-${day}-${index}`}
                    >
                        <span>{day}</span>
                        {hasEvent && !selected && (
                            <span className="bg-primary absolute bottom-[4px] size-[4.8px] rounded-full" />
                        )}
                    </div>
                );
            })}
        </div>
    </article>
);

export default Home;
