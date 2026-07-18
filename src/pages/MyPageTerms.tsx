import {
    BackButton,
    ChevronRightIcon,
    MyPageLayout,
} from "@/components/mypage/MyPageUI";
import { agreementDetails, type AgreementKey } from "@/constants/termsContent";
import { useState } from "react";

const MyPageTerms = () => {
    const [marketingAgreed, setMarketingAgreed] = useState(true);
    const [selectedTerm, setSelectedTerm] = useState<AgreementKey | null>(null);

    const terms = [
        { key: "service" as const, label: "서비스 이용약관" },
        { key: "privacy" as const, label: "개인정보 처리방침" },
    ];

    return (
        <>
            <MyPageLayout className="px-[31px] pt-[56px]">
                <BackButton className="-ml-3" />
                <h1 className="mt-0 text-[24px] font-bold">
                    이용약관 · 개인정보처리방침
                </h1>

                <div className="border-primary mt-8 overflow-hidden rounded-[20px] border bg-white">
                    {terms.map((term, index) => (
                        <button
                            className={`flex h-[79px] w-full cursor-pointer items-center justify-between px-4 text-left ${index > 0 ? "border-line border-t" : ""}`}
                            type="button"
                            key={term.key}
                            onClick={() => setSelectedTerm(term.key)}
                        >
                            <span>
                                <strong className="block text-[16px]">
                                    {term.label}
                                </strong>
                                <span className="text-text-muted mt-2 block text-[13px] font-bold">
                                    최종 수정 2026.06.01
                                </span>
                            </span>
                            <span className="text-text-muted">
                                <ChevronRightIcon />
                            </span>
                        </button>
                    ))}
                </div>

                <label className="border-primary mt-6 flex h-[57px] cursor-pointer items-center justify-between rounded-[15px] border bg-white px-5 text-[16px] font-bold">
                    이벤트·혜택 정보 수신 동의
                    <input
                        className="peer sr-only"
                        type="checkbox"
                        checked={marketingAgreed}
                        onChange={(event) =>
                            setMarketingAgreed(event.target.checked)
                        }
                    />
                    <span className="bg-disabled peer-checked:bg-primary relative h-5 w-[34px] rounded-full transition-colors after:absolute after:top-[2px] after:left-[2px] after:size-4 after:rounded-full after:bg-white after:transition-transform peer-checked:after:translate-x-[14px]" />
                </label>
            </MyPageLayout>

            <TermsDetailSheet
                termKey={selectedTerm}
                onClose={() => setSelectedTerm(null)}
            />
        </>
    );
};

const TermsDetailSheet = ({
    termKey,
    onClose,
}: {
    termKey: AgreementKey | null;
    onClose: () => void;
}) => {
    if (!termKey) return null;

    const detail = agreementDetails[termKey];
    const title =
        termKey === "service" ? "서비스 이용약관" : "개인정보 처리방침";

    return (
        <div
            className="fixed inset-0 z-50 flex items-end justify-center bg-black/30"
            role="presentation"
            onClick={onClose}
        >
            <section
                className="max-h-[86svh] w-full max-w-[390px] overflow-y-auto rounded-t-[28px] bg-white px-6 pt-4 pb-10"
                role="dialog"
                aria-modal="true"
                aria-labelledby="terms-detail-title"
                onClick={(event) => event.stopPropagation()}
            >
                <div className="bg-disabled mx-auto h-1 w-[44px] rounded-full" />
                <div className="mt-5 flex items-start justify-between gap-4">
                    <div>
                        <h2
                            className="text-[20px] font-bold"
                            id="terms-detail-title"
                        >
                            {title}
                        </h2>
                        <p className="text-text-subtle mt-1 text-[12px] font-semibold">
                            버전 1.0.0 · 최종 수정 2026.06.01
                        </p>
                    </div>
                    <button
                        className="bg-surface-soft flex size-8 cursor-pointer items-center justify-center rounded-full text-[20px]"
                        type="button"
                        aria-label="약관 상세 닫기"
                        onClick={onClose}
                    >
                        ×
                    </button>
                </div>

                <p className="text-text-body mt-6 text-[13px] leading-[1.7]">
                    {detail.summary}
                </p>
                <div className="mt-6 flex flex-col gap-6">
                    {detail.sections.map((section) => (
                        <section key={section.title}>
                            <h3 className="text-[15px] font-bold">
                                {section.title}
                            </h3>
                            {section.paragraphs?.map((paragraph) => (
                                <p
                                    className="text-text-secondary mt-2 text-[13px] leading-[1.7]"
                                    key={paragraph}
                                >
                                    {paragraph}
                                </p>
                            ))}
                            {section.bullets && (
                                <ul className="text-text-secondary mt-2 list-disc space-y-1.5 pl-5 text-[13px] leading-[1.6]">
                                    {section.bullets.map((bullet) => (
                                        <li key={bullet}>{bullet}</li>
                                    ))}
                                </ul>
                            )}
                        </section>
                    ))}
                </div>
            </section>
        </div>
    );
};

export default MyPageTerms;
