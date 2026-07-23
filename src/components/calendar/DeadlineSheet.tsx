/*
 * 캘린더에서 날짜를 선택했을 때 하단에 올라오는 마감 목록 시트입니다.
 * 캘린더 페이지와 홈 미니 캘린더에서 함께 사용합니다.
 */

import type { CalendarDayElement } from "@/types/calendar";
import { useDialogAccessibility } from "@/hooks/useDialogAccessibility";
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
    const dialogRef = useDialogAccessibility<HTMLElement>(true, onClose);

    return (
        <>
            <button
                className="fixed inset-0 bottom-[57px] z-20 cursor-default bg-[#bababa]/60"
                type="button"
                aria-label="마감 목록 닫기"
                onClick={onClose}
            />

            <section
                ref={dialogRef}
                tabIndex={-1}
                className="fixed bottom-[57px] left-1/2 z-30 flex h-[302px] max-h-[calc(100svh-57px)] w-full max-w-[390px] -translate-x-1/2 flex-col items-center rounded-t-[30px] bg-white px-[21px] pt-[22px]"
                role="dialog"
                aria-modal="true"
                aria-label={`${Number(month)}월 ${Number(day)}일 마감 목록`}
            >
                <button
                    data-dialog-initial-focus
                    className="block h-1 w-[39px] shrink-0 cursor-pointer rounded-full bg-[#d9d9d9]"
                    type="button"
                    aria-label="마감 목록 닫기"
                    onClick={onClose}
                />

                <header className="mt-[25px] flex w-[335px] max-w-full shrink-0 items-end justify-between">
                    <h2 className="text-[16px] leading-none font-bold">
                        {Number(month)}월 {Number(day)}일 마감
                    </h2>
                    <span className="text-[13px] leading-none font-bold text-black/30">
                        {items.length}건
                    </span>
                </header>

                {items.length > 0 ? (
                    <ul className="mt-[25px] flex min-h-0 w-full flex-1 flex-col items-center gap-3 overflow-y-auto pb-4">
                        {items.map((item) => {
                            const urgent = item.dDay >= 0 && item.dDay <= 7;

                            return (
                                <li key={item.subsidyId}>
                                    <Link
                                        className="border-primary relative flex h-[73px] w-[312px] max-w-full items-center rounded-[20px] border-[0.5px] bg-white px-[21px] pr-[76px]"
                                        to={`/policies/${item.subsidyId}`}
                                        state={{ bottomNavPath }}
                                    >
                                        <span className="block truncate text-[16px] leading-normal font-bold">
                                            {item.name}
                                        </span>
                                        <span
                                            className={`absolute top-[22px] right-[21px] rounded-[13px] px-[7px] py-[6px] text-[13px] leading-none font-bold ${urgent ? "bg-danger-light text-danger" : "bg-green-light text-success"}`}
                                        >
                                            {item.dDay === 0
                                                ? "D-0"
                                                : `D-${item.dDay}`}
                                        </span>
                                    </Link>
                                </li>
                            );
                        })}
                    </ul>
                ) : (
                    <p className="text-text-muted mt-8 text-center text-[13px] font-medium">
                        이 날짜에 마감되는 지원금이 없어요
                    </p>
                )}
            </section>
        </>
    );
};

export default DeadlineSheet;
