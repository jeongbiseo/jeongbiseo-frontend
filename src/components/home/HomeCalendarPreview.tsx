import type { CalendarResult } from "@/types/calendar";

const WEEK_DAYS = ["일", "월", "화", "수", "목", "금", "토"];

/** 해당 월의 달력 셀(앞뒤 달 여백 포함)을 만듭니다. */
const buildMonthCells = (year: number, month: number) => {
    const startWeekday = new Date(year, month - 1, 1).getDay();
    const daysInMonth = new Date(year, month, 0).getDate();
    const prevMonthDays = new Date(year, month - 1, 0).getDate();

    const cells: { day: number; muted: boolean }[] = [];

    for (let index = startWeekday; index > 0; index -= 1) {
        cells.push({ day: prevMonthDays - index + 1, muted: true });
    }
    for (let day = 1; day <= daysInMonth; day += 1) {
        cells.push({ day, muted: false });
    }
    for (let day = 1; cells.length % 7 !== 0; day += 1) {
        cells.push({ day, muted: true });
    }

    return cells;
};

export const HomeCalendarPreview = ({
    calendar,
    selectedDate,
    onSelectDate,
}: {
    calendar: CalendarResult | null;
    selectedDate: string | null;
    onSelectDate: (date: string) => void;
}) => {
    const today = new Date();
    const year = calendar?.year ?? today.getFullYear();
    const month = calendar?.month ?? today.getMonth() + 1;
    const cells = buildMonthCells(year, month);

    // 마감이 있는 날짜만 모읍니다. (데이터가 없으면 점이 표시되지 않습니다)
    const eventDays = new Set(
        (calendar?.days ?? [])
            .filter(({ items }) => items.length > 0)
            .map(({ date }) => Number(date.split("-")[2]))
    );
    const isCurrentMonth =
        year === today.getFullYear() && month === today.getMonth() + 1;
    const toKey = (day: number) =>
        `${year}-${String(month).padStart(2, "0")}-${String(day).padStart(2, "0")}`;

    return (
        <article className="mx-auto h-[267px] w-[307px] rounded-[20px] bg-white px-4 pt-4 shadow-[0_4px_12px_rgba(0,0,0,0.08)]">
            <header className="flex items-center gap-2 text-[13px] font-bold">
                <span>{year}년</span>
                <span>{month}월</span>
            </header>

            <div className="text-text-muted mt-[13px] grid grid-cols-7 text-center text-[13px] leading-none font-bold">
                {WEEK_DAYS.map((day) => (
                    <span key={day}>{day}</span>
                ))}
            </div>

            <div className="mt-[5px] grid grid-cols-7">
                {cells.map(({ day, muted }, index) => {
                    const isToday =
                        !muted && isCurrentMonth && day === today.getDate();
                    const isSelected = !muted && selectedDate === toKey(day);
                    const hasEvent = !muted && eventDays.has(day);

                    return (
                        <button
                            className={`relative flex h-[36.8px] cursor-pointer items-center justify-center rounded-full text-[13px] font-bold ${
                                muted
                                    ? "text-text-strong/15"
                                    : isSelected
                                      ? "border-primary bg-green-light text-primary border"
                                      : isToday
                                        ? "bg-text-strong text-white"
                                        : "text-text-strong"
                            }`}
                            type="button"
                            disabled={muted}
                            key={`${muted ? "outside" : "current"}-${day}-${index}`}
                            onClick={() => onSelectDate(toKey(day))}
                        >
                            <span>{day}</span>
                            {hasEvent && !isToday && (
                                <span className="bg-primary absolute bottom-[4px] size-[4.8px] rounded-full" />
                            )}
                            {hasEvent && isToday && (
                                <span className="absolute bottom-[4px] size-[4.8px] rounded-full bg-white" />
                            )}
                        </button>
                    );
                })}
            </div>
        </article>
    );
};
