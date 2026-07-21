/*
 * 마감 캘린더 페이지 ('/calendar')입니다.
 *
 * GET /calendar?year&month로 해당 월의 날짜별 마감 지원금을 조회합니다.
 * - 연/월 드롭다운으로 월을 이동하면 다시 조회합니다.
 * - 날짜를 선택하면 그 날짜의 마감 목록을 하단 시트로 보여줍니다.
 * - 선택이 없으면 이번 달 남은 마감을 마감일순으로 보여줍니다.
 */

import { getCalendarApi } from "@/api/calendarApi";
import DeadlineSheet from "@/components/calendar/DeadlineSheet";
import Button from "@/components/common/Button";
import type { CalendarDayElement } from "@/types/calendar";
import { useEffect, useMemo, useState } from "react";
import Calendar from "react-calendar";
import { Link } from "react-router-dom";
import "react-calendar/dist/Calendar.css";
import "@/styles/calendar.css";

const today = new Date();
const YEAR_OPTIONS = Array.from(
    { length: 4 },
    (_, index) => today.getFullYear() - 1 + index
);
const MONTH_OPTIONS = Array.from({ length: 12 }, (_, index) => index + 1);

/** Date를 YYYY-MM-DD 문자열로 만듭니다. */
const toDateKey = (date: Date) =>
    `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(
        date.getDate()
    ).padStart(2, "0")}`;

type LoadState =
    | { status: "loading" }
    | { status: "error" }
    | { status: "ready"; itemsByDate: Map<string, CalendarDayElement[]> };

const CalendarPage = () => {
    const [year, setYear] = useState(today.getFullYear());
    const [month, setMonth] = useState(today.getMonth() + 1);
    const [selectedDate, setSelectedDate] = useState<string | null>(null);
    const [state, setState] = useState<LoadState>({ status: "loading" });
    const [reloadKey, setReloadKey] = useState(0);

    const activeStartDate = useMemo(
        () => new Date(year, month - 1, 1),
        [year, month]
    );

    useEffect(() => {
        let active = true;

        const load = async () => {
            try {
                const response = await getCalendarApi(year, month);

                if (!active) return;

                if (!response.isSuccess) {
                    setState({ status: "error" });
                    return;
                }

                setState({
                    status: "ready",
                    itemsByDate: new Map(
                        response.result.days.map(({ date, items }) => [
                            date,
                            items,
                        ])
                    ),
                });
            } catch {
                if (active) setState({ status: "error" });
            }
        };

        void load();

        return () => {
            active = false;
        };
    }, [month, reloadKey, year]);

    // 월이 바뀌면 이전 달에서 고른 날짜 선택은 해제합니다.
    const handleYearChange = (value: number) => {
        setYear(value);
        setSelectedDate(null);
        setState({ status: "loading" });
    };
    const handleMonthChange = (value: number) => {
        setMonth(value);
        setSelectedDate(null);
        setState({ status: "loading" });
    };

    const itemsByDate = useMemo(
        () =>
            state.status === "ready"
                ? state.itemsByDate
                : new Map<string, CalendarDayElement[]>(),
        [state]
    );

    // 선택이 없을 때 보여줄 이번 달 남은 마감 목록입니다.
    const upcomingItems = useMemo(() => {
        const todayKey = toDateKey(today);

        return [...itemsByDate.entries()]
            .filter(([date]) => date >= todayKey)
            .sort(([first], [second]) => first.localeCompare(second))
            .flatMap(([, items]) => items)
            .slice(0, 3);
    }, [itemsByDate]);

    const selectedItems = selectedDate
        ? (itemsByDate.get(selectedDate) ?? [])
        : [];

    return (
        <main className="bg-surface-dim flex min-h-svh justify-center">
            <section className="bg-ground text-text-strong min-h-svh w-full max-w-[390px] px-[35px] pt-[75px] pb-[104px]">
                <h1 className="-ml-[11px] text-[20px] leading-normal font-bold">
                    마감 캘린더
                </h1>
                <p className="mt-[5px] -ml-[10px] text-[12px] leading-[14px] font-bold text-[#4b4b4b]">
                    즐겨찾기한 지원금 마감 일정이에요!
                </p>

                <div className="mt-[18px]">
                    <div className="mx-auto w-[320px] rounded-[21px] bg-white pt-[17px] shadow-[0_4px_13px_rgba(0,0,0,0.08)]">
                        <div className="flex items-center gap-2 px-[17px]">
                            <MonthSelect
                                label="연도 선택"
                                value={year}
                                options={YEAR_OPTIONS}
                                format={(value) => `${value}년`}
                                onChange={handleYearChange}
                            />
                            <MonthSelect
                                label="월 선택"
                                value={month}
                                options={MONTH_OPTIONS}
                                format={(value) => `${value}월`}
                                onChange={handleMonthChange}
                            />
                        </div>

                        <Calendar
                            className="jeongbiseo-calendar"
                            calendarType="gregory"
                            locale="ko-KR"
                            activeStartDate={activeStartDate}
                            value={selectedDate ? new Date(selectedDate) : null}
                            showNavigation={false}
                            formatDay={(_, date) => String(date.getDate())}
                            onChange={(value) => {
                                const date = Array.isArray(value)
                                    ? value[0]
                                    : value;
                                if (date) setSelectedDate(toDateKey(date));
                            }}
                            tileContent={({ date, view }) => {
                                if (
                                    view !== "month" ||
                                    date.getMonth() !== month - 1
                                ) {
                                    return null;
                                }

                                const count =
                                    itemsByDate.get(toDateKey(date))?.length ??
                                    0;
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
                </div>

                <MarkerLegend />

                <section className="mt-[18px]">
                    <h2 className="text-[16px] leading-normal font-bold">
                        마감일순
                    </h2>

                    {state.status === "loading" && (
                        <p className="text-text-muted mt-8 text-center text-[14px] font-semibold">
                            불러오는 중이에요...
                        </p>
                    )}

                    {state.status === "error" && (
                        <div className="mt-8 text-center">
                            <p className="text-text-muted text-[14px] font-semibold">
                                마감 정보를 불러오지 못했어요.
                            </p>
                            <Button
                                className="mt-5"
                                onClick={() => {
                                    setState({ status: "loading" });
                                    setReloadKey((key) => key + 1);
                                }}
                            >
                                다시 시도
                            </Button>
                        </div>
                    )}

                    {state.status === "ready" &&
                        (upcomingItems.length > 0 ? (
                            <div className="mt-[21px] flex flex-col gap-4">
                                {upcomingItems.map((item) => (
                                    <DeadlineCard
                                        key={item.subsidyId}
                                        item={item}
                                    />
                                ))}
                            </div>
                        ) : (
                            <CalendarEmptyState />
                        ))}
                </section>
            </section>

            {selectedDate && (
                <DeadlineSheet
                    date={selectedDate}
                    items={selectedItems}
                    bottomNavPath="/calendar"
                    onClose={() => setSelectedDate(null)}
                />
            )}
        </main>
    );
};

const MonthSelect = ({
    label,
    value,
    options,
    format,
    onChange,
}: {
    label: string;
    value: number;
    options: number[];
    format: (value: number) => string;
    onChange: (value: number) => void;
}) => (
    <label className="relative flex items-center">
        <span className="sr-only">{label}</span>
        <select
            className="focus-visible:outline-primary cursor-pointer appearance-none bg-transparent pr-4 text-[14px] leading-[18px] font-bold focus-visible:outline-2"
            value={value}
            onChange={(event) => onChange(Number(event.target.value))}
        >
            {options.map((option) => (
                <option key={option} value={option}>
                    {format(option)}
                </option>
            ))}
        </select>
        <span
            className="pointer-events-none absolute right-0 text-[10px]"
            aria-hidden="true"
        >
            ▼
        </span>
    </label>
);

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

const DeadlineCard = ({ item }: { item: CalendarDayElement }) => {
    const urgent = item.dDay <= 7;
    const [, month, day] = item.deadline.split("-");

    return (
        <Link
            className="border-primary relative block h-[107px] rounded-[20px] border-[0.5px] bg-white px-[21px] py-[15px]"
            to={`/policies/${item.subsidyId}`}
            state={{ bottomNavPath: "/calendar" }}
        >
            <div className="pr-[76px]">
                <h3 className="mt-[2px] truncate text-[16px] leading-normal font-bold">
                    {item.name}
                </h3>
                <p className="text-text-muted mt-[13px] text-[13px] leading-normal font-medium">
                    {`${Number(month)}.${Number(day)} 마감`}
                </p>
            </div>

            <span
                className={`absolute top-[15px] right-[27px] rounded-[13px] px-[7px] py-[6px] text-[13px] leading-none font-bold ${urgent ? "bg-danger-light text-danger" : "bg-green-light text-success"}`}
            >
                {item.dDay === 0 ? "D-Day" : `D-${item.dDay}`}
            </span>
        </Link>
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
