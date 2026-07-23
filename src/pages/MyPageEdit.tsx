import { BackButton, MyPageLayout } from "@/components/mypage/MyPageUI";
import { BenefitAddSheet } from "@/components/mypage/BenefitAddSheet";
import Toast from "@/components/common/Toast";
import {
    CounterButton,
    FieldLabel,
    FormSelect as Select,
    InlineLoadState,
} from "@/components/common/form/FormControls";
import {
    employmentLabelOf,
    employmentOptions,
    incomeLabelOf,
    incomeOptions,
} from "@/constants/onboardingOptions";
import { useRegionOptions } from "@/hooks/useRegionOptions";
import { useEffect, useRef, useState } from "react";
import { useSearchParams } from "react-router-dom";
import {
    getMyOnboardingApi,
    getReceivedSubsidiesApi,
    setReceivedSubsidiesApi,
    updateMyOnboardingApi,
} from "@/api/onboardingApi";
import type { ReceivedBenefit } from "@/types/onboarding";
import { getDaysInMonth } from "@/utils/date";

const currentYear = new Date().getFullYear();
const years = Array.from(
    { length: 83 },
    (_, index) => currentYear - 14 - index
);
const months = Array.from({ length: 12 }, (_, index) => index + 1);

const MyPageEdit = () => {
    const [searchParams] = useSearchParams();
    const receivedSectionRef = useRef<HTMLDivElement>(null);
    const [birthYear, setBirthYear] = useState(years[0]);
    const [birthMonth, setBirthMonth] = useState(1);
    const [birthDay, setBirthDay] = useState(1);
    const days = getDaysInMonth(birthYear, birthMonth);
    const [city, setCity] = useState("");
    const [district, setDistrict] = useState("");
    const [employment, setEmployment] = useState("");
    const [income, setIncome] = useState("");
    const [householdSize, setHouseholdSize] = useState(1);
    const [profileStatus, setProfileStatus] = useState<
        "loading" | "ready" | "error"
    >("loading");
    const [profileReloadKey, setProfileReloadKey] = useState(0);
    const [receivedBenefits, setReceivedBenefits] = useState<ReceivedBenefit[]>(
        []
    );
    const [receivedLoading, setReceivedLoading] = useState(true);
    const [receivedError, setReceivedError] = useState(false);
    const [receivedReloadKey, setReceivedReloadKey] = useState(0);
    const [addSheetOpen, setAddSheetOpen] = useState(false);
    const [saved, setSaved] = useState(false);
    const [saving, setSaving] = useState(false);
    const [toastMessage, setToastMessage] = useState<string | null>(null);
    const {
        sidoList,
        sigunguList,
        sigunguSido,
        sidoStatus,
        sigunguStatus,
        retrySido,
        retrySigungu,
    } = useRegionOptions(city);
    const resolvedCity = sidoList.includes(city) ? city : (sidoList[0] ?? "");
    const resolvedDistrict = sigunguList.some(({ name }) => name === district)
        ? district
        : (sigunguList[0]?.name ?? "");
    const regionReady =
        sidoStatus === "ready" &&
        Boolean(resolvedCity) &&
        sigunguStatus === "ready" &&
        sigunguSido === resolvedCity &&
        Boolean(resolvedDistrict);

    useEffect(() => {
        let active = true;

        const loadProfile = async () => {
            setProfileStatus("loading");
            try {
                const response = await getMyOnboardingApi();

                if (!response.isSuccess) {
                    throw new Error(response.message);
                }

                if (!active) return;

                const profile = response.result;
                const [year, month, day] = profile.birthDate
                    .split("-")
                    .map(Number);

                setBirthYear(year);
                setBirthMonth(month);
                setBirthDay(day);
                setCity(profile.sido);
                setDistrict(profile.sigungu);
                setEmployment(employmentLabelOf(profile.employmentStatus));
                setIncome(incomeLabelOf(profile.incomeBracket));
                setHouseholdSize(profile.householdSize ?? 1);
                setProfileStatus("ready");
            } catch (error) {
                console.error(error);
                if (active) setProfileStatus("error");
            }
        };

        void loadProfile();

        return () => {
            active = false;
        };
    }, [profileReloadKey]);

    useEffect(() => {
        let active = true;

        const loadReceivedBenefits = async () => {
            setReceivedLoading(true);
            setReceivedError(false);

            try {
                const response = await getReceivedSubsidiesApi();

                if (!response.isSuccess) {
                    throw new Error(response.message);
                }

                if (!active) return;

                setReceivedBenefits(
                    response.result.content.map((benefit) => ({
                        id: benefit.subsidyId,
                        title: benefit.name,
                        organization: "",
                        categories: [],
                    }))
                );
            } catch (error) {
                console.error(error);
                if (active) setReceivedError(true);
            } finally {
                if (active) setReceivedLoading(false);
            }
        };

        void loadReceivedBenefits();

        return () => {
            active = false;
        };
    }, [receivedReloadKey]);

    useEffect(() => {
        if (searchParams.get("section") !== "received") return;

        const frame = window.requestAnimationFrame(() => {
            receivedSectionRef.current?.scrollIntoView({
                behavior: "smooth",
                block: "start",
            });
        });
        return () => window.cancelAnimationFrame(frame);
    }, [searchParams]);

    const updateReceivedBenefits = (benefits: ReceivedBenefit[]) => {
        setReceivedBenefits(benefits);
    };

    if (profileStatus !== "ready") {
        return (
            <MyPageLayout className="pt-[56px]">
                <BackButton />
                <div className="flex min-h-[65svh] flex-col items-center justify-center px-6 text-center">
                    <h1 className="text-[20px] font-bold">
                        {profileStatus === "loading"
                            ? "내 정보를 불러오고 있어요"
                            : "내 정보를 불러오지 못했어요"}
                    </h1>
                    <p className="text-text-muted mt-2 text-[13px] font-semibold">
                        {profileStatus === "loading"
                            ? "잠시만 기다려주세요."
                            : "네트워크 상태를 확인한 뒤 다시 시도해주세요."}
                    </p>
                    {profileStatus === "error" && (
                        <button
                            className="bg-primary mt-5 rounded-[12px] px-5 py-3 text-[14px] font-bold text-white"
                            type="button"
                            onClick={() =>
                                setProfileReloadKey((previous) => previous + 1)
                            }
                        >
                            다시 시도
                        </button>
                    )}
                </div>
            </MyPageLayout>
        );
    }

    const handleSave = async () => {
        const employmentStatus = employmentOptions.find(
            (option) => option.label === employment
        )?.value;
        const incomeBracket = incomeOptions.find(
            (option) => option.label === income
        )?.value;

        if (!employmentStatus) {
            setToastMessage("고용상태를 선택해주세요.");
            return;
        }

        if (!regionReady) {
            setToastMessage("거주지 정보를 다시 확인해주세요.");
            return;
        }

        if (receivedLoading || receivedError) {
            setToastMessage("기수령 지원금을 먼저 불러와주세요.");
            return;
        }

        setSaving(true);
        setSaved(false);

        let profileSaved = false;

        try {
            const profileResponse = await updateMyOnboardingApi({
                birthDate: `${birthYear}-${String(birthMonth).padStart(2, "0")}-${String(birthDay).padStart(2, "0")}`,
                sido: resolvedCity,
                sigungu: resolvedDistrict,
                employmentStatus,
                ...(incomeBracket ? { incomeBracket } : {}),
                householdSize,
            });

            if (!profileResponse.isSuccess) {
                throw new Error(profileResponse.message);
            }
            profileSaved = true;

            const receivedResponse = await setReceivedSubsidiesApi(
                receivedBenefits.map((benefit) => benefit.id)
            );

            if (!receivedResponse.isSuccess) {
                throw new Error(receivedResponse.message);
            }

            setSaved(true);
            window.setTimeout(() => setSaved(false), 1800);
        } catch (error) {
            console.error(error);
            setToastMessage(
                profileSaved
                    ? "프로필은 저장됐지만 기수령 지원금은 저장하지 못했습니다."
                    : "정보를 저장하지 못했습니다. 다시 시도해주세요."
            );
        } finally {
            setSaving(false);
        }
    };

    return (
        <>
            <MyPageLayout className="pt-[56px]">
                <BackButton />
                <header className="mt-0">
                    <p className="text-[16px] font-semibold">내 정보 수정</p>
                    <h1 className="mt-1 text-[20px] font-bold">
                        추천 기준 정보
                    </h1>
                    <p className="text-text-subtle mt-2 text-[13px] font-semibold">
                        아래 정보는 지원금 추천에 직접 사용됩니다.
                    </p>
                </header>

                <FieldLabel>생년월일</FieldLabel>
                <div className="grid grid-cols-3 gap-[13px]">
                    <Select
                        value={birthYear}
                        onChange={(nextYear) => {
                            setBirthYear(nextYear);
                            setBirthDay((day) =>
                                Math.min(
                                    day,
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
                        value={birthMonth}
                        onChange={(nextMonth) => {
                            setBirthMonth(nextMonth);
                            setBirthDay((day) =>
                                Math.min(
                                    day,
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
                    <Select value={birthDay} onChange={setBirthDay}>
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
                        value={resolvedCity}
                        disabled={
                            sidoStatus !== "ready" || sidoList.length === 0
                        }
                        onChange={(value) => {
                            const nextCity = String(value);
                            setCity(nextCity);
                            setDistrict("");
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
                    <Select
                        value={resolvedDistrict}
                        disabled={
                            sigunguStatus !== "ready" ||
                            sigunguSido !== resolvedCity ||
                            sigunguList.length === 0
                        }
                        onChange={setDistrict}
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
                {sigunguStatus === "ready" &&
                    sigunguSido === resolvedCity &&
                    sigunguList.length === 0 && (
                        <InlineLoadState
                            message="선택할 수 있는 시·군·구가 없어요"
                            onRetry={retrySigungu}
                        />
                    )}

                <FieldLabel>고용상태</FieldLabel>
                <Select value={employment} onChange={setEmployment}>
                    {employmentOptions.map(({ label, value }) => (
                        <option key={value}>{label}</option>
                    ))}
                </Select>

                <FieldLabel>월 소득구간</FieldLabel>
                <Select value={income} onChange={setIncome}>
                    <option value="">선택 안 함</option>
                    {incomeOptions.map(({ label, value }) => (
                        <option key={value}>{label}</option>
                    ))}
                </Select>
                <p className="text-text-subtle mt-2 text-[12px] font-semibold">
                    중위소득 기준 지원금 매칭에 활용돼요
                </p>

                <FieldLabel>가구원 수</FieldLabel>
                <div className="border-line-strong flex h-[48px] items-center justify-between rounded-[10px] border bg-white px-7">
                    <CounterButton
                        label="가구원 수 줄이기"
                        onClick={() =>
                            setHouseholdSize((previous) =>
                                Math.max(1, previous - 1)
                            )
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
                            setHouseholdSize((previous) =>
                                Math.min(10, previous + 1)
                            )
                        }
                    >
                        ＋
                    </CounterButton>
                </div>
                <p className="text-text-subtle mt-2 text-[12px] font-semibold">
                    가구원 수에 따라 주거 · 육아 지원금 범위가 달라져요
                </p>

                <div className="scroll-mt-6 pt-9" ref={receivedSectionRef}>
                    <h2 className="text-[20px] font-bold">
                        기존 수령중인 지원금
                    </h2>
                    <p className="text-text-subtle mt-2 text-[12px] font-semibold">
                        이미 받고 있는 지원금을 선택하면 중복 추천을
                        줄여드립니다
                    </p>

                    <div className="mt-4 flex flex-col gap-3">
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
                                    onClick={() =>
                                        setReceivedReloadKey(
                                            (previous) => previous + 1
                                        )
                                    }
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
                                    className="bg-success-light flex min-h-[54px] items-center justify-between rounded-[10px] px-6"
                                    key={benefit.id}
                                >
                                    <strong className="text-[14px]">
                                        {benefit.title}
                                    </strong>
                                    <button
                                        className="border-text-muted cursor-pointer rounded-full border px-3 py-1 text-[12px] font-bold"
                                        type="button"
                                        onClick={() =>
                                            updateReceivedBenefits(
                                                receivedBenefits.filter(
                                                    ({ id }) =>
                                                        id !== benefit.id
                                                )
                                            )
                                        }
                                    >
                                        삭제
                                    </button>
                                </div>
                            ))}
                    </div>

                    <button
                        className="bg-primary mt-4 h-[42px] cursor-pointer rounded-[15px] px-5 text-[15px] font-bold text-white shadow-[3px_8px_10px_var(--color-green-shadow)]"
                        type="button"
                        disabled={receivedLoading || receivedError}
                        onClick={() => setAddSheetOpen(true)}
                    >
                        기존 수령중인 지원금 추가
                    </button>
                </div>

                <button
                    className="bg-third mt-9 h-[39px] w-[341px] max-w-full cursor-pointer rounded-[15px] text-[16px] font-bold text-white"
                    type="button"
                    disabled={
                        saving ||
                        receivedLoading ||
                        receivedError ||
                        !regionReady
                    }
                    onClick={handleSave}
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
            </MyPageLayout>

            <BenefitAddSheet
                open={addSheetOpen}
                receivedBenefits={receivedBenefits}
                onClose={() => setAddSheetOpen(false)}
                onSave={(benefits) => {
                    updateReceivedBenefits(benefits);
                    setAddSheetOpen(false);
                }}
            />
            <Toast
                message={toastMessage}
                onDismiss={() => setToastMessage(null)}
            />
        </>
    );
};

export default MyPageEdit;
