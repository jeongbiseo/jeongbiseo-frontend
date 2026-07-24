import { updateMarketingConsentApi } from "@/api/termsApi";
import Button from "@/components/common/Button";
import Header from "@/components/common/Header";
import Toast from "@/components/common/Toast";
import { agreementDetails, type AgreementKey } from "@/constants/termsContent";
import { useDialogAccessibility } from "@/hooks/useDialogAccessibility";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

type Agreements = Record<AgreementKey, boolean>;

const agreementItems: Array<{
    key: AgreementKey;
    label: string;
    required: boolean;
}> = [
    { key: "service", label: "서비스 이용약관 동의", required: true },
    { key: "privacy", label: "개인정보 수집 및 이용 동의", required: true },
    { key: "thirdParty", label: "개인정보 제3자 제공 동의", required: true },
    { key: "age", label: "만 14세 이상 확인", required: true },
    { key: "marketing", label: "마케팅 정보 수신 동의", required: false },
];

const initialAgreements: Agreements = {
    service: false,
    privacy: false,
    thirdParty: false,
    age: false,
    marketing: false,
};

const CheckIcon = ({ checked }: { checked: boolean }) => (
    <svg
        className="size-icon-sm shrink-0"
        viewBox="0 0 16 16"
        fill="none"
        aria-hidden="true"
    >
        <path
            d="m2 8 4 4 8-8"
            stroke={checked ? "var(--color-primary)" : "var(--color-disabled)"}
            strokeWidth="1.7"
            strokeLinecap="round"
            strokeLinejoin="round"
        />
    </svg>
);

// 약관동의 페이지 ('/terms')
const Terms = () => {
    const navigate = useNavigate();
    const [agreements, setAgreements] = useState<Agreements>(initialAgreements);
    const [selectedAgreement, setSelectedAgreement] =
        useState<AgreementKey | null>(null);
    const [submitting, setSubmitting] = useState(false);
    const [toastMessage, setToastMessage] = useState<string | null>(null);
    const termsDialogRef = useDialogAccessibility<HTMLElement>(
        selectedAgreement !== null,
        () => setSelectedAgreement(null)
    );

    const selectedAgreementItem = agreementItems.find(
        ({ key }) => key === selectedAgreement
    );
    const selectedAgreementDetail = selectedAgreement
        ? agreementDetails[selectedAgreement]
        : null;

    const allAgreed = agreementItems.every(({ key }) => agreements[key]);
    const requiredAgreed = agreementItems
        .filter(({ required }) => required)
        .every(({ key }) => agreements[key]);

    const handleAllAgreement = () => {
        const nextValue = !allAgreed;

        setAgreements({
            service: nextValue,
            privacy: nextValue,
            thirdParty: nextValue,
            age: nextValue,
            marketing: nextValue,
        });
    };

    const handleAgreement = (key: AgreementKey) => {
        setAgreements((previous) => ({
            ...previous,
            [key]: !previous[key],
        }));
    };

    const handleContinue = async () => {
        if (!requiredAgreed || submitting) return;

        setSubmitting(true);

        try {
            const response = await updateMarketingConsentApi(
                agreements.marketing
            );
            if (!response.isSuccess) throw new Error(response.message);

            navigate("/onboarding");
        } catch (error) {
            console.error(error);
            setToastMessage(
                "동의 정보를 저장하지 못했어요. 다시 시도해주세요."
            );
            setSubmitting(false);
        }
    };

    return (
        <>
            <main className="bg-surface-dim flex min-h-svh justify-center">
                <section className="bg-ground px-page-inline pt-page-top flex min-h-svh w-full max-w-[390px] flex-col pb-6">
                    <Header showBack />

                    <h1 className="text-heading-page mt-layout-inline text-black">
                        서비스 이용을 위해
                        <br />
                        약관에 동의해주세요
                    </h1>

                    <div className="mt-layout-group w-full max-w-[325px] self-center">
                        <button
                            className="focus-visible:outline-primary gap-layout-inline flex cursor-pointer items-center focus-visible:rounded focus-visible:outline-2 focus-visible:outline-offset-2"
                            type="button"
                            role="checkbox"
                            aria-checked={allAgreed}
                            onClick={handleAllAgreement}
                        >
                            <span
                                className={`flex size-[26px] items-center justify-center rounded-full ${allAgreed ? "bg-green-normal" : "bg-disabled"}`}
                            >
                                <svg
                                    className="size-icon-sm"
                                    viewBox="0 0 16 16"
                                    fill="none"
                                    aria-hidden="true"
                                >
                                    <path
                                        d="m2 8 4 4 8-8"
                                        stroke="white"
                                        strokeWidth="1.7"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                    />
                                </svg>
                            </span>
                            <span className="text-heading-section text-black">
                                약관 전체동의
                            </span>
                        </button>

                        <div className="bg-disabled mt-4 h-px w-full" />

                        <ul className="gap-layout-component mt-4 flex flex-col">
                            {agreementItems.map(({ key, label, required }) => (
                                <li
                                    className="flex w-full items-center justify-between"
                                    key={key}
                                >
                                    <button
                                        className="focus-visible:outline-primary gap-layout-related flex min-w-0 cursor-pointer items-center focus-visible:rounded focus-visible:outline-2 focus-visible:outline-offset-2"
                                        type="button"
                                        role="checkbox"
                                        aria-checked={agreements[key]}
                                        onClick={() => handleAgreement(key)}
                                    >
                                        <CheckIcon checked={agreements[key]} />
                                        <span className="text-text-muted text-body-sm-strong whitespace-nowrap">
                                            [{required ? "필수" : "선택"}]{" "}
                                            {label}
                                        </span>
                                    </button>

                                    <button
                                        className="text-text-muted/70 focus-visible:outline-primary text-label-strong ml-2 shrink-0 cursor-pointer underline underline-offset-2 focus-visible:rounded focus-visible:outline-2 focus-visible:outline-offset-2"
                                        type="button"
                                        aria-haspopup="dialog"
                                        onClick={() =>
                                            setSelectedAgreement(key)
                                        }
                                    >
                                        더보기
                                    </button>
                                </li>
                            ))}
                        </ul>
                    </div>

                    <Button
                        className="mt-auto mb-[clamp(32px,11.9svh,112px)] max-w-[325px] self-center"
                        disabled={!requiredAgreed || submitting}
                        onClick={() => void handleContinue()}
                    >
                        {submitting ? "저장 중..." : "동의하고 시작하기"}
                    </Button>
                </section>
            </main>

            {selectedAgreementItem && selectedAgreementDetail && (
                <div
                    className="fixed inset-0 z-50 flex items-end justify-center bg-black/40"
                    role="presentation"
                    onClick={(event) => {
                        if (event.target === event.currentTarget) {
                            setSelectedAgreement(null);
                        }
                    }}
                >
                    <section
                        ref={termsDialogRef}
                        tabIndex={-1}
                        className="rounded-t-sheet px-page-inline flex max-h-[75svh] min-h-[360px] w-full max-w-[390px] flex-col bg-white pt-4 pb-6 shadow-2xl"
                        role="dialog"
                        aria-modal="true"
                        aria-labelledby="terms-detail-title"
                    >
                        <header className="flex items-start justify-between gap-4">
                            <div>
                                <p className="text-primary text-label-strong">
                                    {selectedAgreementItem.required
                                        ? "필수 약관"
                                        : "선택 약관"}
                                </p>
                                <h2
                                    className="text-heading-section mt-1 text-black"
                                    id="terms-detail-title"
                                >
                                    {selectedAgreementItem.label}
                                </h2>
                            </div>

                            <button
                                className="text-text-strong focus-visible:outline-primary flex size-9 shrink-0 cursor-pointer items-center justify-center rounded-full bg-[#f2f2f2] focus-visible:outline-2 focus-visible:outline-offset-2"
                                type="button"
                                aria-label="약관 상세 닫기"
                                onClick={() => setSelectedAgreement(null)}
                            >
                                <svg
                                    className="size-4"
                                    viewBox="0 0 16 16"
                                    fill="none"
                                    aria-hidden="true"
                                >
                                    <path
                                        d="m2 2 12 12M14 2 2 14"
                                        stroke="currentColor"
                                        strokeWidth="1.8"
                                        strokeLinecap="round"
                                    />
                                </svg>
                            </button>
                        </header>

                        <div className="bg-ground text-label rounded-card mt-4 flex-1 overflow-y-auto p-4 text-[#606060]">
                            <p className="text-label-medium text-[#303030]">
                                {selectedAgreementDetail.summary}
                            </p>

                            <div className="mt-6 flex flex-col gap-6">
                                {selectedAgreementDetail.sections.map(
                                    ({ title, paragraphs, bullets }) => (
                                        <section key={title}>
                                            <h3 className="text-text-strong text-title">
                                                {title}
                                            </h3>

                                            {paragraphs?.map((paragraph) => (
                                                <p
                                                    className="mt-2"
                                                    key={paragraph}
                                                >
                                                    {paragraph}
                                                </p>
                                            ))}

                                            {bullets && (
                                                <ul className="mt-2 list-disc space-y-1.5 pl-5">
                                                    {bullets.map((bullet) => (
                                                        <li key={bullet}>
                                                            {bullet}
                                                        </li>
                                                    ))}
                                                </ul>
                                            )}
                                        </section>
                                    )
                                )}
                            </div>
                        </div>

                        <button
                            className="bg-green-normal focus-visible:outline-third text-body-strong rounded-control mt-4 h-[52px] w-full cursor-pointer text-white focus-visible:outline-3 focus-visible:outline-offset-2"
                            type="button"
                            onClick={() => setSelectedAgreement(null)}
                        >
                            확인
                        </button>
                    </section>
                </div>
            )}
            <Toast
                message={toastMessage}
                onDismiss={() => setToastMessage(null)}
            />
        </>
    );
};

export default Terms;
