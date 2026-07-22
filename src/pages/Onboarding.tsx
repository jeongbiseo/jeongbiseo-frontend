/*
 * 온보딩 페이지 ('/onboarding')입니다.
 *
 * React Hook Form + Zod로 3단계 입력값을 관리하고, 마지막 단계에서 다음을 순서대로 호출합니다.
 * 1) POST /onboarding            기본정보 저장 (완료 시 onboardingCompleted가 true)
 * 2) PUT  /onboarding/received-subsidies  기수령 지원금 저장 (전체 교체 방식)
 *
 * 3단계 지원금 목록은 GET /subsidies로 조회한 실제 subsidyId를 사용합니다.
 * (하드코딩된 id를 보내면 SUBSIDY404_1로 요청 전체가 거절됩니다)
 */

import {
    setReceivedSubsidiesApi,
    submitOnboardingApi,
} from "@/api/onboardingApi";
import { searchSubsidiesApi } from "@/api/subsidyApi";
import Button from "@/components/common/Button";
import Header from "@/components/common/Header";
import {
    employmentOptions,
    incomeOptions,
    subsidyCategoryOptions,
} from "@/constants/onboardingOptions";
import { useRegionOptions } from "@/hooks/useRegionOptions";
import {
    onboardingSchema,
    toOnboardingRequest,
    type OnboardingFormType,
} from "@/schema/onboardingSchema";
import { useAuthStore } from "@/stores/authStore";
import type {
    IncomeBracket,
    SubsidyCategory,
    SubsidySearchItem,
} from "@/types/onboarding";
import { getDaysInMonth } from "@/utils/date";
import { getApiErrorCode, handleApiError } from "@/utils/errorHandler";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useMemo, useState } from "react";
import {
    Controller,
    useForm,
    useWatch,
    type Control,
    type UseFormSetValue,
} from "react-hook-form";
import { useNavigate } from "react-router-dom";

const currentYear = new Date().getFullYear();
const years = Array.from(
    { length: 83 },
    (_, index) => currentYear - 14 - index
);
const months = Array.from({ length: 12 }, (_, index) => index + 1);

const Onboarding = () => {
    const navigate = useNavigate();
    const [step, setStep] = useState(1);
    const [profileSubmitted, setProfileSubmitted] = useState(false);

    const {
        control,
        handleSubmit,
        setValue,
        setError,
        trigger,
        formState: { errors, isSubmitting },
    } = useForm<OnboardingFormType>({
        resolver: zodResolver(onboardingSchema),
        defaultValues: {
            birthYear: 2000,
            birthMonth: 3,
            birthDay: 14,
            sido: "",
            sigungu: "",
            employmentStatus: "EMPLOYED",
            incomeBracket: undefined,
            householdSize: 1,
            receivedSubsidyIds: [],
        },
    });

    // watch() 대신 useWatch를 사용합니다. (React Compiler 호환)
    const [birthYear, birthMonth, birthDay, sido, sigungu] = useWatch({
        control,
        name: ["birthYear", "birthMonth", "birthDay", "sido", "sigungu"],
    });
    const days = getDaysInMonth(birthYear, birthMonth);
    const {
        sidoList,
        sigunguList,
        sigunguSido,
        sidoStatus,
        sigunguStatus,
        retrySido,
        retrySigungu,
    } = useRegionOptions(sido);
    const regionReady =
        sidoStatus === "ready" &&
        sidoList.includes(sido) &&
        sigunguStatus === "ready" &&
        sigunguSido === sido &&
        sigunguList.some(({ name }) => name === sigungu);

    useEffect(() => {
        if (sidoStatus !== "ready" || sidoList.includes(sido)) return;

        setValue("sido", sidoList[0] ?? "", { shouldValidate: true });
        setValue("sigungu", "", { shouldValidate: true });
    }, [setValue, sido, sidoList, sidoStatus]);

    useEffect(() => {
        if (
            sigunguStatus !== "ready" ||
            sigunguList.some(({ name }) => name === sigungu)
        ) {
            return;
        }

        setValue("sigungu", sigunguList[0]?.name ?? "", {
            shouldValidate: true,
        });
    }, [setValue, sigungu, sigunguList, sigunguStatus]);

    const age = useMemo(() => {
        const today = new Date();
        let calculatedAge = today.getFullYear() - birthYear;
        const birthdayPassed =
            today.getMonth() + 1 > birthMonth ||
            (today.getMonth() + 1 === birthMonth &&
                today.getDate() >= birthDay);

        if (!birthdayPassed) calculatedAge -= 1;
        return calculatedAge;
    }, [birthDay, birthMonth, birthYear]);

    const handleBack = () => {
        if (step === 1) navigate(-1);
        else setStep((previous) => previous - 1);
    };

    const onSubmit = async (values: OnboardingFormType) => {
        let profileSaved = profileSubmitted;

        try {
            if (!profileSaved) {
                const submitted = await submitOnboardingApi(
                    toOnboardingRequest(values)
                );
                if (!submitted.isSuccess) throw new Error(submitted.message);

                profileSaved = true;
                setProfileSubmitted(true);
            }

            // 선택이 없어도 빈 배열로 호출해 서버 상태를 화면과 일치시킵니다.
            const received = await setReceivedSubsidiesApi(
                values.receivedSubsidyIds
            );
            if (!received.isSuccess) {
                setError("root", {
                    message:
                        "기본정보는 저장됐지만 기수령 지원금을 저장하지 못했어요. 다시 시도해주세요.",
                });
                return;
            }

            const { user, login } = useAuthStore.getState();
            if (user) login({ ...user, onboardingCompleted: true });

            navigate("/", { replace: true });
        } catch (error) {
            if (profileSaved) {
                console.error(error);
                setError("root", {
                    message:
                        "기본정보는 저장됐지만 기수령 지원금을 저장하지 못했어요. 다시 시도해주세요.",
                });
                return;
            }

            // 이미 온보딩을 마친 회원이면 홈으로 보냅니다.
            if (getApiErrorCode(error) === "ONB409_1") {
                navigate("/", { replace: true });
                return;
            }
            handleApiError(
                error,
                setError,
                "온보딩 저장에 실패했어요. 다시 시도해주세요."
            );
        }
    };

    const goNext = async () => {
        const valid =
            step === 1
                ? await trigger([
                      "birthYear",
                      "birthMonth",
                      "birthDay",
                      "sido",
                      "sigungu",
                      "employmentStatus",
                  ])
                : true;

        if (valid) setStep((previous) => previous + 1);
    };

    const handleSkip = () => {
        if (step === 2) {
            // 선택 항목이므로 값을 비워 서버로 보내지 않습니다.
            setValue("incomeBracket", undefined);
            setValue("householdSize", undefined);
            setStep(3);
            return;
        }

        setValue("receivedSubsidyIds", []);
        void handleSubmit(onSubmit)();
    };

    return (
        <main className="bg-surface-dim flex min-h-svh justify-center">
            <section className="bg-ground text-text-strong flex min-h-svh w-full max-w-[390px] flex-col px-6 pt-[72px] pb-8">
                <Header showBack onBack={handleBack} />

                <div className="bg-line mt-3 h-[5px] overflow-hidden rounded-full">
                    <div
                        className="bg-primary h-full rounded-full transition-[width] duration-300"
                        style={{ width: `${(step / 3) * 100}%` }}
                    />
                </div>
                <p className="mt-2 text-[12px] font-semibold text-[#888]">
                    {step}/3 단계
                </p>

                <div className="mt-5 flex-1">
                    {step === 1 && (
                        <StepOne
                            control={control}
                            setValue={setValue}
                            age={age}
                            birthYear={birthYear}
                            birthMonth={birthMonth}
                            birthDay={birthDay}
                            days={days}
                            sidoList={sidoList}
                            sigunguList={sigunguList.map(({ name }) => name)}
                            sidoStatus={sidoStatus}
                            sigunguStatus={sigunguStatus}
                            retrySido={retrySido}
                            retrySigungu={retrySigungu}
                        />
                    )}
                    {step === 2 && <StepTwo control={control} />}
                    {step === 3 && <StepThree control={control} />}
                </div>

                {errors.root && (
                    <p className="text-danger mt-4 text-center text-[13px] font-semibold">
                        {errors.root.message}
                    </p>
                )}

                <Button
                    className="mt-7"
                    disabled={isSubmitting || (step === 1 && !regionReady)}
                    onClick={step === 3 ? handleSubmit(onSubmit) : goNext}
                >
                    {isSubmitting ? "저장 중..." : step === 3 ? "완료" : "다음"}
                </Button>
                {step > 1 && (
                    <button
                        className="mx-auto mt-4 cursor-pointer text-[12px] text-[#9a9a9a] underline underline-offset-2 disabled:opacity-50"
                        type="button"
                        disabled={isSubmitting}
                        onClick={handleSkip}
                    >
                        건너뛰기
                    </button>
                )}
            </section>
        </main>
    );
};

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

const StepOne = ({
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

        <FieldLabel>생년월일(필수)</FieldLabel>
        <div className="grid grid-cols-3 gap-3">
            <Controller
                control={control}
                name="birthYear"
                render={({ field }) => (
                    <Select
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
                            <p className="text-danger col-span-3 mt-1 text-[12px] font-semibold">
                                {fieldState.error.message}
                            </p>
                        )}
                    </>
                )}
            />
        </div>
        <div className="bg-green-light text-green-dark mt-3 rounded-[10px] px-4 py-3 text-[13px] font-semibold">
            만 {age}세로 계산돼요
        </div>

        <FieldLabel>거주지(필수)</FieldLabel>
        <div className="grid grid-cols-2 gap-3">
            <Controller
                control={control}
                name="sido"
                render={({ field }) => (
                    <Select
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
            <RegionLoadError
                message="지역 목록을 불러오지 못했어요"
                onRetry={retrySido}
            />
        )}
        {sidoStatus === "ready" && sidoList.length === 0 && (
            <RegionLoadError
                message="선택할 수 있는 지역이 없어요"
                onRetry={retrySido}
            />
        )}
        {sidoStatus === "ready" &&
            sidoList.length > 0 &&
            sigunguStatus === "error" && (
                <RegionLoadError
                    message="시·군·구 목록을 불러오지 못했어요"
                    onRetry={retrySigungu}
                />
            )}
        {sigunguStatus === "ready" && sigunguList.length === 0 && (
            <RegionLoadError
                message="선택할 수 있는 시·군·구가 없어요"
                onRetry={retrySigungu}
            />
        )}

        <FieldLabel>고용상태(필수)</FieldLabel>
        <Controller
            control={control}
            name="employmentStatus"
            render={({ field }) => (
                <div className="grid grid-cols-2 gap-3">
                    {employmentOptions.map(({ label, value }) => {
                        const selected = field.value === value;
                        return (
                            <button
                                className={`relative h-[46px] cursor-pointer rounded-[10px] border text-[14px] font-semibold ${selected ? "border-primary bg-green-light text-green-dark" : "border-[#d8d8d8] bg-white"}`}
                                type="button"
                                key={value}
                                onClick={() => field.onChange(value)}
                            >
                                {label}
                                {selected && (
                                    <span className="text-primary absolute top-1.5 right-2">
                                        ✓
                                    </span>
                                )}
                            </button>
                        );
                    })}
                </div>
            )}
        />
        <div className="bg-warning-light text-warning mt-4 rounded-[10px] px-4 py-3 text-center text-[12px] leading-[1.45] font-semibold">
            현재 고용상태는 지원금 추천 조건에만 활용되며
            <br />
            저장 후 언제든 수정할 수 있어요
        </div>
    </>
);

const StepTwo = ({ control }: { control: Control<OnboardingFormType> }) => (
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
            description="선택 항목이에요. 건너 뛰어도 괜찮아요"
        />

        <FieldLabel>월 소득구간</FieldLabel>
        <Controller
            control={control}
            name="incomeBracket"
            render={({ field }) => (
                <Select
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

        <FieldLabel>가구원 수</FieldLabel>
        <Controller
            control={control}
            name="householdSize"
            render={({ field }) => {
                const size = field.value ?? 1;
                return (
                    <div className="flex h-[52px] items-center justify-between rounded-[10px] border border-[#d8d8d8] bg-white px-4">
                        <CounterButton
                            label="가구원 수 줄이기"
                            onClick={() =>
                                field.onChange(Math.max(1, size - 1))
                            }
                        >
                            −
                        </CounterButton>
                        <span className="text-[15px] font-bold">{size}명</span>
                        <CounterButton
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

const StepThree = ({ control }: { control: Control<OnboardingFormType> }) => {
    const [query, setQuery] = useState("");
    const [debouncedQuery, setDebouncedQuery] = useState("");
    // null이면 전체 조회입니다. 백엔드 카탈로그에 카테고리가 채워지면 칩 필터가 동작합니다.
    const [category, setCategory] = useState<SubsidyCategory | null>(null);
    // 조회 결과를 검색 조건(key)과 함께 저장해, 로딩 여부를 파생값으로 계산합니다.
    // (effect 안에서 setState를 동기 호출하지 않기 위한 구조입니다)
    const [result, setResult] = useState<{
        key: string;
        items: SubsidySearchItem[];
    } | null>(null);

    const searchKey = `${category ?? ""}|${debouncedQuery}`;
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
                    category: category ?? undefined,
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
    }, [searchKey, debouncedQuery, category]);

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
                    className="focus:border-primary h-[50px] w-full rounded-[10px] border border-[#d8d8d8] bg-white pr-4 pl-11 text-[13px] outline-none placeholder:text-[#9a9a9a]"
                    value={query}
                    placeholder="지원금명 또는 기관명으로 검색해보세요"
                    onChange={(event) => setQuery(event.target.value)}
                />
            </div>

            <div className="mt-3 flex w-full items-center gap-1.5 overflow-x-auto pb-1">
                {[
                    { label: "전체", value: null },
                    ...subsidyCategoryOptions,
                ].map(({ label, value }) => (
                    <button
                        className={`shrink-0 cursor-pointer rounded-full px-[10px] py-[6px] text-[13px] leading-[16px] font-bold whitespace-nowrap ${category === value ? "bg-third text-white" : "bg-disabled text-text-muted"}`}
                        type="button"
                        key={label}
                        aria-pressed={category === value}
                        onClick={() => setCategory(value)}
                    >
                        {label}
                    </button>
                ))}
            </div>

            <FieldLabel>요즘 많이 찾는 지원금</FieldLabel>
            <Controller
                control={control}
                name="receivedSubsidyIds"
                render={({ field }) => (
                    <div className="flex flex-col gap-2.5">
                        {subsidies.map((subsidy) => {
                            const selected = field.value.includes(
                                subsidy.subsidyId
                            );
                            return (
                                <button
                                    className={`flex min-h-[66px] cursor-pointer items-center gap-4 rounded-[10px] border px-4 text-left ${selected ? "border-primary bg-green-light" : "border-[#d8d8d8] bg-white"}`}
                                    type="button"
                                    key={subsidy.subsidyId}
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
                                        className={`flex size-7 shrink-0 items-center justify-center rounded-full border ${selected ? "border-primary bg-primary text-white" : "border-[#c8c8c8]"}`}
                                    >
                                        {selected && "✓"}
                                    </span>
                                    <span>
                                        <strong className="block text-[14px]">
                                            {subsidy.name}
                                        </strong>
                                        {subsidy.agency && (
                                            <span className="mt-1 block text-[11px] text-[#8a8a8a]">
                                                {subsidy.agency}
                                            </span>
                                        )}
                                    </span>
                                </button>
                            );
                        })}

                        {subsidies.length === 0 && (
                            <p className="py-8 text-center text-[13px] text-[#999]">
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
        <p className="text-primary text-[13px] font-bold">{eyebrow}</p>
        <h1 className="mt-2 text-[24px] leading-[1.25] font-bold">{title}</h1>
        <p className="text-text-muted mt-2 text-[12px]">{description}</p>
    </header>
);

const FieldLabel = ({ children }: { children: React.ReactNode }) => (
    <h2 className="mt-7 mb-2.5 text-[13px] font-bold">{children}</h2>
);

const RegionLoadError = ({
    message,
    onRetry,
}: {
    message: string;
    onRetry: () => void;
}) => (
    <div className="mt-2 flex items-center justify-between gap-3">
        <p className="text-danger text-[12px] font-semibold">{message}</p>
        <button
            className="text-primary shrink-0 cursor-pointer text-[12px] font-bold"
            type="button"
            onClick={onRetry}
        >
            다시 시도
        </button>
    </div>
);

const Select = ({
    value,
    onChange,
    children,
    disabled = false,
}: {
    value: string | number;
    onChange: (value: string) => void;
    children: React.ReactNode;
    disabled?: boolean;
}) => (
    <select
        className="focus:border-primary disabled:bg-disabled h-[48px] w-full cursor-pointer rounded-[10px] border border-[#d8d8d8] bg-white px-3 text-[13px] font-semibold outline-none disabled:cursor-not-allowed"
        value={value}
        disabled={disabled}
        onChange={(event) => onChange(event.target.value)}
    >
        {children}
    </select>
);

const CounterButton = ({
    children,
    label,
    onClick,
}: {
    children: React.ReactNode;
    label: string;
    onClick: () => void;
}) => (
    <button
        className="flex size-7 cursor-pointer items-center justify-center rounded-full border border-[#bdbdbd] text-[20px] leading-none"
        type="button"
        aria-label={label}
        onClick={onClick}
    >
        {children}
    </button>
);

export default Onboarding;
