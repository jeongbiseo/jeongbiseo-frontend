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
import ChevronDownIcon from "@/components/common/ChevronDownIcon";
import type { CalendarDayElement } from "@/types/calendar";
import { useEffect, useMemo, useRef, useState } from "react";
import Calendar from "react-calendar";
import { Link } from "react-router-dom";
import "react-calendar/dist/Calendar.css";
import "@/styles/calendar.css";

const today = new Date();
const YEAR_OPTIONS = Array.from(
    { length: 3 },
    (_, index) => today.getFullYear() + index
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
            <section className="bg-ground text-text-strong px-page-inline pt-page-top min-h-svh w-full max-w-[390px] pb-[104px]">
                <header>
                    <h1 className="text-heading-section">마감 캘린더</h1>
                    <p className="text-caption-strong mt-layout-tight text-[#4b4b4b]">
                        즐겨찾기한 지원금 마감 일정이에요!
                    </p>
                </header>

                <div className="mt-layout-component">
                    <div className="relative mx-auto w-full max-w-[320px]">
                        <div className="absolute top-[17px] left-[17px] z-10 flex items-center gap-2">
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
                            key={`${year}-${month}`}
                            className="jeongbiseo-calendar calendar-month-fade-in"
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

                <section className="mt-layout-group">
                    <h2 className="text-title">마감일순</h2>

                    {state.status === "loading" && (
                        <p className="text-text-muted text-label-strong mt-8 text-center">
                            불러오는 중이에요...
                        </p>
                    )}

                    {state.status === "error" && (
                        <div className="mt-8 text-center">
                            <p className="text-text-muted text-label-strong">
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
                            <div className="gap-layout-component mt-4 flex flex-col">
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
}) => {
    const [open, setOpen] = useState(false);
    const containerRef = useRef<HTMLDivElement>(null);
    const menuRef = useRef<HTMLDivElement>(null);
    const selectedOptionRef = useRef<HTMLButtonElement>(null);

    useEffect(() => {
        if (!open) return;

        const menu = menuRef.current;
        const selectedOption = selectedOptionRef.current;
        if (menu && selectedOption) {
            menu.scrollTop =
                selectedOption.offsetTop -
                (menu.clientHeight - selectedOption.clientHeight) / 2;
        }

        const handlePointerDown = (event: PointerEvent) => {
            if (!containerRef.current?.contains(event.target as Node)) {
                setOpen(false);
            }
        };
        const handleKeyDown = (event: KeyboardEvent) => {
            if (event.key === "Escape") setOpen(false);
        };

        document.addEventListener("pointerdown", handlePointerDown);
        document.addEventListener("keydown", handleKeyDown);

        return () => {
            document.removeEventListener("pointerdown", handlePointerDown);
            document.removeEventListener("keydown", handleKeyDown);
        };
    }, [open]);

    return (
        <div className="relative flex items-center" ref={containerRef}>
            <button
                className="focus-visible:outline-primary text-label-medium cursor-pointer bg-transparent pr-4 focus-visible:outline-2"
                type="button"
                aria-label={label}
                aria-haspopup="listbox"
                aria-expanded={open}
                onClick={() => setOpen((current) => !current)}
            >
                {format(value)}
            </button>
            <span
                className="pointer-events-none absolute right-0"
                aria-hidden="true"
            >
                <ChevronDownIcon expanded={open} />
            </span>

            {open && (
                <div
                    className="calendar-select-menu rounded-control absolute top-[25px] left-0 z-30 min-w-[68px] overflow-y-auto border border-[#e5e5e5] bg-white p-1 shadow-[0_6px_18px_rgb(0_0_0/14%)]"
                    role="listbox"
                    aria-label={label}
                    ref={menuRef}
                >
                    {options.map((option) => {
                        const selected = option === value;

                        return (
                            <button
                                className={`text-label-medium rounded-badge block min-h-11 w-full cursor-pointer px-2 text-left whitespace-nowrap transition-colors ${
                                    selected
                                        ? "bg-green-light text-success"
                                        : "hover:bg-surface-soft"
                                }`}
                                type="button"
                                role="option"
                                aria-selected={selected}
                                key={option}
                                ref={selected ? selectedOptionRef : undefined}
                                onClick={() => {
                                    onChange(option);
                                    setOpen(false);
                                }}
                            >
                                {format(option)}
                            </button>
                        );
                    })}
                </div>
            )}
        </div>
    );
};

const MarkerLegend = () => (
    <aside className="border-primary text-label rounded-card px-container mt-4 flex min-h-[35px] items-center border-[0.5px] bg-white py-1">
        <span>마감 마커:</span>
        <span className="ml-layout-inline flex items-center gap-1">
            <span className="bg-primary size-[10px] rounded-full" />
            1건
        </span>
        <span className="ml-layout-inline flex items-center gap-1">
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
            className="border-primary rounded-card p-container relative block h-[107px] border-[0.5px] bg-white"
            to={`/policies/${item.subsidyId}`}
            state={{ bottomNavPath: "/calendar" }}
        >
            <div className="pr-[76px]">
                <h3 className="text-title mt-[2px] truncate">{item.name}</h3>
                <p className="text-text-muted text-label-medium mt-layout-inline">
                    {`${Number(month)}.${Number(day)} 마감`}
                </p>
            </div>

            <span
                className={`text-label-strong rounded-badge absolute top-4 right-4 px-2 py-1 ${urgent ? "bg-danger-light text-danger" : "bg-green-light text-success"}`}
            >
                {item.dDay === 0 ? "D-Day" : `D-${item.dDay}`}
            </span>
        </Link>
    );
};

const CalendarEmptyState = () => (
    <div className="border-line rounded-card px-container-comfortable mt-4 flex min-h-[152px] flex-col items-center justify-center border bg-white text-center">
        <p className="text-title">예정된 마감 지원금이 없어요</p>
        <p className="text-text-muted text-label-medium mt-2">
            다른 날짜나 달을 선택해 확인해보세요
        </p>
    </div>
);

export default CalendarPage;
