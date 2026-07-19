export interface CalendarPolicy {
    id: number;
    organization: string;
    title: string;
    deadline: Date;
}

export const createInitialCalendarDate = () => new Date(2026, 5, 15);
export const createInitialCalendarMonth = () => new Date(2026, 5, 1);
export const createCalendarReferenceDate = () => new Date(2026, 5, 15);

// API 연동 전 캘린더의 마감 마커와 목록 동작을 확인하기 위한 임시 데이터입니다.
export const calendarPolicies: CalendarPolicy[] = [
    {
        id: 1,
        organization: "보건복지부",
        title: "청년 마음건강 지원사업",
        deadline: new Date(2026, 5, 5),
    },
    {
        id: 2,
        organization: "서울특별시",
        title: "청년 교통비 지원",
        deadline: new Date(2026, 5, 12),
    },
    {
        id: 3,
        organization: "고용노동부",
        title: "청년 구직활동 지원금",
        deadline: new Date(2026, 5, 18),
    },
    {
        id: 4,
        organization: "청년창업지원센터",
        title: "청년 창업 도약자금",
        deadline: new Date(2026, 5, 25),
    },
    {
        id: 5,
        organization: "국토교통부",
        title: "청년 월세 특별지원",
        deadline: new Date(2026, 5, 27),
    },
    {
        id: 6,
        organization: "중소벤처기업부",
        title: "초기창업패키지",
        deadline: new Date(2026, 5, 30),
    },
    {
        id: 7,
        organization: "서울주택도시공사",
        title: "청년안심주택 입주자 모집",
        deadline: new Date(2026, 5, 30),
    },
];

export const formatCalendarDateKey = (date: Date) =>
    [
        date.getFullYear(),
        String(date.getMonth() + 1).padStart(2, "0"),
        String(date.getDate()).padStart(2, "0"),
    ].join("-");

export const calendarDeadlineCount = calendarPolicies.reduce<
    Record<string, number>
>((counts, policy) => {
    const key = formatCalendarDateKey(policy.deadline);
    counts[key] = (counts[key] ?? 0) + 1;
    return counts;
}, {});
