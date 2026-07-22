/*
 * 홈 페이지 ('/')입니다.
 *
 * 다음 API를 조합해 화면을 구성합니다.
 * - GET /estimated-total            요약 카드(건수·합계 금액)
 * - GET /estimated-total/breakdown  배지 분리(바우처·현물 / 금액 미확정)
 * - GET /recommendations            AI 추천 미리보기 3건
 * - GET /calendar                   마감 캘린더 미리보기
 *
 * 사용자 이름은 앱 부팅 시 저장된 authStore의 user를 사용합니다.
 * 요약 카드는 금액이 확정된 현금 지원금(itemCount) 유무로 두 가지 문구를 보여줍니다.
 */

import {
    getEstimatedBreakdownApi,
    getEstimatedTotalApi,
} from "@/api/estimatedApi";
import { getCalendarApi } from "@/api/calendarApi";
import { getRecommendationsApi } from "@/api/recommendationApi";
import DeadlineSheet from "@/components/calendar/DeadlineSheet";
import Button from "@/components/common/Button";
import { RecommendationAssessment } from "@/components/recommendation/RecommendationAssessment";
import { isNonCashPayment, paymentTypeLabels } from "@/constants/paymentType";
import { useAuthStore } from "@/stores/authStore";
import type { CalendarResult } from "@/types/calendar";
import type {
    EstimatedBreakdownResult,
    EstimatedTotalResult,
} from "@/types/estimated";
import type { RecommendationItem } from "@/types/recommendation";
import {
    formatAmountRange,
    formatDDay,
    formatDeadline,
    formatWon,
} from "@/utils/format";
import { useEffect, useState, type ReactNode } from "react";
import { Link } from "react-router-dom";

type HomeData = {
    total: EstimatedTotalResult;
    breakdown: EstimatedBreakdownResult;
    recommendations: RecommendationItem[];
    calendar: CalendarResult | null;
};

type HomeState =
    | { status: "loading" }
    | { status: "error" }
    | { status: "ready"; data: HomeData };

const Home = () => {
    const user = useAuthStore((state) => state.user);
    const [state, setState] = useState<HomeState>({ status: "loading" });
    const [selectedDate, setSelectedDate] = useState<string | null>(null);
    const [reloadKey, setReloadKey] = useState(0);

    useEffect(() => {
        let active = true;

        const load = async () => {
            const today = new Date();

            try {
                const [total, breakdown, recommendations] = await Promise.all([
                    getEstimatedTotalApi(),
                    getEstimatedBreakdownApi(),
                    getRecommendationsApi(3),
                ]);

                // 캘린더는 실패해도 홈 전체가 막히지 않도록 따로 처리합니다.
                const calendar = await getCalendarApi(
                    today.getFullYear(),
                    today.getMonth() + 1
                ).catch(() => null);

                if (!active) return;

                if (
                    !total.isSuccess ||
                    !breakdown.isSuccess ||
                    !recommendations.isSuccess
                ) {
                    setState({ status: "error" });
                    return;
                }

                setState({
                    status: "ready",
                    data: {
                        total: total.result,
                        breakdown: breakdown.result,
                        recommendations: recommendations.result.items,
                        calendar: calendar?.isSuccess ? calendar.result : null,
                    },
                });
            } catch {
                if (active) setState({ status: "error" });
            }
        };

        void load();

        return () => {
            active = false;
        };
    }, [reloadKey]);

    return (
        <main className="bg-surface-dim flex min-h-svh justify-center">
            <section className="bg-ground text-text-strong min-h-svh w-full max-w-[390px] px-5 pt-[69px] pb-[104px]">
                <header className="px-[7px]">
                    <p className="text-text-muted text-[16px] leading-normal font-bold">
                        {user?.name ?? "회원"}님, 반가워요
                    </p>
                    <h1 className="mt-[10px] text-[24px] leading-[1.25] font-bold whitespace-pre-line">
                        {"지금 신청 가능한 지원금을\n모아봤어요"}
                    </h1>
                </header>

                {state.status === "loading" && <HomeSkeleton />}

                {state.status === "error" && (
                    <div className="mt-10 text-center">
                        <p className="text-text-muted text-[14px] font-semibold">
                            정보를 불러오지 못했어요.
                        </p>
                        <Button
                            className="mt-5"
                            onClick={() => {
                                setState({ status: "loading" });
                                setReloadKey((key) => key + 1);
                            }}
                        >
                            다시 시도
                        </Button>
                    </div>
                )}

                {state.status === "ready" && (
                    <>
                        <SummaryCard
                            total={state.data.total}
                            breakdown={state.data.breakdown}
                        />

                        <HomeSection
                            className="mt-[37px]"
                            title="AI 추천 지원금"
                            linkLabel="전체보기"
                            to="/recommend"
                        >
                            <div className="ml-auto flex w-[312px] flex-col gap-[18px]">
                                {state.data.recommendations.map(
                                    (recommendation) => (
                                        <RecommendationCard
                                            key={recommendation.subsidyId}
                                            recommendation={recommendation}
                                        />
                                    )
                                )}
                                {state.data.recommendations.length === 0 && (
                                    <p className="text-text-muted py-6 text-center text-[13px] font-semibold">
                                        아직 조건에 맞는 지원금이 없어요
                                    </p>
                                )}
                            </div>
                        </HomeSection>

                        <HomeSection
                            className="mt-[37px]"
                            title="마감 캘린더"
                            linkLabel="자세히 보기"
                            to="/calendar"
                        >
                            <div className="pt-2">
                                <CalendarPreview
                                    calendar={state.data.calendar}
                                    selectedDate={selectedDate}
                                    onSelectDate={setSelectedDate}
                                />
                            </div>
                        </HomeSection>
                    </>
                )}
            </section>

            {selectedDate && state.status === "ready" && (
                <DeadlineSheet
                    date={selectedDate}
                    items={
                        state.data.calendar?.days.find(
                            ({ date }) => date === selectedDate
                        )?.items ?? []
                    }
                    bottomNavPath="/"
                    onClose={() => setSelectedDate(null)}
                />
            )}
        </main>
    );
};

const HomeSkeleton = () => (
    <div className="animate-pulse">
        <div className="bg-disabled mx-auto mt-[18px] h-[262px] w-[324px] rounded-[30px]" />
        <div className="mt-[37px] ml-[7px] flex w-[328px] flex-col gap-[18px]">
            <div className="bg-disabled h-[24px] w-[140px] rounded" />
            <div className="bg-disabled ml-auto h-[150px] w-[312px] rounded-[20px]" />
            <div className="bg-disabled ml-auto h-[150px] w-[312px] rounded-[20px]" />
        </div>
    </div>
);

/** 지급 방식별로 배지에 표시할 건수를 계산합니다. */
const countBadges = (breakdown: EstimatedBreakdownResult) => {
    const voucherLike = breakdown.separateBenefits.filter(({ paymentType }) =>
        ["VOUCHER", "IN_KIND", "REDUCTION"].includes(paymentType)
    ).length;
    const unknown = breakdown.separateBenefits.filter(
        ({ paymentType }) => paymentType === "UNKNOWN"
    ).length;

    return { voucherLike, unknown };
};

const SummaryCard = ({
    total,
    breakdown,
}: {
    total: EstimatedTotalResult;
    breakdown: EstimatedBreakdownResult;
}) => {
    const hasConfirmedAmount = total.itemCount > 0;
    const { voucherLike, unknown } = countBadges(breakdown);

    return (
        <article className="bg-primary relative mx-auto mt-[18px] h-[262px] w-[324px] overflow-hidden rounded-[30px] px-[19px] pt-7 text-white">
            <SummaryDecoration />

            <div className="relative z-10">
                <p className="text-[16px] leading-normal font-bold">
                    지금 신청 가능한 지원금
                </p>
                <p className="mt-[13px] text-[36px] leading-normal font-bold tracking-[-0.02em]">
                    {total.totalCount}건
                </p>

                <div className="mt-[13px] flex items-center gap-3 text-[13px] font-bold">
                    <span>
                        {hasConfirmedAmount
                            ? `금액 확정 ${total.itemCount}건`
                            : "금액 확정은 아직 없어요, 바우처·현물 지원 위주예요"}
                    </span>
                    {hasConfirmedAmount && total.cashTotalMax !== null && (
                        <span className="rounded-full bg-[#32e5a9] px-2 py-[5px] whitespace-nowrap">
                            합계 최대 {formatWon(total.cashTotalMax)}
                        </span>
                    )}
                </div>

                <div className="mt-[13px] flex items-center gap-[14px]">
                    {[
                        `현금 ${total.itemCount}`,
                        `바우처·현물 ${voucherLike}`,
                        `금액 미확정 ${unknown}`,
                    ].map((label) => (
                        <span
                            className="rounded-full bg-[#32e5a9] px-2 py-[5px] text-[12px] leading-none font-bold whitespace-nowrap"
                            key={label}
                        >
                            {label}
                        </span>
                    ))}
                </div>

                <p className="mt-[11px] text-[11px] leading-none font-medium">
                    {total.notice}
                </p>

                <Link
                    className="mt-[13px] flex w-fit items-center gap-[5px] text-[13px] leading-none font-bold"
                    to="/available-policies"
                >
                    지원금 살펴보기
                    <span aria-hidden="true">→</span>
                </Link>
            </div>
        </article>
    );
};

const SummaryDecoration = () => (
    <div className="pointer-events-none absolute inset-0" aria-hidden="true">
        <span className="absolute -top-[58px] right-6 size-[118px] rounded-full bg-white/[0.08] blur-[2px]" />
        <span className="absolute top-0 -left-[141px] h-[280px] w-[254px] rounded-[50%] bg-white/[0.05]" />
        <span className="absolute right-[-37px] bottom-[-24px] size-[161px] rounded-full bg-white/[0.08]" />
    </div>
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

const RecommendationCard = ({
    recommendation,
}: {
    recommendation: RecommendationItem;
}) => {
    // 바우처·현물성 지원금은 마감일 대신 지급 방식을 배지로 보여줍니다.
    const nonCash = isNonCashPayment(recommendation.paymentType);
    const isUrgent =
        recommendation.dDay !== null &&
        recommendation.dDay >= 0 &&
        recommendation.dDay <= 7;
    const badgeLabel = nonCash
        ? paymentTypeLabels[recommendation.paymentType]
        : formatDDay(recommendation.dDay);
    const badgeClassName =
        nonCash || recommendation.dDay === null
            ? "bg-warning-light text-warning"
            : isUrgent
              ? "bg-danger-light text-danger"
              : "bg-green-light text-success";

    return (
        <Link
            className="border-primary relative block min-h-[150px] rounded-[20px] border-[0.5px] bg-white px-[21px] py-[15px]"
            to={`/policies/${recommendation.subsidyId}`}
            state={{ bottomNavPath: "/" }}
        >
            <div className="pr-[76px]">
                <p className="text-text-subtle text-[13px] leading-none font-bold">
                    {recommendation.agency}
                </p>
                <h3 className="mt-[6px] truncate text-[16px] leading-none font-bold">
                    {recommendation.name}
                </h3>
                <RecommendationAssessment
                    className="mt-3"
                    confirmedMatchCount={recommendation.confirmedMatchCount}
                    unverifiedConditionCount={
                        recommendation.unverifiedConditionCount
                    }
                />
                {recommendation.uncomputable && (
                    <p className="text-warning mt-2 truncate text-[11px] leading-none font-semibold">
                        {recommendation.uncomputableReasons[0] ??
                            "세부 조건을 추가로 확인해주세요"}
                    </p>
                )}
                <p className="text-success mt-3 truncate text-[16px] leading-none font-bold">
                    {formatAmountRange(
                        recommendation.estimatedAmountMin,
                        recommendation.estimatedAmountMax
                    )}
                </p>
            </div>

            <span
                className={`absolute top-[15px] right-[21px] rounded-[13px] px-[7px] py-[6px] text-[13px] leading-none font-bold ${badgeClassName}`}
            >
                {badgeLabel}
            </span>
            {recommendation.deadline && (
                <span className="text-text-muted absolute right-[21px] bottom-[16px] text-[13px] leading-none font-medium">
                    {formatDeadline(recommendation.deadline)}
                </span>
            )}
        </Link>
    );
};

const WEEK_DAYS = ["일", "월", "화", "수", "목", "금", "토"];

/** 해당 월의 달력 셀(앞뒤 달 여백 포함)을 만듭니다. */
const buildMonthCells = (year: number, month: number) => {
    const startWeekday = new Date(year, month - 1, 1).getDay();
    const daysInMonth = new Date(year, month, 0).getDate();
    const prevMonthDays = new Date(year, month - 1, 0).getDate();

    const cells: { day: number; muted: boolean }[] = [];

    for (let index = startWeekday; index > 0; index -= 1) {
        cells.push({ day: prevMonthDays - index + 1, muted: true });
    }
    for (let day = 1; day <= daysInMonth; day += 1) {
        cells.push({ day, muted: false });
    }
    for (let day = 1; cells.length % 7 !== 0; day += 1) {
        cells.push({ day, muted: true });
    }

    return cells;
};

const CalendarPreview = ({
    calendar,
    selectedDate,
    onSelectDate,
}: {
    calendar: CalendarResult | null;
    selectedDate: string | null;
    onSelectDate: (date: string) => void;
}) => {
    const today = new Date();
    const year = calendar?.year ?? today.getFullYear();
    const month = calendar?.month ?? today.getMonth() + 1;
    const cells = buildMonthCells(year, month);

    // 마감이 있는 날짜만 모읍니다. (데이터가 없으면 점이 표시되지 않습니다)
    const eventDays = new Set(
        (calendar?.days ?? [])
            .filter(({ items }) => items.length > 0)
            .map(({ date }) => Number(date.split("-")[2]))
    );
    const isCurrentMonth =
        year === today.getFullYear() && month === today.getMonth() + 1;
    const toKey = (day: number) =>
        `${year}-${String(month).padStart(2, "0")}-${String(day).padStart(2, "0")}`;

    return (
        <article className="mx-auto h-[267px] w-[307px] rounded-[20px] bg-white px-4 pt-4 shadow-[0_4px_12px_rgba(0,0,0,0.08)]">
            <header className="flex items-center gap-2 text-[13px] font-bold">
                <span>{year}년</span>
                <span>{month}월</span>
            </header>

            <div className="text-text-muted mt-[13px] grid grid-cols-7 text-center text-[13px] leading-none font-bold">
                {WEEK_DAYS.map((day) => (
                    <span key={day}>{day}</span>
                ))}
            </div>

            <div className="mt-[5px] grid grid-cols-7">
                {cells.map(({ day, muted }, index) => {
                    const isToday =
                        !muted && isCurrentMonth && day === today.getDate();
                    const isSelected = !muted && selectedDate === toKey(day);
                    const hasEvent = !muted && eventDays.has(day);

                    return (
                        <button
                            className={`relative flex h-[36.8px] cursor-pointer items-center justify-center rounded-full text-[13px] font-bold ${
                                muted
                                    ? "text-text-strong/15"
                                    : isSelected
                                      ? "border-primary bg-green-light text-primary border"
                                      : isToday
                                        ? "bg-text-strong text-white"
                                        : "text-text-strong"
                            }`}
                            type="button"
                            disabled={muted}
                            key={`${muted ? "outside" : "current"}-${day}-${index}`}
                            onClick={() => onSelectDate(toKey(day))}
                        >
                            <span>{day}</span>
                            {hasEvent && !isToday && (
                                <span className="bg-primary absolute bottom-[4px] size-[4.8px] rounded-full" />
                            )}
                            {hasEvent && isToday && (
                                <span className="absolute bottom-[4px] size-[4.8px] rounded-full bg-white" />
                            )}
                        </button>
                    );
                })}
            </div>
        </article>
    );
};

export default Home;
