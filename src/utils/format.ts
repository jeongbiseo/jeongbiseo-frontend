/*
 * 화면 표시용 포맷 유틸입니다.
 * 금액·마감일 표기 규칙을 한 곳에 모아 화면 간 표기가 어긋나지 않게 합니다.
 */

const numberFormatter = new Intl.NumberFormat("ko-KR");

/** 1234567 → "1,234,567원" */
export const formatWon = (amount: number) =>
    `${numberFormatter.format(amount)}원`;

/**
 * 금액 범위를 카드에 표시할 문구로 만듭니다.
 * - 값이 없으면 "금액 미확정"
 * - 최소·최대가 같으면 "300,000원"
 * - 다르면 "최대 3,000,000원"
 */
export const formatAmountRange = (
    min: number | null,
    max: number | null,
    suffix = ""
) => {
    if (min === null && max === null) return "금액 미확정";

    const lower = min ?? max;
    const upper = max ?? min;
    if (lower === null || upper === null) return "금액 미확정";

    return lower === upper
        ? `${formatWon(upper)}${suffix}`
        : `최대 ${formatWon(upper)}${suffix}`;
};

/** "2026-06-18" → "6.18 마감", 없으면 "상시" */
export const formatDeadline = (deadline: string | null) => {
    if (!deadline) return "상시";

    const [, month, day] = deadline.split("-");
    return `${Number(month)}.${Number(day)} 마감`;
};

/** 3 → "D-3", 0 → "D-DAY", 없으면 "상시" */
export const formatDDay = (dDay: number | null) => {
    if (dDay === null) return "상시";
    if (dDay === 0) return "D-DAY";
    return `D-${dDay}`;
};
