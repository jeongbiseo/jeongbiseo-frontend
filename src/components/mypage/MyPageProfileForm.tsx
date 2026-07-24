import {
    CounterButton,
    FieldLabel,
    FormSelect as Select,
    InlineLoadState,
} from "@/components/common/form/FormControls";
import {
    employmentOptions,
    incomeOptions,
} from "@/constants/onboardingOptions";
import type { RegionLoadStatus } from "@/hooks/useRegionOptions";
import type { ReceivedBenefit } from "@/types/onboarding";
import type { Sigungu } from "@/types/region";
import { getDaysInMonth } from "@/utils/date";
import type { RefObject } from "react";

const currentYear = new Date().getFullYear();
const years = Array.from(
    { length: 83 },
    (_, index) => currentYear - 14 - index
);
const months = Array.from({ length: 12 }, (_, index) => index + 1);

type MyPageProfileFormProps = {
    birthYear: number;
    birthMonth: number;
    birthDay: number;
    city: string;
    district: string;
    employment: string;
    income: string;
    householdSize: number;
    sidoList: string[];
    sigunguList: Sigungu[];
    sigunguSido: string | null;
    sidoStatus: RegionLoadStatus;
    sigunguStatus: RegionLoadStatus;
    receivedBenefits: ReceivedBenefit[];
    receivedLoading: boolean;
    receivedError: boolean;
    receivedSectionRef: RefObject<HTMLDivElement | null>;
    saving: boolean;
    saved: boolean;
    regionReady: boolean;
    onBirthYearChange: (year: number) => void;
    onBirthMonthChange: (month: number) => void;
    onBirthDayChange: (day: number) => void;
    onCityChange: (city: string) => void;
    onDistrictChange: (district: string) => void;
    onEmploymentChange: (employment: string) => void;
    onIncomeChange: (income: string) => void;
    onHouseholdSizeChange: (size: number) => void;
    onRetrySido: () => void;
    onRetrySigungu: () => void;
    onRetryReceived: () => void;
    onRemoveReceived: (id: number) => void;
    onOpenBenefitSheet: () => void;
    onSave: () => void;
};

export const MyPageProfileForm = ({
    birthYear,
    birthMonth,
    birthDay,
    city,
    district,
    employment,
    income,
    householdSize,
    sidoList,
    sigunguList,
    sigunguSido,
    sidoStatus,
    sigunguStatus,
    receivedBenefits,
    receivedLoading,
    receivedError,
    receivedSectionRef,
    saving,
    saved,
    regionReady,
    onBirthYearChange,
    onBirthMonthChange,
    onBirthDayChange,
    onCityChange,
    onDistrictChange,
    onEmploymentChange,
    onIncomeChange,
    onHouseholdSizeChange,
    onRetrySido,
    onRetrySigungu,
    onRetryReceived,
    onRemoveReceived,
    onOpenBenefitSheet,
    onSave,
}: MyPageProfileFormProps) => {
    const days = getDaysInMonth(birthYear, birthMonth);

    return (
        <>
            <header className="mt-0">
                <p className="text-[16px] font-bold">내 정보 수정</p>
                <h1 className="mt-1 text-[20px] font-bold">추천 기준 정보</h1>
                <p className="text-text-subtle mt-2 text-[13px] font-semibold">
                    아래 정보는 지원금 추천에 직접 사용됩니다.
                </p>
            </header>

            <FieldLabel>생년월일</FieldLabel>
            <div className="grid grid-cols-3 gap-[13px]">
                <Select
                    ariaLabel="출생 연도"
                    border="strong"
                    size="onboarding"
                    value={birthYear}
                    onChange={(nextYear) => {
                        onBirthYearChange(nextYear);
                        onBirthDayChange(
                            Math.min(
                                birthDay,
                                getDaysInMonth(nextYear, birthMonth).length
                            )
                        );
                    }}
                >
                    {years.map((year) => (
                        <option value={year} key={year}>
                            {year}년
                        </option>
                    ))}
                </Select>
                <Select
                    ariaLabel="출생 월"
                    border="strong"
                    size="onboarding"
                    value={birthMonth}
                    onChange={(nextMonth) => {
                        onBirthMonthChange(nextMonth);
                        onBirthDayChange(
                            Math.min(
                                birthDay,
                                getDaysInMonth(birthYear, nextMonth).length
                            )
                        );
                    }}
                >
                    {months.map((month) => (
                        <option value={month} key={month}>
                            {month}월
                        </option>
                    ))}
                </Select>
                <Select
                    ariaLabel="출생 일"
                    border="strong"
                    size="onboarding"
                    value={birthDay}
                    onChange={onBirthDayChange}
                >
                    {days.map((day) => (
                        <option value={day} key={day}>
                            {day}일
                        </option>
                    ))}
                </Select>
            </div>

            <FieldLabel>거주지</FieldLabel>
            <div className="grid grid-cols-2 gap-2">
                <Select
                    ariaLabel="거주 시·도"
                    border="strong"
                    size="compact"
                    value={city}
                    disabled={sidoStatus !== "ready" || sidoList.length === 0}
                    onChange={(value) => onCityChange(String(value))}
                >
                    <option value="">
                        {sidoStatus === "loading"
                            ? "지역 불러오는 중"
                            : "시·도 선택"}
                    </option>
                    {sidoList.map((region) => (
                        <option key={region} value={region}>
                            {region}
                        </option>
                    ))}
                </Select>
                <Select
                    ariaLabel="거주 시·군·구"
                    border="strong"
                    size="compact"
                    value={district}
                    disabled={
                        sigunguStatus !== "ready" ||
                        sigunguSido !== city ||
                        sigunguList.length === 0
                    }
                    onChange={onDistrictChange}
                >
                    <option value="">
                        {sigunguStatus === "loading"
                            ? "시·군·구 불러오는 중"
                            : "시·군·구 선택"}
                    </option>
                    {sigunguList.map(({ code, name }) => (
                        <option key={code} value={name}>
                            {name}
                        </option>
                    ))}
                </Select>
            </div>
            {sidoStatus === "error" && (
                <InlineLoadState
                    message="지역 목록을 불러오지 못했어요"
                    onRetry={onRetrySido}
                />
            )}
            {sidoStatus === "ready" && sidoList.length === 0 && (
                <InlineLoadState
                    message="선택할 수 있는 지역이 없어요"
                    onRetry={onRetrySido}
                />
            )}
            {sidoStatus === "ready" &&
                sidoList.length > 0 &&
                sigunguStatus === "error" && (
                    <InlineLoadState
                        message="시·군·구 목록을 불러오지 못했어요"
                        onRetry={onRetrySigungu}
                    />
                )}
            {sigunguStatus === "ready" &&
                sigunguSido === city &&
                sigunguList.length === 0 && (
                    <InlineLoadState
                        message="선택할 수 있는 시·군·구가 없어요"
                        onRetry={onRetrySigungu}
                    />
                )}

            <FieldLabel>고용상태</FieldLabel>
            <Select
                ariaLabel="고용상태"
                border="strong"
                size="compact"
                value={employment}
                onChange={onEmploymentChange}
            >
                {employmentOptions.map(({ label, value }) => (
                    <option value={label} key={value}>
                        {label}
                    </option>
                ))}
            </Select>

            <FieldLabel>월 소득구간</FieldLabel>
            <Select
                ariaLabel="월 소득구간"
                border="strong"
                size="compact"
                value={income}
                onChange={onIncomeChange}
            >
                <option value="">선택 안 함</option>
                {incomeOptions.map(({ label, value }) => (
                    <option value={label} key={value}>
                        {label}
                    </option>
                ))}
            </Select>
            <p className="text-text-muted mt-2 text-[13px]">
                중위소득 기준 지원금 매칭에 활용돼요
            </p>

            <FieldLabel>가구원 수</FieldLabel>
            <div className="flex h-[47px] items-center justify-between rounded-[10px] border-[0.5px] border-[#808080] bg-white px-7">
                <CounterButton
                    label="가구원 수 줄이기"
                    onClick={() =>
                        onHouseholdSizeChange(Math.max(1, householdSize - 1))
                    }
                >
                    −
                </CounterButton>
                <strong className="text-text-muted text-[16px]">
                    {householdSize}명
                </strong>
                <CounterButton
                    label="가구원 수 늘리기"
                    onClick={() =>
                        onHouseholdSizeChange(Math.min(10, householdSize + 1))
                    }
                >
                    ＋
                </CounterButton>
            </div>
            <p className="text-text-muted mt-2 text-[13px]">
                가구원 수에 따라 주거 · 육아 지원금 범위가 달라져요
            </p>

            <div className="scroll-mt-6 pt-9" ref={receivedSectionRef}>
                <h2 className="text-[20px] font-bold">기존 수령중인 지원금</h2>
                <p className="text-text-muted mt-2 text-[13px]">
                    이미 받고 있는 지원금을 선택하면 중복 추천을 줄여드립니다
                </p>

                <div className="mt-4 flex flex-col gap-3" aria-live="polite">
                    {receivedLoading && (
                        <p className="text-text-subtle py-4 text-center text-[13px] font-semibold">
                            기수령 지원금을 불러오는 중이에요
                        </p>
                    )}
                    {receivedError && (
                        <div className="py-4 text-center">
                            <p className="text-text-subtle text-[13px] font-semibold">
                                기수령 지원금을 불러오지 못했어요
                            </p>
                            <button
                                className="text-primary mt-2 cursor-pointer text-[13px] font-bold"
                                type="button"
                                onClick={onRetryReceived}
                            >
                                다시 시도
                            </button>
                        </div>
                    )}
                    {!receivedLoading &&
                        !receivedError &&
                        receivedBenefits.length === 0 && (
                            <p className="text-text-subtle py-4 text-center text-[13px] font-semibold">
                                등록된 기수령 지원금이 없어요
                            </p>
                        )}
                    {!receivedLoading &&
                        !receivedError &&
                        receivedBenefits.map((benefit) => (
                            <div
                                className="bg-green-light flex h-[53px] items-center justify-between rounded-[10px] px-[23px]"
                                key={benefit.id}
                            >
                                <strong className="text-[16px] font-semibold">
                                    {benefit.title}
                                </strong>
                                <button
                                    className="border-green-darker cursor-pointer rounded-[10px] border-[0.5px] bg-white px-[10px] py-[5px] text-[13px] font-bold"
                                    type="button"
                                    aria-label={`${benefit.title} 삭제`}
                                    onClick={() => onRemoveReceived(benefit.id)}
                                >
                                    삭제
                                </button>
                            </div>
                        ))}
                </div>

                <button
                    className="bg-green-normal mx-auto mt-[14px] block h-[39px] w-[190px] cursor-pointer rounded-[15px] text-[16px] font-bold text-white shadow-[3px_2px_7px_var(--color-green-light-active)]"
                    type="button"
                    disabled={receivedLoading || receivedError}
                    onClick={onOpenBenefitSheet}
                >
                    기존 수령중인 지원금 추가
                </button>
            </div>

            <button
                className="bg-third mt-9 h-[39px] w-[341px] max-w-full cursor-pointer rounded-[15px] text-[16px] font-bold text-white"
                type="button"
                disabled={
                    saving || receivedLoading || receivedError || !regionReady
                }
                onClick={onSave}
            >
                {saving ? "저장 중..." : "저장"}
            </button>
            {saved && (
                <p
                    className="text-success mt-3 text-center text-[13px] font-bold"
                    role="status"
                >
                    수정한 정보를 저장했어요
                </p>
            )}
        </>
    );
};
