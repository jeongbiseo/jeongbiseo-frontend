/* 예상 수령액(EstimatedAmount) 관련 타입입니다. (백엔드 Swagger 기준) */

/** 지급 방식 */
export type PaymentType =
    "CASH" | "MONTHLY" | "VOUCHER" | "IN_KIND" | "REDUCTION" | "UNKNOWN";

/** GET /estimated-total — 홈 요약 카드용 */
export interface EstimatedTotalResult {
    /** 추천 대상 전체 건수 */
    totalCount: number;
    /** 금액이 확정된 현금성 지원금 건수 */
    itemCount: number;
    cashTotalMin: number | null;
    cashTotalMax: number | null;
    monthlyItemCount: number;
    monthlyTotalMin: number | null;
    monthlyTotalMax: number | null;
    /** 총액에서 제외된 항목 수 (바우처·현물 + 금액 미확정 합계) */
    separateBenefitCount: number;
    currency: string;
    isEstimate: boolean;
    notice: string;
}

export interface CashItem {
    subsidyId: number;
    name: string;
    amountMin: number;
    amountMax: number;
    paymentType: PaymentType;
    includedInTotal: boolean;
}

export interface MonthlyItem {
    subsidyId: number;
    name: string;
    monthlyAmountMin: number;
    monthlyAmountMax: number;
    paymentType: PaymentType;
}

export interface SeparateBenefit {
    subsidyId: number;
    name: string;
    paymentType: PaymentType;
    note: string;
}

/** GET /estimated-total/breakdown — 예상 수령액 상세 */
export interface EstimatedBreakdownResult {
    cashTotalMin: number;
    cashTotalMax: number;
    monthlyTotalMin: number;
    monthlyTotalMax: number;
    currency: string;
    isEstimate: boolean;
    items: CashItem[];
    monthlyItems: MonthlyItem[];
    separateBenefits: SeparateBenefit[];
}
