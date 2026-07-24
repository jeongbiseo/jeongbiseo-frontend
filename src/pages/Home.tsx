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
import { HomeCalendarPreview } from "@/components/home/HomeCalendarPreview";
import {
    HomeCalendarError,
    HomeCalendarSkeleton,
    HomeRecommendationError,
    HomeRecommendationSkeleton,
    HomeSummaryError,
    HomeSummarySkeleton,
} from "@/components/home/HomeLoadState";
import {
    HomeRecommendationContent,
    HomeSection,
} from "@/components/home/HomeRecommendationSection";
import { HomeSummaryCard } from "@/components/home/HomeSummaryCard";
import { useAuthStore } from "@/stores/authStore";
import type { CalendarResult } from "@/types/calendar";
import type {
    EstimatedBreakdownResult,
    EstimatedTotalResult,
} from "@/types/estimated";
import type { RecommendationItem } from "@/types/recommendation";
import { useEffect, useState } from "react";

type SummaryData = {
    total: EstimatedTotalResult;
    breakdown: EstimatedBreakdownResult;
};

type RecommendationData = {
    recommendations: RecommendationItem[];
    recommendationDataUpdatedAt: string;
};

type SectionState<T> =
    { status: "loading" } | { status: "error" } | { status: "ready"; data: T };

const Home = () => {
    const user = useAuthStore((state) => state.user);
    const [summaryState, setSummaryState] = useState<SectionState<SummaryData>>(
        { status: "loading" }
    );
    const [recommendationState, setRecommendationState] = useState<
        SectionState<RecommendationData>
    >({ status: "loading" });
    const [calendarState, setCalendarState] = useState<
        SectionState<CalendarResult>
    >({ status: "loading" });
    const [selectedDate, setSelectedDate] = useState<string | null>(null);
    const [summaryReloadKey, setSummaryReloadKey] = useState(0);
    const [recommendationReloadKey, setRecommendationReloadKey] = useState(0);
    const [calendarReloadKey, setCalendarReloadKey] = useState(0);

    useEffect(() => {
        let active = true;

        const loadSummary = async () => {
            try {
                const [total, breakdown] = await Promise.all([
                    getEstimatedTotalApi(),
                    getEstimatedBreakdownApi(),
                ]);

                if (!active) return;

                if (!total.isSuccess || !breakdown.isSuccess) {
                    throw new Error("예상 지원금 조회에 실패했습니다.");
                }

                setSummaryState({
                    status: "ready",
                    data: {
                        total: total.result,
                        breakdown: breakdown.result,
                    },
                });
            } catch (error) {
                console.error(error);
                if (active) setSummaryState({ status: "error" });
            }
        };

        void loadSummary();

        return () => {
            active = false;
        };
    }, [summaryReloadKey]);

    useEffect(() => {
        let active = true;

        const loadRecommendations = async () => {
            try {
                const response = await getRecommendationsApi(3);

                if (!active) return;

                if (!response.isSuccess) {
                    throw new Error(response.message);
                }

                setRecommendationState({
                    status: "ready",
                    data: {
                        recommendations: response.result.items,
                        recommendationDataUpdatedAt:
                            response.result.dataUpdatedAt,
                    },
                });
            } catch (error) {
                console.error(error);
                if (active) setRecommendationState({ status: "error" });
            }
        };

        void loadRecommendations();

        return () => {
            active = false;
        };
    }, [recommendationReloadKey]);

    useEffect(() => {
        let active = true;

        const loadCalendar = async () => {
            const today = new Date();

            try {
                const response = await getCalendarApi(
                    today.getFullYear(),
                    today.getMonth() + 1
                );

                if (!active) return;

                if (!response.isSuccess) {
                    throw new Error(response.message);
                }

                setCalendarState({
                    status: "ready",
                    data: response.result,
                });
            } catch (error) {
                console.error(error);
                if (active) setCalendarState({ status: "error" });
            }
        };

        void loadCalendar();

        return () => {
            active = false;
        };
    }, [calendarReloadKey]);

    return (
        <main className="bg-surface-dim flex min-h-svh justify-center">
            <section className="bg-ground text-text-strong min-h-svh w-full max-w-[390px] px-5 pt-5 pb-[104px]">
                <header className="px-[7px]">
                    <p className="text-text-muted text-[16px] leading-normal font-bold">
                        {user?.name ?? "회원"}님, 반가워요
                    </p>
                    <h1 className="mt-[10px] text-[24px] leading-[1.25] font-bold whitespace-pre-line">
                        {"지금 신청 가능한 지원금을\n모아봤어요"}
                    </h1>
                </header>

                {summaryState.status === "loading" && <HomeSummarySkeleton />}
                {summaryState.status === "error" && (
                    <HomeSummaryError
                        onRetry={() => {
                            setSummaryState({ status: "loading" });
                            setSummaryReloadKey((key) => key + 1);
                        }}
                    />
                )}
                {summaryState.status === "ready" && (
                    <div className="content-fade-in">
                        <HomeSummaryCard
                            total={summaryState.data.total}
                            breakdown={summaryState.data.breakdown}
                        />
                    </div>
                )}

                <HomeSection
                    className="mt-[37px]"
                    title="AI 추천 지원금"
                    linkLabel="전체보기"
                    to="/recommend"
                >
                    {recommendationState.status === "loading" && (
                        <HomeRecommendationSkeleton />
                    )}
                    {recommendationState.status === "error" && (
                        <HomeRecommendationError
                            onRetry={() => {
                                setRecommendationState({ status: "loading" });
                                setRecommendationReloadKey((key) => key + 1);
                            }}
                        />
                    )}
                    {recommendationState.status === "ready" && (
                        <div className="content-fade-in">
                            <HomeRecommendationContent
                                recommendations={
                                    recommendationState.data.recommendations
                                }
                                dataUpdatedAt={
                                    recommendationState.data
                                        .recommendationDataUpdatedAt
                                }
                            />
                        </div>
                    )}
                </HomeSection>

                <HomeSection
                    className="mt-[37px]"
                    title="마감 캘린더"
                    linkLabel="자세히 보기"
                    to="/calendar"
                >
                    {calendarState.status === "loading" && (
                        <HomeCalendarSkeleton />
                    )}
                    {calendarState.status === "error" && (
                        <HomeCalendarError
                            onRetry={() => {
                                setSelectedDate(null);
                                setCalendarState({ status: "loading" });
                                setCalendarReloadKey((key) => key + 1);
                            }}
                        />
                    )}
                    {calendarState.status === "ready" && (
                        <div className="content-fade-in pt-2">
                            <HomeCalendarPreview
                                calendar={calendarState.data}
                                selectedDate={selectedDate}
                                onSelectDate={setSelectedDate}
                            />
                        </div>
                    )}
                </HomeSection>
            </section>

            {selectedDate && calendarState.status === "ready" && (
                <DeadlineSheet
                    date={selectedDate}
                    items={
                        calendarState.data.days.find(
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

export default Home;
