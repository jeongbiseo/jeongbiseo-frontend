import { isNonCashPayment } from "@/constants/paymentType";
import type { SeparateBenefit } from "@/types/estimated";

/**
 * 총액에서 제외된 혜택을 화면 표시 기준으로 분류합니다.
 *
 * 바우처·현물·감면은 비현금 혜택으로, 그 외 CASH·MONTHLY·UNKNOWN은
 * 금액이나 지급 단위를 확정할 수 없는 혜택으로 표시합니다.
 */
export const classifySeparateBenefits = (items: SeparateBenefit[]) => ({
    voucherLike: items.filter(({ paymentType }) =>
        isNonCashPayment(paymentType)
    ),
    unconfirmed: items.filter(
        ({ paymentType }) => !isNonCashPayment(paymentType)
    ),
});
