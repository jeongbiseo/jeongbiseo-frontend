import { agreementDetails, type AgreementKey } from "@/constants/termsContent";
import { useEffect, useState } from "react";
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
        className="h-[11px] w-[15px] shrink-0"
        viewBox="0 0 15 11"
        fill="none"
        aria-hidden="true"
    >
        <path
            d="M1 5.2 5.1 9 14 1"
            stroke={checked ? "#2fbf9f" : "#d9d9d9"}
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

    useEffect(() => {
        if (!selectedAgreement) {
            return;
        }

        const handleKeyDown = (event: KeyboardEvent) => {
            if (event.key === "Escape") {
                setSelectedAgreement(null);
            }
        };

        document.addEventListener("keydown", handleKeyDown);

        return () => document.removeEventListener("keydown", handleKeyDown);
    }, [selectedAgreement]);

    return (
        <>
            <main className="flex min-h-svh justify-center bg-[#ededed]">
                <section className="flex min-h-svh w-full max-w-[390px] flex-col bg-[#f9f9f9] px-8 pt-[72px] pb-8">
                    <button
                        className="flex h-6 w-6 cursor-pointer items-center justify-start text-black focus-visible:rounded focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#10b981]"
                        type="button"
                        aria-label="이전 화면으로 돌아가기"
                        onClick={() => navigate(-1)}
                    >
                        <svg
                            className="h-4 w-[18px]"
                            viewBox="0 0 18 16"
                            fill="none"
                            aria-hidden="true"
                        >
                            <path
                                d="M17 8H1M1 8l7-7M1 8l7 7"
                                stroke="currentColor"
                                strokeWidth="1.8"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                            />
                        </svg>
                    </button>

                    <h1 className="mt-3 -ml-[5px] text-[24px] leading-[1.2] font-bold text-black">
                        서비스 이용을 위해
                        <br />
                        약관에 동의해주세요
                    </h1>

                    <div className="mt-[34px] w-full max-w-[325px] self-center">
                        <button
                            className="flex cursor-pointer items-center gap-[11px] focus-visible:rounded focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#10b981]"
                            type="button"
                            role="checkbox"
                            aria-checked={allAgreed}
                            onClick={handleAllAgreement}
                        >
                            <span
                                className={`flex size-[26px] items-center justify-center rounded-full ${allAgreed ? "bg-[#2fbf9f]" : "bg-[#d9d9d9]"}`}
                            >
                                <svg
                                    className="h-[10px] w-[14px]"
                                    viewBox="0 0 14 10"
                                    fill="none"
                                    aria-hidden="true"
                                >
                                    <path
                                        d="M1 4.7 4.8 8.5 13 1"
                                        stroke="white"
                                        strokeWidth="1.7"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                    />
                                </svg>
                            </span>
                            <span className="text-[20px] leading-[1.2] font-bold text-black">
                                약관 전체동의
                            </span>
                        </button>

                        <div className="mt-4 h-px w-full bg-[#d9d9d9]" />

                        <ul className="mt-4 flex flex-col gap-[23px]">
                            {agreementItems.map(({ key, label, required }) => (
                                <li
                                    className="flex w-full items-center justify-between"
                                    key={key}
                                >
                                    <button
                                        className="flex min-w-0 cursor-pointer items-center gap-[18px] focus-visible:rounded focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#10b981]"
                                        type="button"
                                        role="checkbox"
                                        aria-checked={agreements[key]}
                                        onClick={() => handleAgreement(key)}
                                    >
                                        <CheckIcon checked={agreements[key]} />
                                        <span className="text-[clamp(14px,4.1vw,16px)] leading-[1.2] font-bold whitespace-nowrap text-[#808080]">
                                            [{required ? "필수" : "선택"}]{" "}
                                            {label}
                                        </span>
                                    </button>

                                    <button
                                        className="ml-2 shrink-0 cursor-pointer text-[13px] leading-none font-bold text-[rgba(128,128,128,0.7)] underline underline-offset-2 focus-visible:rounded focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#10b981]"
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

                    <button
                        className="mt-auto mb-[clamp(32px,11.9svh,112px)] h-[55px] w-full max-w-[325px] cursor-pointer self-center rounded-[15px] bg-[#10b981] text-[20px] leading-none font-bold text-white shadow-[3px_11px_8.15px_#bfebe1] transition-transform hover:brightness-[0.98] focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-[#0f2942] active:scale-[0.99] disabled:cursor-not-allowed disabled:bg-[#d9d9d9] disabled:shadow-none disabled:hover:brightness-100"
                        type="button"
                        disabled={!requiredAgreed}
                        onClick={() => navigate("/onboarding")}
                    >
                        동의하고 시작하기
                    </button>
                </section>
            </main>

            {selectedAgreementItem && selectedAgreementDetail && (
                <div
                    className="fixed inset-0 z-50 flex items-end justify-center bg-black/40"
                    role="presentation"
                    onClick={() => setSelectedAgreement(null)}
                >
                    <section
                        className="flex max-h-[75svh] min-h-[360px] w-full max-w-[390px] flex-col rounded-t-[24px] bg-white px-6 pt-6 pb-8 shadow-2xl"
                        role="dialog"
                        aria-modal="true"
                        aria-labelledby="terms-detail-title"
                        onClick={(event) => event.stopPropagation()}
                    >
                        <header className="flex items-start justify-between gap-4">
                            <div>
                                <p className="text-[14px] font-semibold text-[#10b981]">
                                    {selectedAgreementItem.required
                                        ? "필수 약관"
                                        : "선택 약관"}
                                </p>
                                <h2
                                    className="mt-1 text-[20px] leading-[1.35] font-bold text-black"
                                    id="terms-detail-title"
                                >
                                    {selectedAgreementItem.label}
                                </h2>
                            </div>

                            <button
                                className="flex size-9 shrink-0 cursor-pointer items-center justify-center rounded-full bg-[#f2f2f2] text-[#191919] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#10b981]"
                                type="button"
                                aria-label="약관 상세 닫기"
                                autoFocus
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

                        <div className="mt-6 flex-1 overflow-y-auto rounded-[15px] bg-[#f9f9f9] p-5 text-[15px] leading-[1.7] text-[#606060]">
                            <p className="font-semibold text-[#303030]">
                                {selectedAgreementDetail.summary}
                            </p>

                            <div className="mt-6 flex flex-col gap-6">
                                {selectedAgreementDetail.sections.map(
                                    ({ title, paragraphs, bullets }) => (
                                        <section key={title}>
                                            <h3 className="font-bold text-[#191919]">
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
                            className="mt-5 h-[52px] w-full cursor-pointer rounded-[15px] bg-[#10b981] text-[18px] font-bold text-white focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-[#0f2942]"
                            type="button"
                            onClick={() => setSelectedAgreement(null)}
                        >
                            확인
                        </button>
                    </section>
                </div>
            )}
        </>
    );
};

export default Terms;
