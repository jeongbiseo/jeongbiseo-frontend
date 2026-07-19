export type HomeViewState = "expected" | "confirmed" | "unconfirmed";

export interface HomeSummaryBadge {
    label: string;
}

export interface HomeSummary {
    eyebrow: string;
    value: string;
    description: string;
    highlight?: string;
    badges: HomeSummaryBadge[];
    referenceDate?: string;
    linkLabel: string;
}

export interface HomeRecommendation {
    id: number;
    organization: string;
    title: string;
    benefit: string;
    badge: string;
    badgeTone: "urgent" | "normal" | "voucher";
    deadline: string;
}

export interface HomeViewData {
    greetingName: string;
    heading: string;
    summary: HomeSummary;
    recommendations: HomeRecommendation[];
}

const cashRecommendations: HomeRecommendation[] = [
    {
        id: 1,
        organization: "고용노동부",
        title: "청년 구직활동 지원금",
        benefit: "300,000원",
        badge: "D-3",
        badgeTone: "urgent",
        deadline: "6.18 마감",
    },
    {
        id: 2,
        organization: "청년창업지원센터",
        title: "청년 창업 도약자금",
        benefit: "최대 3,000,000원",
        badge: "D-10",
        badgeTone: "normal",
        deadline: "6.25 마감",
    },
    {
        id: 3,
        organization: "국토교통부",
        title: "청년 월세 특별지원",
        benefit: "200,000원 / 월",
        badge: "D-12",
        badgeTone: "normal",
        deadline: "6.27 마감",
    },
];

const voucherRecommendations: HomeRecommendation[] = [
    {
        id: 4,
        organization: "고용노동부",
        title: "국민내일배움카드",
        benefit: "직업훈련비 지원",
        badge: "바우처",
        badgeTone: "voucher",
        deadline: "상시",
    },
    {
        id: 5,
        organization: "문화체육관광부",
        title: "문화누리카드 재충전",
        benefit: "문화·여가 이용권",
        badge: "바우처",
        badgeTone: "voucher",
        deadline: "상시",
    },
    cashRecommendations[2],
];

// API 연동 전 홈 화면의 상태별 UI를 확인하기 위한 임시 데이터입니다.
export const homeViewData: Record<HomeViewState, HomeViewData> = {
    expected: {
        greetingName: "아기삼자",
        heading: "이번 달 받을 수 있는 돈이에요",
        summary: {
            eyebrow: "이번 달 예상 수령 총액",
            value: "최대 1,240,000원",
            description: "신청 가능한 지원금을 기준으로 계산했어요",
            badges: [],
            linkLabel: "예상 금액 자세히 보기",
        },
        recommendations: cashRecommendations,
    },
    confirmed: {
        greetingName: "아기삼자",
        heading: "지금 신청 가능한 지원금을\n모아봤어요",
        summary: {
            eyebrow: "지금 신청 가능한 지원금",
            value: "12건",
            description: "금액 확정 3건",
            highlight: "합계 최대 500,000원",
            badges: [
                { label: "현금 3" },
                { label: "바우처·현물 7" },
                { label: "금액 미확정 2" },
            ],
            referenceDate:
                "2026.06.15 기준 · 조건 충족 시 확인 가능한 금액이에요",
            linkLabel: "지원금 살펴보기",
        },
        recommendations: cashRecommendations,
    },
    unconfirmed: {
        greetingName: "아기삼자",
        heading: "지금 신청 가능한 지원금을\n모아봤어요",
        summary: {
            eyebrow: "지금 신청 가능한 지원금",
            value: "8건",
            description: "금액 확정은 아직 없어요, 바우처·현물 지원 위주예요",
            badges: [
                { label: "현금 0" },
                { label: "바우처·현물 6" },
                { label: "금액 미확정 2" },
            ],
            referenceDate:
                "2026.06.15 기준 · 조건 충족 시 확인 가능한 금액이에요",
            linkLabel: "지원금 살펴보기",
        },
        recommendations: voucherRecommendations,
    },
};

export const homeCalendarData = {
    year: 2026,
    month: 6,
    selectedDay: 15,
    eventDays: new Set([5, 12, 18, 25, 27, 30]),
};
