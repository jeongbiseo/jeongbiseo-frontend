/*
 * 캘린더에서 날짜를 선택했을 때 하단에 올라오는 마감 목록 시트입니다.
 * 캘린더 페이지와 홈 미니 캘린더에서 함께 사용합니다.
 */

import type { CalendarDayElement } from "@/types/calendar";
import ChevronDownIcon from "@/components/common/ChevronDownIcon";
import { useDialogAccessibility } from "@/hooks/useDialogAccessibility";
import { useState } from "react";
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
    const [closing, setClosing] = useState(false);
    const isCalendarPage = bottomNavPath === "/calendar";
    const handleClose = () => {
        if (closing) return;

        if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
            onClose();
            return;
        }

        setClosing(true);
    };
    const dialogRef = useDialogAccessibility<HTMLElement>(true, handleClose);

    return (
        <>
            <button
                className={`${closing ? "deadline-sheet-backdrop-exit" : "deadline-sheet-backdrop-enter"} fixed inset-0 bottom-[57px] z-20 cursor-default bg-[#bababa]/60`}
                type="button"
                aria-label="마감 목록 닫기"
                onClick={handleClose}
            />

            <section
                ref={dialogRef}
                tabIndex={-1}
                className={`${closing ? "deadline-sheet-exit" : "deadline-sheet-enter"} fixed bottom-[57px] left-1/2 z-30 flex max-h-[calc(100svh-57px)] w-full max-w-[390px] -translate-x-1/2 flex-col items-center rounded-t-[30px] bg-white px-[21px] ${isCalendarPage ? "h-[347px] pt-4" : "h-[302px] pt-[22px]"}`}
                role="dialog"
                aria-modal="true"
                aria-label={`${Number(month)}월 ${Number(day)}일 마감 목록`}
                onAnimationEnd={(event) => {
                    if (closing && event.target === event.currentTarget) {
                        onClose();
                    }
                }}
            >
                <button
                    data-dialog-initial-focus
                    className="block h-1 w-[39px] shrink-0 cursor-pointer rounded-full bg-[#d9d9d9]"
                    type="button"
                    aria-label="마감 목록 닫기"
                    onClick={handleClose}
                />

                <header
                    className={`${isCalendarPage ? "mt-[17px]" : "mt-[25px]"} flex w-[335px] max-w-full shrink-0 items-end justify-between`}
                >
                    <h2 className="text-title">
                        {Number(month)}월 {Number(day)}일 마감
                    </h2>
                    <span className="text-label-strong text-black/30">
                        {items.length}건
                    </span>
                </header>

                {items.length > 0 ? (
                    <ul
                        className={`${isCalendarPage ? "gap-0" : "gap-3"} mt-[25px] flex min-h-0 w-full flex-1 flex-col items-center overflow-y-auto pb-4`}
                    >
                        {items.map((item) => {
                            const urgent = item.dDay >= 0 && item.dDay <= 7;

                            return (
                                <li
                                    className={
                                        isCalendarPage
                                            ? "w-[337px] max-w-full"
                                            : ""
                                    }
                                    key={item.subsidyId}
                                >
                                    <Link
                                        className={
                                            isCalendarPage
                                                ? "border-line flex h-[74px] w-full items-center border-b"
                                                : "border-primary relative flex h-[73px] w-[312px] max-w-full items-center rounded-[20px] border-[0.5px] bg-white px-[21px] pr-[76px]"
                                        }
                                        to={`/policies/${item.subsidyId}`}
                                        state={{ bottomNavPath }}
                                    >
                                        {isCalendarPage ? (
                                            <>
                                                <span
                                                    className={`text-label-strong flex h-[43px] w-[45px] shrink-0 items-center justify-center rounded-[20px] ${urgent ? "bg-danger-light text-danger" : "bg-green-light text-success"}`}
                                                >
                                                    {item.dDay === 0
                                                        ? "D-0"
                                                        : `D-${item.dDay}`}
                                                </span>
                                                <span className="ml-[11px] min-w-0 flex-1">
                                                    <strong className="text-label-strong block truncate">
                                                        {item.name}
                                                    </strong>
                                                    <span className="text-label-strong mt-1 block text-black/50">
                                                        {Number(month)}.
                                                        {Number(day)} 마감
                                                    </span>
                                                </span>
                                                <ChevronDownIcon className="h-2 w-3 -rotate-90" />
                                            </>
                                        ) : (
                                            <>
                                                <span className="text-title block truncate">
                                                    {item.name}
                                                </span>
                                                <span
                                                    className={`text-label-strong absolute top-[22px] right-[21px] rounded-[13px] px-[7px] py-[6px] ${urgent ? "bg-danger-light text-danger" : "bg-green-light text-success"}`}
                                                >
                                                    {item.dDay === 0
                                                        ? "D-0"
                                                        : `D-${item.dDay}`}
                                                </span>
                                            </>
                                        )}
                                    </Link>
                                </li>
                            );
                        })}
                    </ul>
                ) : (
                    <p className="text-text-muted text-label-medium mt-8 text-center">
                        이 날짜에 마감되는 지원금이 없어요
                    </p>
                )}
            </section>
        </>
    );
};

export default DeadlineSheet;
