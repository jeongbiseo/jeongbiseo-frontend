/* 마감 캘린더 관련 타입입니다. (백엔드 Swagger 기준) */

/** 특정 날짜에 마감되는 지원금 */
export interface CalendarDayElement {
    subsidyId: number;
    name: string;
    /** YYYY-MM-DD */
    deadline: string;
    dDay: number;
}

export interface CalendarDay {
    /** YYYY-MM-DD */
    date: string;
    items: CalendarDayElement[];
}

/** GET /calendar 응답 */
export interface CalendarResult {
    year: number;
    month: number;
    days: CalendarDay[];
}
