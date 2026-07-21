/** 선택한 연월에 실제로 존재하는 일 목록을 반환합니다. */
export const getDaysInMonth = (year: number, month: number) =>
    Array.from(
        { length: new Date(year, month, 0).getDate() },
        (_, index) => index + 1
    );
