export interface SummaryPolicyItem {
    rowId: string;
    policyId: number;
    title: string;
    value: string;
    valueTone?: "success" | "muted" | "voucher";
}

export const expectedAmountData = {
    minimum: "800,000",
    maximum: "1,240,000원",
    notice: "중복수혜 확인이 필요해 범위로 안내해요",
    cash: [
        {
            rowId: "expected-cash-1",
            policyId: 1,
            title: "청년 구직활동 지원금",
            value: "300,000원",
        },
        {
            rowId: "expected-cash-2",
            policyId: 2,
            title: "청년 월세 특별 지원",
            value: "200,000원",
        },
    ] satisfies SummaryPolicyItem[],
    nonCash: [
        {
            rowId: "expected-non-cash-1",
            policyId: 3,
            title: "청년 마음건강 바우처",
            value: "최대 500,000원",
        },
    ] satisfies SummaryPolicyItem[],
};

export const availablePoliciesData = {
    totalCount: 12,
    confirmedCount: 3,
    confirmedMaximum: "500,000원",
    referenceDate: "2026.06.15 기준 · 조건 충족 시 확인 가능한 금액이에요",
    cash: [
        {
            rowId: "available-cash-1",
            policyId: 1,
            title: "청년 구직활동 지원금",
            value: "300,000원",
        },
        {
            rowId: "available-cash-2",
            policyId: 2,
            title: "청년 월세 특별 지원",
            value: "200,000원",
        },
        {
            rowId: "available-cash-3",
            policyId: 11,
            title: "근로장려금",
            value: "확정 금액 없음",
        },
    ] satisfies SummaryPolicyItem[],
    voucher: [
        {
            rowId: "available-voucher-1",
            policyId: 5,
            title: "국민내일배움카드",
            value: "바우처",
            valueTone: "voucher",
        },
        {
            rowId: "available-voucher-2",
            policyId: 12,
            title: "청년내일저축계좌",
            value: "적립매칭",
            valueTone: "voucher",
        },
        {
            rowId: "available-voucher-3",
            policyId: 13,
            title: "문화누리카드 재충전",
            value: "이용권",
            valueTone: "voucher",
        },
        {
            rowId: "available-voucher-4",
            policyId: 3,
            title: "청년 마음건강 바우처",
            value: "바우처",
            valueTone: "voucher",
        },
        {
            rowId: "available-voucher-5",
            policyId: 7,
            title: "첫만남이용권 바우처",
            value: "이용권",
            valueTone: "voucher",
        },
        {
            rowId: "available-voucher-6",
            policyId: 8,
            title: "청년 교통비 지원",
            value: "포인트",
            valueTone: "voucher",
        },
        {
            rowId: "available-voucher-7",
            policyId: 10,
            title: "청년안심주택 입주자 모집",
            value: "현물",
            valueTone: "voucher",
        },
    ] satisfies SummaryPolicyItem[],
    unconfirmed: [
        {
            rowId: "available-unconfirmed-1",
            policyId: 6,
            title: "재도전성공패키지",
            value: "심사 후 확정",
            valueTone: "muted",
        },
        {
            rowId: "available-unconfirmed-2",
            policyId: 2,
            title: "청년 월세 특별 지원",
            value: "기관별 상이",
            valueTone: "muted",
        },
    ] satisfies SummaryPolicyItem[],
};
