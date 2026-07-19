export interface RecommendationPolicy {
    id: number;
    organization: string;
    title: string;
    amount: number | null;
    amountLabel: string | null;
    deadlineDays: number | null;
    deadlineLabel: string;
    isFavorite: boolean;
    isRecommended: boolean;
    isReceived: boolean;
}

export const isUrgentRecommendationPolicy = (policy: RecommendationPolicy) =>
    policy.deadlineDays !== null &&
    policy.deadlineDays >= 0 &&
    policy.deadlineDays <= 7 &&
    policy.amount !== null;

// API 연동 전 추천 화면 동작 확인을 위한 임시 데이터입니다.
export const initialRecommendationPolicies: RecommendationPolicy[] = [
    {
        id: 1,
        organization: "고용노동부",
        title: "청년 구직활동 지원금",
        amount: 300000,
        amountLabel: "300,000원",
        deadlineDays: 3,
        deadlineLabel: "D-3",
        isFavorite: true,
        isRecommended: true,
        isReceived: false,
    },
    {
        id: 2,
        organization: "국토교통부",
        title: "청년 월세 특별지원",
        amount: 200000,
        amountLabel: "200,000원 / 월",
        deadlineDays: 12,
        deadlineLabel: "D-12",
        isFavorite: true,
        isRecommended: true,
        isReceived: false,
    },
    {
        id: 3,
        organization: "보건복지부",
        title: "청년 마음건강 바우처",
        amount: null,
        amountLabel: null,
        deadlineDays: null,
        deadlineLabel: "마감일 미정",
        isFavorite: false,
        isRecommended: true,
        isReceived: false,
    },
    {
        id: 4,
        organization: "보건복지부",
        title: "청년내일저축계좌",
        amount: 14400000,
        amountLabel: "최대 1,440만원(만기시)",
        deadlineDays: 15,
        deadlineLabel: "D-15",
        isFavorite: false,
        isRecommended: false,
        isReceived: true,
    },
    {
        id: 5,
        organization: "고용노동부",
        title: "국민내일배움카드",
        amount: 5000000,
        amountLabel: "최대 5,000,000원",
        deadlineDays: null,
        deadlineLabel: "상시",
        isFavorite: false,
        isRecommended: false,
        isReceived: false,
    },
    {
        id: 6,
        organization: "중소벤처기업부",
        title: "재도전성공패키지",
        amount: 100000000,
        amountLabel: "최대 100,000,000원",
        deadlineDays: null,
        deadlineLabel: "상세 확인 필요",
        isFavorite: false,
        isRecommended: false,
        isReceived: false,
    },
    {
        id: 7,
        organization: "보건복지부",
        title: "첫만남이용권 바우처",
        amount: 500000,
        amountLabel: "최대 500,000원",
        deadlineDays: null,
        deadlineLabel: "마감일 미정",
        isFavorite: false,
        isRecommended: false,
        isReceived: false,
    },
];
