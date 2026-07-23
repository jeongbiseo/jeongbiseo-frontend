import { BackButton, MyPageLayout } from "@/components/mypage/MyPageUI";
import { BenefitAddSheet } from "@/components/mypage/BenefitAddSheet";
import { MyPageProfileForm } from "@/components/mypage/MyPageProfileForm";
import Toast from "@/components/common/Toast";
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

const currentYear = new Date().getFullYear();

const MyPageEdit = () => {
    const [searchParams] = useSearchParams();
    const receivedSectionRef = useRef<HTMLDivElement>(null);
    const [birthYear, setBirthYear] = useState(currentYear - 14);
    const [birthMonth, setBirthMonth] = useState(1);
    const [birthDay, setBirthDay] = useState(1);
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
                <MyPageProfileForm
                    birthYear={birthYear}
                    birthMonth={birthMonth}
                    birthDay={birthDay}
                    city={resolvedCity}
                    district={resolvedDistrict}
                    employment={employment}
                    income={income}
                    householdSize={householdSize}
                    sidoList={sidoList}
                    sigunguList={sigunguList}
                    sigunguSido={sigunguSido}
                    sidoStatus={sidoStatus}
                    sigunguStatus={sigunguStatus}
                    receivedBenefits={receivedBenefits}
                    receivedLoading={receivedLoading}
                    receivedError={receivedError}
                    receivedSectionRef={receivedSectionRef}
                    saving={saving}
                    saved={saved}
                    regionReady={regionReady}
                    onBirthYearChange={setBirthYear}
                    onBirthMonthChange={setBirthMonth}
                    onBirthDayChange={setBirthDay}
                    onCityChange={(nextCity) => {
                        setCity(nextCity);
                        setDistrict("");
                    }}
                    onDistrictChange={setDistrict}
                    onEmploymentChange={setEmployment}
                    onIncomeChange={setIncome}
                    onHouseholdSizeChange={setHouseholdSize}
                    onRetrySido={retrySido}
                    onRetrySigungu={retrySigungu}
                    onRetryReceived={() =>
                        setReceivedReloadKey((previous) => previous + 1)
                    }
                    onRemoveReceived={(id) =>
                        updateReceivedBenefits(
                            receivedBenefits.filter(
                                (benefit) => benefit.id !== id
                            )
                        )
                    }
                    onOpenBenefitSheet={() => setAddSheetOpen(true)}
                    onSave={handleSave}
                />
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
