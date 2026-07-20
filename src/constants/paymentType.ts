/*
 * 지급 방식(paymentType) 표기 규칙입니다.
 * 홈 추천 카드, 지원금 목록, 상세 화면이 같은 라벨을 쓰도록 한 곳에서 관리합니다.
 */

import type { PaymentType } from "@/types/estimated";

export const paymentTypeLabels: Record<PaymentType, string> = {
    CASH: "현금",
    MONTHLY: "월 지급",
    VOUCHER: "바우처",
    IN_KIND: "현물",
    REDUCTION: "감면",
    UNKNOWN: "금액 미확정",
};

/** 금액이 아니라 바우처·현물 형태로 지급되는 유형입니다. */
export const NON_CASH_PAYMENT_TYPES: PaymentType[] = [
    "VOUCHER",
    "IN_KIND",
    "REDUCTION",
];

export const isNonCashPayment = (paymentType: PaymentType) =>
    NON_CASH_PAYMENT_TYPES.includes(paymentType);
