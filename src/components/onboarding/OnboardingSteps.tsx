import { searchSubsidiesApi } from "@/api/subsidyApi";
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
import { useSubsidyCategories } from "@/hooks/useSubsidyCategories";
import type { OnboardingFormType } from "@/schema/onboardingSchema";
import type {
    IncomeBracket,
    SubsidyCategory,
    SubsidySearchItem,
} from "@/types/onboarding";
import { getDaysInMonth } from "@/utils/date";
import { useEffect, useState } from "react";
import {
    Controller,
    type Control,
    type UseFormSetValue,
} from "react-hook-form";

const currentYear = new Date().getFullYear();
const years = Array.from(
    { length: 83 },
    (_, index) => currentYear - 14 - index
);
const months = Array.from({ length: 12 }, (_, index) => index + 1);

type StepOneProps = {
    control: Control<OnboardingFormType>;
    setValue: UseFormSetValue<OnboardingFormType>;
    age: number;
    birthYear: number;
    birthMonth: number;
    birthDay: number;
    days: number[];
    sidoList: string[];
    sigunguList: string[];
    sidoStatus: "idle" | "loading" | "ready" | "error";
    sigunguStatus: "idle" | "loading" | "ready" | "error";
    retrySido: () => void;
    retrySigungu: () => void;
};

export const OnboardingStepOne = ({
    control,
    setValue,
    age,
    birthYear,
    birthMonth,
    birthDay,
    days,
    sidoList,
    sigunguList,
    sidoStatus,
    sigunguStatus,
    retrySido,
    retrySigungu,
}: StepOneProps) => (
    <>
        <StepHeading
            eyebrow="기본정보"
            title={
                <>
                    맞춤 추천을 위해
                    <br />몇 가지만 알려주세요
                </>
            }
            description="입력한 정보는 나중에 설정에서 언제든 수정할 수 있어요"
        />

        <FieldLabel spacing="onboarding">생년월일(필수)</FieldLabel>
        <div className="grid grid-cols-3 gap-3">
            <Controller
                control={control}
                name="birthYear"
                render={({ field }) => (
                    <Select
                        ariaLabel="출생 연도"
                        border="soft"
                        size="onboarding"
                        value={field.value}
                        onChange={(value) => {
                            const nextYear = Number(value);
                            field.onChange(nextYear);
                            setValue(
                                "birthDay",
                                Math.min(
                                    birthDay,
                                    getDaysInMonth(nextYear, birthMonth).length
                                )
                            );
                        }}
                    >
                        {years.map((year) => (
                            <option key={year} value={year}>
                                {year}년
                            </option>
                        ))}
                    </Select>
                )}
            />
            <Controller
                control={control}
                name="birthMonth"
                render={({ field }) => (
                    <Select
                        ariaLabel="출생 월"
                        border="soft"
                        size="onboarding"
                        value={field.value}
                        onChange={(value) => {
                            const nextMonth = Number(value);
                            field.onChange(nextMonth);
                            setValue(
                                "birthDay",
                                Math.min(
                                    birthDay,
                                    getDaysInMonth(birthYear, nextMonth).length
                                )
                            );
                        }}
                    >
                        {months.map((month) => (
                            <option key={month} value={month}>
                                {month}월
                            </option>
                        ))}
                    </Select>
                )}
            />
            <Controller
                control={control}
                name="birthDay"
                render={({ field, fieldState }) => (
                    <>
                        <Select
                            ariaLabel="출생 일"
                            border="soft"
                            size="onboarding"
                            value={field.value}
                            onChange={(value) => field.onChange(Number(value))}
                        >
                            {days.map((day) => (
                                <option key={day} value={day}>
                                    {day}일
                                </option>
                            ))}
                        </Select>
                        {fieldState.error && (
                            <p className="text-danger text-caption-strong col-span-3 mt-1">
                                {fieldState.error.message}
                            </p>
                        )}
                    </>
                )}
            />
        </div>
        <div className="bg-green-light-hover text-green-normal-hover text-label-strong rounded-control mt-3 flex h-[36px] items-center px-4">
            만 {age}세로 계산돼요
        </div>

        <FieldLabel spacing="onboarding">거주지(필수)</FieldLabel>
        <div className="grid grid-cols-2 gap-3">
            <Controller
                control={control}
                name="sido"
                render={({ field }) => (
                    <Select
                        ariaLabel="거주 시·도"
                        border="soft"
                        size="onboarding"
                        value={field.value}
                        disabled={
                            sidoStatus !== "ready" || sidoList.length === 0
                        }
                        onChange={(value) => {
                            field.onChange(value);
                            setValue("sigungu", "", {
                                shouldValidate: true,
                            });
                        }}
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
                )}
            />
            <Controller
                control={control}
                name="sigungu"
                render={({ field }) => (
                    <Select
                        ariaLabel="거주 시·군·구"
                        border="soft"
                        size="onboarding"
                        value={field.value}
                        disabled={
                            sigunguStatus !== "ready" ||
                            sigunguList.length === 0
                        }
                        onChange={field.onChange}
                    >
                        <option value="">
                            {sigunguStatus === "loading"
                                ? "시·군·구 불러오는 중"
                                : "시·군·구 선택"}
                        </option>
                        {sigunguList.map((districtName) => (
                            <option key={districtName} value={districtName}>
                                {districtName}
                            </option>
                        ))}
                    </Select>
                )}
            />
        </div>
        {sidoStatus === "error" && (
            <InlineLoadState
                message="지역 목록을 불러오지 못했어요"
                onRetry={retrySido}
            />
        )}
        {sidoStatus === "ready" && sidoList.length === 0 && (
            <InlineLoadState
                message="선택할 수 있는 지역이 없어요"
                onRetry={retrySido}
            />
        )}
        {sidoStatus === "ready" &&
            sidoList.length > 0 &&
            sigunguStatus === "error" && (
                <InlineLoadState
                    message="시·군·구 목록을 불러오지 못했어요"
                    onRetry={retrySigungu}
                />
            )}
        {sigunguStatus === "ready" && sigunguList.length === 0 && (
            <InlineLoadState
                message="선택할 수 있는 시·군·구가 없어요"
                onRetry={retrySigungu}
            />
        )}

        <FieldLabel spacing="onboarding">고용상태(필수)</FieldLabel>
        <Controller
            control={control}
            name="employmentStatus"
            render={({ field }) => (
                <div className="grid grid-cols-2 gap-3">
                    {employmentOptions.map(({ label, value }) => {
                        const selected = field.value === value;
                        return (
                            <button
                                className={`text-label-strong rounded-control relative h-[45px] cursor-pointer border-[0.5px] ${selected ? "border-green-normal-hover bg-green-light-hover text-green-normal-hover" : "border-[#808080] bg-white"}`}
                                type="button"
                                key={value}
                                aria-pressed={selected}
                                onClick={() => field.onChange(value)}
                            >
                                {label}
                                {selected && (
                                    <span className="text-green-normal-hover absolute top-1.5 right-2 text-[16px] leading-none">
                                        ✓
                                    </span>
                                )}
                            </button>
                        );
                    })}
                </div>
            )}
        />
        <div className="bg-warning-light text-warning text-label-strong rounded-control mt-4 flex min-h-[59px] items-center px-4">
            연령, 거주지, 고용상태는 지원금 추천 조건 매칭에 꼭 필요한
            <br />
            필수 정보예요
        </div>
    </>
);

export const OnboardingStepTwo = ({
    control,
}: {
    control: Control<OnboardingFormType>;
}) => (
    <>
        <StepHeading
            eyebrow="추가정보"
            title={
                <>
                    조금 더 정확하게
                    <br />
                    추천해 드릴게요
                </>
            }
            description="선택 항목이에요, 건너 뛰어도 괜찮아요"
        />

        <FieldLabel spacing="onboarding">월 소득구간</FieldLabel>
        <Controller
            control={control}
            name="incomeBracket"
            render={({ field }) => (
                <Select
                    ariaLabel="월 소득구간"
                    border="soft"
                    size="onboarding"
                    value={field.value ?? ""}
                    onChange={(value) =>
                        field.onChange(
                            value === "" ? undefined : (value as IncomeBracket)
                        )
                    }
                >
                    <option value="">선택 안 함</option>
                    {incomeOptions.map(({ label, value }) => (
                        <option key={value} value={value}>
                            {label}
                        </option>
                    ))}
                </Select>
            )}
        />

        <FieldLabel spacing="onboarding">가구원 수</FieldLabel>
        <Controller
            control={control}
            name="householdSize"
            render={({ field }) => {
                const size = field.value ?? 1;
                return (
                    <div className="rounded-control flex h-[50px] items-center justify-between border-[0.5px] border-[#808080] bg-white px-5">
                        <CounterButton
                            size="compact"
                            label="가구원 수 줄이기"
                            onClick={() =>
                                field.onChange(Math.max(1, size - 1))
                            }
                        >
                            −
                        </CounterButton>
                        <span className="text-body-sm-strong">{size}명</span>
                        <CounterButton
                            size="compact"
                            label="가구원 수 늘리기"
                            onClick={() =>
                                field.onChange(Math.min(10, size + 1))
                            }
                        >
                            ＋
                        </CounterButton>
                    </div>
                );
            }}
        />
    </>
);

export const OnboardingStepThree = ({
    control,
}: {
    control: Control<OnboardingFormType>;
}) => {
    const [query, setQuery] = useState("");
    const [debouncedQuery, setDebouncedQuery] = useState("");
    const [category, setCategory] = useState<SubsidyCategory | null>(null);
    const {
        categories,
        status: categoryStatus,
        retry: retryCategories,
    } = useSubsidyCategories();
    const selectedCategory = categories.some(({ code }) => code === category)
        ? category
        : null;
    // 조회 결과를 검색 조건(key)과 함께 저장해, 로딩 여부를 파생값으로 계산합니다.
    // (effect 안에서 setState를 동기 호출하지 않기 위한 구조입니다)
    const [result, setResult] = useState<{
        key: string;
        items: SubsidySearchItem[];
    } | null>(null);

    const searchKey = `${selectedCategory ?? ""}|${debouncedQuery}`;
    const subsidies = result?.key === searchKey ? result.items : [];
    const searching = result?.key !== searchKey;

    // 검색어는 300ms 디바운스하고, 카테고리 변경은 즉시 반영합니다.
    useEffect(() => {
        const timer = setTimeout(() => setDebouncedQuery(query), 300);
        return () => clearTimeout(timer);
    }, [query]);

    useEffect(() => {
        let active = true;

        const fetchSubsidies = async () => {
            try {
                const response = await searchSubsidiesApi({
                    keyword: debouncedQuery,
                    category: selectedCategory ?? undefined,
                    includeClosed: true,
                });
                if (active) {
                    setResult({
                        key: searchKey,
                        items: response.isSuccess
                            ? response.result.content
                            : [],
                    });
                }
            } catch {
                if (active) setResult({ key: searchKey, items: [] });
            }
        };

        void fetchSubsidies();

        return () => {
            active = false;
        };
    }, [searchKey, debouncedQuery, selectedCategory]);

    return (
        <>
            <StepHeading
                eyebrow="추가정보"
                title={
                    <>
                        이미 받고 있는
                        <br />
                        지원금이 있나요?
                    </>
                }
                description="선택한 항목은 제외하고 추천해 드릴 수 있어요"
            />

            <div className="relative mt-6">
                <svg
                    className="absolute top-1/2 left-4 size-4 -translate-y-1/2 text-[#777]"
                    viewBox="0 0 20 20"
                    fill="none"
                    aria-hidden="true"
                >
                    <circle
                        cx="8.5"
                        cy="8.5"
                        r="5.5"
                        stroke="currentColor"
                        strokeWidth="1.5"
                    />
                    <path
                        d="m13 13 4 4"
                        stroke="currentColor"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                    />
                </svg>
                <input
                    className="focus:border-primary focus-visible:outline-primary text-label-strong rounded-control h-[50px] w-full border-[0.5px] border-[#808080] bg-white pr-4 pl-11 outline-none placeholder:text-[#9a9a9a] focus-visible:outline-2 focus-visible:outline-offset-1"
                    aria-label="기수령 지원금 검색"
                    value={query}
                    placeholder="지원금명 또는 기관명으로 검색해보세요"
                    onChange={(event) => setQuery(event.target.value)}
                />
            </div>

            <div className="mt-3 flex w-full items-center gap-1.5 overflow-x-auto pb-1">
                {[
                    { label: "전체", value: null },
                    ...categories.map(({ code, label }) => ({
                        label,
                        value: code,
                    })),
                ].map(({ label, value }) => (
                    <button
                        className={`text-label-strong rounded-badge shrink-0 cursor-pointer px-2 py-1 whitespace-nowrap ${selectedCategory === value ? "bg-third text-white" : "bg-disabled text-text-muted"}`}
                        type="button"
                        key={value ?? "all"}
                        aria-pressed={selectedCategory === value}
                        onClick={() => setCategory(value)}
                    >
                        {label}
                    </button>
                ))}
            </div>
            {categoryStatus === "loading" && categories.length === 0 && (
                <p className="text-text-muted text-caption-strong mt-2">
                    카테고리를 불러오는 중이에요
                </p>
            )}
            {categoryStatus === "error" && (
                <InlineLoadState
                    message="카테고리를 불러오지 못했어요"
                    onRetry={retryCategories}
                />
            )}
            {categoryStatus === "ready" && categories.length === 0 && (
                <InlineLoadState
                    message="표시할 카테고리가 없어요"
                    onRetry={retryCategories}
                />
            )}

            <FieldLabel spacing="onboarding">기존 수령중인 지원금</FieldLabel>
            <Controller
                control={control}
                name="receivedSubsidyIds"
                render={({ field }) => (
                    <div
                        className="flex flex-col gap-2.5"
                        aria-live="polite"
                        aria-busy={searching}
                    >
                        {subsidies.map((subsidy) => {
                            const selected = field.value.includes(
                                subsidy.subsidyId
                            );
                            return (
                                <button
                                    className={`rounded-card gap-layout-related flex min-h-[74px] cursor-pointer items-center border-[0.5px] px-4 text-left ${selected ? "border-green-normal-hover bg-green-light-hover" : "border-[#808080] bg-white"}`}
                                    type="button"
                                    key={subsidy.subsidyId}
                                    aria-pressed={selected}
                                    onClick={() =>
                                        field.onChange(
                                            selected
                                                ? field.value.filter(
                                                      (id) =>
                                                          id !==
                                                          subsidy.subsidyId
                                                  )
                                                : [
                                                      ...field.value,
                                                      subsidy.subsidyId,
                                                  ]
                                        )
                                    }
                                >
                                    <span
                                        className={`flex size-[30px] shrink-0 items-center justify-center rounded-full border text-[16px] leading-none ${selected ? "border-green-normal bg-green-normal text-white" : "border-[#c8c8c8]"}`}
                                    >
                                        {selected && "✓"}
                                    </span>
                                    <span>
                                        <strong className="text-title block">
                                            {subsidy.name}
                                        </strong>
                                        {subsidy.agency && (
                                            <span className="text-text-subtle text-label-strong mt-layout-tight block">
                                                {subsidy.agency}
                                            </span>
                                        )}
                                    </span>
                                </button>
                            );
                        })}

                        {subsidies.length === 0 && (
                            <p className="text-label py-8 text-center text-[#999]">
                                {searching
                                    ? "지원금을 불러오는 중이에요"
                                    : "검색 결과가 없어요"}
                            </p>
                        )}
                    </div>
                )}
            />
        </>
    );
};

const StepHeading = ({
    eyebrow,
    title,
    description,
}: {
    eyebrow: string;
    title: React.ReactNode;
    description: string;
}) => (
    <header>
        <p className="text-primary text-label-strong">{eyebrow}</p>
        <h1 className="text-heading-page mt-2">{title}</h1>
        <p className="text-text-subtle text-label-strong mt-2">{description}</p>
    </header>
);
