/* AI 추천 지원금 관련 타입입니다. (백엔드 Swagger 기준) */

import type { PaymentType } from "@/types/estimated";

/** GET /recommendations 항목입니다. */
export interface RecommendationItem {
    subsidyId: number;
    name: string;
    agency: string;
    /** 지급 방식. 현금성이 아니면 바우처·현물 등으로 표기합니다. */
    paymentType: PaymentType;
    /** YYYY-MM-DD, 상시/마감없음이면 null */
    deadline: string | null;
    /** 마감까지 남은 일수, 마감일이 없으면 null */
    dDay: number | null;
    eligibilitySummary: string | null;
    estimatedAmountMin: number | null;
    estimatedAmountMax: number | null;
    matchScore: number;
    /** 금액 산정이 불가한 경우 true */
    uncomputable: boolean;
    uncomputableReasons: string[];
}

/** GET /recommendations 응답 */
export interface RecommendationResult {
    items: RecommendationItem[];
    dataUpdatedAt: string;
}
