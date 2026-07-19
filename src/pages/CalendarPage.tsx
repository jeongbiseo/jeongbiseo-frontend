import {
    calendarDeadlineCount,
    calendarPolicies,
    createCalendarReferenceDate,
    createInitialCalendarDate,
    createInitialCalendarMonth,
    formatCalendarDateKey,
    type CalendarPolicy,
} from "@/constants/calendarData";
import { useMemo, useState } from "react";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import "@/styles/calendar.css";

const DAY_IN_MILLISECONDS = 24 * 60 * 60 * 1000;

const CalendarPage = () => {
    const [selectedDate, setSelectedDate] = useState(createInitialCalendarDate);
    const [activeStartDate, setActiveStartDate] = useState(
        createInitialCalendarMonth
    );

    const visiblePolicies = useMemo(() => {
        const referenceDate = createCalendarReferenceDate();
        const selectedIsVisible =
            selectedDate.getFullYear() === activeStartDate.getFullYear() &&
            selectedDate.getMonth() === activeStartDate.getMonth();
        const selectedThreshold = selectedIsVisible
            ? selectedDate
            : new Date(
                  activeStartDate.getFullYear(),
                  activeStartDate.getMonth(),
                  1
              );
        const referenceIsVisible =
            referenceDate.getFullYear() === activeStartDate.getFullYear() &&
            referenceDate.getMonth() === activeStartDate.getMonth();
        const threshold =
            referenceIsVisible && referenceDate > selectedThreshold
                ? referenceDate
                : selectedThreshold;

        return calendarPolicies
            .filter(
                ({ deadline }) =>
                    deadline.getFullYear() === activeStartDate.getFullYear() &&
                    deadline.getMonth() === activeStartDate.getMonth() &&
                    deadline >= threshold
            )
            .sort(
                (first, second) =>
                    first.deadline.getTime() - second.deadline.getTime()
            )
            .slice(0, 3);
    }, [activeStartDate, selectedDate]);

    return (
        <main className="bg-surface-dim flex min-h-svh justify-center">
            <section className="bg-ground text-text-strong min-h-svh w-full max-w-[390px] px-[35px] pt-[75px] pb-[104px]">
                <h1 className="-ml-[11px] text-[20px] leading-normal font-bold">
                    마감 캘린더
                </h1>

                <div className="mt-[24px]">
                    <Calendar
                        className="jeongbiseo-calendar"
                        calendarType="gregory"
                        locale="ko-KR"
                        activeStartDate={activeStartDate}
                        value={selectedDate}
                        prev2Label={null}
                        next2Label={null}
                        prevLabel="‹"
                        nextLabel="›"
                        formatDay={(_, date) => String(date.getDate())}
                        formatMonthYear={(_, date) =>
                            `${date.getFullYear()}년 ${date.getMonth() + 1}월`
                        }
                        onChange={(value) => {
                            const date = Array.isArray(value)
                                ? value[0]
                                : value;
                            if (date) setSelectedDate(date);
                        }}
                        onActiveStartDateChange={({
                            activeStartDate: date,
                        }) => {
                            if (date) setActiveStartDate(date);
                        }}
                        tileContent={({ date, view }) => {
                            const dateIsInVisibleMonth =
                                date.getFullYear() ===
                                    activeStartDate.getFullYear() &&
                                date.getMonth() === activeStartDate.getMonth();
                            if (view !== "month" || !dateIsInVisibleMonth) {
                                return null;
                            }
                            const count =
                                calendarDeadlineCount[
                                    formatCalendarDateKey(date)
                                ];
                            if (!count) return null;

                            return (
                                <span
                                    className="calendar-deadline-markers"
                                    aria-label={`마감 지원금 ${count}건`}
                                >
                                    {Array.from(
                                        { length: Math.min(count, 2) },
                                        (_, index) => (
                                            <span
                                                className="calendar-deadline-marker"
                                                key={index}
                                            />
                                        )
                                    )}
                                </span>
                            );
                        }}
                    />
                </div>

                <MarkerLegend />

                <section className="mt-[18px]">
                    <h2 className="text-[16px] leading-normal font-bold">
                        마감일순
                    </h2>

                    {visiblePolicies.length > 0 ? (
                        <div className="mt-[21px] flex flex-col gap-4">
                            {visiblePolicies.map((policy) => (
                                <DeadlineCard key={policy.id} policy={policy} />
                            ))}
                        </div>
                    ) : (
                        <CalendarEmptyState />
                    )}
                </section>
            </section>
        </main>
    );
};

const MarkerLegend = () => (
    <aside className="border-primary mt-[22px] flex h-[35px] items-center rounded-[10px] border-[0.5px] bg-white px-[17px] text-[13px]">
        <span>마감 마커:</span>
        <span className="ml-[9px] flex items-center gap-1">
            <span className="bg-primary size-[10px] rounded-full" />
            1건
        </span>
        <span className="ml-[9px] flex items-center gap-1">
            <span className="flex gap-[2px]">
                <span className="bg-primary size-[10px] rounded-full" />
                <span className="bg-primary size-[10px] rounded-full" />
            </span>
            2건 이상
        </span>
    </aside>
);

const DeadlineCard = ({ policy }: { policy: CalendarPolicy }) => {
    const referenceDate = createCalendarReferenceDate();
    const remainingDays = Math.max(
        0,
        Math.round(
            (policy.deadline.getTime() - referenceDate.getTime()) /
                DAY_IN_MILLISECONDS
        )
    );
    const urgent = remainingDays <= 7;
    const badgeLabel = remainingDays === 0 ? "D-Day" : `D-${remainingDays}`;

    return (
        <article className="border-primary relative h-[107px] rounded-[20px] border-[0.5px] bg-white px-[21px] py-[15px]">
            <div className="pr-[76px]">
                <p className="text-text-subtle text-[13px] leading-normal font-bold">
                    {policy.organization}
                </p>
                <h3 className="mt-[2px] truncate text-[16px] leading-normal font-bold">
                    {policy.title}
                </h3>
                <p className="text-text-muted mt-[13px] text-[13px] leading-normal font-medium">
                    {`${policy.deadline.getMonth() + 1}.${policy.deadline.getDate()} 마감`}
                </p>
            </div>

            <span
                className={`absolute top-[15px] right-[27px] rounded-[13px] px-[7px] py-[6px] text-[13px] leading-none font-bold ${urgent ? "bg-danger-light text-danger" : "bg-green-light text-success"}`}
            >
                {badgeLabel}
            </span>
        </article>
    );
};

const CalendarEmptyState = () => (
    <div className="border-line mt-[21px] flex min-h-[152px] flex-col items-center justify-center rounded-[20px] border bg-white px-6 text-center">
        <p className="text-[16px] font-bold">예정된 마감 지원금이 없어요</p>
        <p className="text-text-muted mt-2 text-[13px] leading-normal font-medium">
            다른 날짜나 달을 선택해 확인해보세요
        </p>
    </div>
);

export default CalendarPage;
