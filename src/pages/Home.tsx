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
import { HomeErrorState, HomeSkeleton } from "@/components/home/HomeLoadState";
import {
    HomeRecommendationSection,
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

type HomeData = {
    total: EstimatedTotalResult;
    breakdown: EstimatedBreakdownResult;
    recommendations: RecommendationItem[];
    recommendationDataUpdatedAt: string;
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
                        recommendationDataUpdatedAt:
                            recommendations.result.dataUpdatedAt,
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
            <section className="bg-ground text-text-strong min-h-svh w-full max-w-[390px] px-5 pt-5 pb-[104px]">
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
                    <HomeErrorState
                        onRetry={() => {
                            setState({ status: "loading" });
                            setReloadKey((key) => key + 1);
                        }}
                    />
                )}

                {state.status === "ready" && (
                    <div className="content-fade-in">
                        <HomeSummaryCard
                            total={state.data.total}
                            breakdown={state.data.breakdown}
                        />

                        <HomeRecommendationSection
                            recommendations={state.data.recommendations}
                            dataUpdatedAt={
                                state.data.recommendationDataUpdatedAt
                            }
                        />

                        <HomeSection
                            className="mt-[37px]"
                            title="마감 캘린더"
                            linkLabel="자세히 보기"
                            to="/calendar"
                        >
                            <div className="pt-2">
                                <HomeCalendarPreview
                                    calendar={state.data.calendar}
                                    selectedDate={selectedDate}
                                    onSelectDate={setSelectedDate}
                                />
                            </div>
                        </HomeSection>
                    </div>
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

export default Home;
