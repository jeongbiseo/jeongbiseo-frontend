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
import Button from "@/components/common/Button";
import Header from "@/components/common/Header";
import {
    OnboardingStepOne,
    OnboardingStepThree,
    OnboardingStepTwo,
} from "@/components/onboarding/OnboardingSteps";
import { useRegionOptions } from "@/hooks/useRegionOptions";
import {
    onboardingSchema,
    toOnboardingRequest,
    type OnboardingFormType,
} from "@/schema/onboardingSchema";
import { useAuthStore } from "@/stores/authStore";
import { getDaysInMonth } from "@/utils/date";
import { getApiErrorCode, handleApiError } from "@/utils/errorHandler";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useMemo, useState } from "react";
import { useForm, useWatch } from "react-hook-form";
import { useNavigate } from "react-router-dom";

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
            <section className="bg-ground text-text-strong px-page-inline pt-page-top flex min-h-svh w-full max-w-[390px] flex-col pb-6">
                <Header showBack onBack={handleBack} />

                <div className="bg-line mt-3 h-[6px] overflow-hidden rounded-full">
                    <div
                        className="bg-green-normal h-full rounded-full transition-[width] duration-300"
                        style={{ width: `${(step / 3) * 100}%` }}
                    />
                </div>
                <p className="text-text-subtle text-label-strong mt-2">
                    {step}/3 단계
                </p>

                <div className="mt-4 flex-1">
                    {step === 1 && (
                        <OnboardingStepOne
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
                    {step === 2 && <OnboardingStepTwo control={control} />}
                    {step === 3 && <OnboardingStepThree control={control} />}
                </div>

                {errors.root && (
                    <p className="text-danger text-label-medium mt-4 text-center">
                        {errors.root.message}
                    </p>
                )}

                <Button
                    className="mt-6"
                    disabled={isSubmitting || (step === 1 && !regionReady)}
                    onClick={step === 3 ? handleSubmit(onSubmit) : goNext}
                >
                    {isSubmitting ? "저장 중..." : step === 3 ? "완료" : "다음"}
                </Button>
                {step > 1 && (
                    <button
                        className="text-caption mx-auto mt-4 cursor-pointer text-[#9a9a9a] underline underline-offset-2 disabled:opacity-50"
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

export default Onboarding;
