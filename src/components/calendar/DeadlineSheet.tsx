/*
 * 캘린더에서 날짜를 선택했을 때 하단에 올라오는 마감 목록 시트입니다.
 * 캘린더 페이지와 홈 미니 캘린더에서 함께 사용합니다.
 */

import type { CalendarDayElement } from "@/types/calendar";
import { Link } from "react-router-dom";

const DeadlineSheet = ({
    date,
    items,
    bottomNavPath,
    onClose,
}: {
    /** YYYY-MM-DD */
    date: string;
    items: CalendarDayElement[];
    /** 상세로 이동했을 때 활성화할 하단 탭 경로 */
    bottomNavPath: string;
    onClose: () => void;
}) => {
    const [, month, day] = date.split("-");

    return (
        <section
            className="fixed bottom-[57px] left-1/2 z-30 w-full max-w-[390px] -translate-x-1/2 rounded-t-[20px] bg-white px-[25px] pt-3 pb-6 shadow-[0_-4px_16px_rgba(0,0,0,0.08)]"
            aria-label={`${Number(month)}월 ${Number(day)}일 마감 목록`}
        >
            <button
                className="mx-auto block h-1 w-[39px] cursor-pointer rounded-full bg-[#d9d9d9]"
                type="button"
                aria-label="마감 목록 닫기"
                onClick={onClose}
            />

            <header className="mt-4 flex items-end justify-between">
                <h2 className="text-[16px] leading-none font-bold">
                    {Number(month)}월 {Number(day)}일 마감
                </h2>
                <span className="text-text-muted text-[13px] leading-none font-medium">
                    {items.length}건
                </span>
            </header>

            {items.length > 0 ? (
                <ul className="mt-4 flex flex-col">
                    {items.map((item) => (
                        <li
                            className="border-line border-b"
                            key={item.subsidyId}
                        >
                            <Link
                                className="flex items-center gap-3 py-3"
                                to={`/policies/${item.subsidyId}`}
                                state={{ bottomNavPath }}
                            >
                                <span className="bg-green-light text-success flex size-[38px] shrink-0 items-center justify-center rounded-full text-[13px] leading-none font-bold">
                                    {item.dDay === 0 ? "D-0" : `D-${item.dDay}`}
                                </span>
                                <span className="min-w-0 flex-1">
                                    <span className="block truncate text-[15px] leading-none font-bold">
                                        {item.name}
                                    </span>
                                </span>
                                <span
                                    className="text-text-muted shrink-0 text-[16px] leading-none"
                                    aria-hidden="true"
                                >
                                    ›
                                </span>
                            </Link>
                        </li>
                    ))}
                </ul>
            ) : (
                <p className="text-text-muted mt-6 mb-2 text-center text-[13px] font-medium">
                    이 날짜에 마감되는 지원금이 없어요
                </p>
            )}
        </section>
    );
};

export default DeadlineSheet;
