export interface PolicyDetailRow {
    label: string;
    value: string;
}

export interface PolicyDetailSection {
    id: "eligibility" | "application" | "amount";
    title: string;
    rows: PolicyDetailRow[];
    note?: string;
}

export interface PolicyDetail {
    id: number;
    title: string;
    organization: string;
    category: string;
    deadlineLabel: string;
    tags: string[];
    applicationProvider: string;
    applicationUrl: string;
    sections: PolicyDetailSection[];
}

interface PolicyDetailSeed {
    id: number;
    title: string;
    organization: string;
    category: string;
    deadlineLabel: string;
    deadline: string;
    tags: string[];
    amount: string;
    duration?: string;
    total?: string;
}

const createPolicyDetail = (seed: PolicyDetailSeed): PolicyDetail => ({
    ...seed,
    applicationProvider: `복지로(${seed.organization})`,
    applicationUrl: "https://www.bokjiro.go.kr",
    sections: [
        {
            id: "eligibility",
            title: "자격조건",
            rows: [
                { label: "연령", value: "만 19~34세" },
                { label: "거주지", value: "전국 (일부 지역 우선)" },
                { label: "고용상태", value: "재직·구직·프리랜서" },
                { label: "소득기준", value: "기준 중위소득 60% 이하" },
            ],
        },
        {
            id: "application",
            title: "마감일 및 담당기관",
            rows: [
                { label: "신청 마감", value: seed.deadline },
                { label: "담당기관", value: seed.organization },
                { label: "신청 방법", value: "온라인 (복지로)" },
            ],
        },
        {
            id: "amount",
            title: "예상 수령액",
            rows: [
                { label: "월 지원금", value: seed.amount },
                { label: "지원 기간", value: seed.duration ?? "사업별 상이" },
                { label: "예상 총액", value: seed.total ?? seed.amount },
            ],
            note: "일부 항목은 개인 상황에 따라 산정이 어려울 수 있습니다.",
        },
    ],
});

const policyDetailSeeds: PolicyDetailSeed[] = [
    {
        id: 1,
        title: "청년 구직활동 지원금",
        organization: "고용노동부",
        category: "취업지원",
        deadlineLabel: "마감 D-3",
        deadline: "2026년 06월 18일",
        tags: ["청년", "취업"],
        amount: "최대 30만원",
        duration: "최대 6개월",
        total: "최대 180만원",
    },
    {
        id: 2,
        title: "청년 월세 특별지원",
        organization: "국토교통부",
        category: "주거지원",
        deadlineLabel: "마감 D-12",
        deadline: "2026년 06월 27일",
        tags: ["청년", "주거"],
        amount: "최대 20만원",
        duration: "최대 12개월",
        total: "최대 240만원",
    },
    {
        id: 3,
        title: "청년 마음건강 바우처",
        organization: "보건복지부",
        category: "건강지원",
        deadlineLabel: "마감일 미정",
        deadline: "추후 공고",
        tags: ["청년", "건강"],
        amount: "개인별 상이",
    },
    {
        id: 4,
        title: "청년 창업 도약자금",
        organization: "청년창업지원센터",
        category: "창업지원",
        deadlineLabel: "마감 D-10",
        deadline: "2026년 06월 25일",
        tags: ["청년", "창업"],
        amount: "최대 300만원",
    },
    {
        id: 5,
        title: "국민내일배움카드",
        organization: "고용노동부",
        category: "교육지원",
        deadlineLabel: "상시",
        deadline: "상시 신청",
        tags: ["교육", "취업"],
        amount: "최대 500만원",
    },
    {
        id: 6,
        title: "재도전성공패키지",
        organization: "중소벤처기업부",
        category: "창업지원",
        deadlineLabel: "상세 확인",
        deadline: "공고별 상이",
        tags: ["창업", "재도전"],
        amount: "최대 1억원",
    },
    {
        id: 7,
        title: "첫만남이용권 바우처",
        organization: "보건복지부",
        category: "출산지원",
        deadlineLabel: "마감일 미정",
        deadline: "출생일 기준 확인",
        tags: ["출산", "육아"],
        amount: "최대 50만원",
    },
    {
        id: 8,
        title: "청년 교통비 지원",
        organization: "서울특별시",
        category: "교통지원",
        deadlineLabel: "마감",
        deadline: "2026년 06월 12일",
        tags: ["청년", "교통"],
        amount: "최대 10만원",
    },
    {
        id: 9,
        title: "초기창업패키지",
        organization: "중소벤처기업부",
        category: "창업지원",
        deadlineLabel: "마감 D-15",
        deadline: "2026년 06월 30일",
        tags: ["청년", "창업"],
        amount: "사업별 상이",
    },
    {
        id: 10,
        title: "청년안심주택 입주자 모집",
        organization: "서울주택도시공사",
        category: "주거지원",
        deadlineLabel: "마감 D-15",
        deadline: "2026년 06월 30일",
        tags: ["청년", "주거"],
        amount: "소득구간별 상이",
    },
];

export const policyDetailData = Object.fromEntries(
    policyDetailSeeds.map((seed) => {
        const detail = createPolicyDetail(seed);
        return [detail.id, detail];
    })
) as Partial<Record<number, PolicyDetail>>;
