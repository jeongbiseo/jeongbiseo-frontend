import {
    getMyTermConsentsApi,
    updateMarketingConsentApi,
} from "@/api/termsApi";
import Button from "@/components/common/Button";
import Toast from "@/components/common/Toast";
import {
    BackButton,
    ChevronRightIcon,
    MyPageLayout,
} from "@/components/mypage/MyPageUI";
import { agreementDetails, type AgreementKey } from "@/constants/termsContent";
import { useDialogAccessibility } from "@/hooks/useDialogAccessibility";
import type { TermConsentItem, TermConsentType } from "@/types/terms";
import { useEffect, useState } from "react";

const MyPageTerms = () => {
    const [status, setStatus] = useState<"loading" | "ready" | "error">(
        "loading"
    );
    const [termConsents, setTermConsents] = useState<TermConsentItem[]>([]);
    const [marketingAgreed, setMarketingAgreed] = useState(false);
    const [marketingSaving, setMarketingSaving] = useState(false);
    const [reloadKey, setReloadKey] = useState(0);
    const [toastMessage, setToastMessage] = useState<string | null>(null);
    const [selectedTerm, setSelectedTerm] = useState<AgreementKey | null>(null);

    const terms = [
        {
            key: "service" as const,
            type: "SERVICE" as const,
            label: "서비스 이용약관",
        },
        {
            key: "privacy" as const,
            type: "PRIVACY" as const,
            label: "개인정보 처리방침",
        },
    ];

    useEffect(() => {
        let active = true;

        const loadTermConsents = async () => {
            try {
                const response = await getMyTermConsentsApi();

                if (!response.isSuccess) throw new Error(response.message);
                if (!active) return;

                setTermConsents(response.result.terms);
                setMarketingAgreed(response.result.marketingConsent);
                setStatus("ready");
            } catch (error) {
                console.error(error);
                if (active) setStatus("error");
            }
        };

        void loadTermConsents();

        return () => {
            active = false;
        };
    }, [reloadKey]);

    const getConsent = (type: TermConsentType) =>
        termConsents.find((term) => term.type === type);

    const handleMarketingChange = async (agreed: boolean) => {
        if (marketingSaving) return;

        const previous = marketingAgreed;
        setMarketingAgreed(agreed);
        setMarketingSaving(true);

        try {
            const response = await updateMarketingConsentApi(agreed);
            if (!response.isSuccess) throw new Error(response.message);

            setMarketingAgreed(response.result.agreed);
            setToastMessage("마케팅 수신 동의를 변경했어요.");
        } catch (error) {
            console.error(error);
            setMarketingAgreed(previous);
            setToastMessage("마케팅 수신 동의를 변경하지 못했어요.");
        } finally {
            setMarketingSaving(false);
        }
    };

    return (
        <>
            <MyPageLayout className="px-[31px] pt-[56px]">
                <BackButton className="-ml-3" />
                <h1 className="mt-0 text-[24px] font-bold">
                    이용약관 · 개인정보처리방침
                </h1>

                {status === "loading" && (
                    <p className="text-text-muted mt-10 text-center text-[14px] font-semibold">
                        약관 정보를 불러오는 중이에요...
                    </p>
                )}

                {status === "error" && (
                    <div className="mt-10 text-center">
                        <p className="text-text-muted text-[14px] font-semibold">
                            약관 정보를 불러오지 못했어요.
                        </p>
                        <Button
                            className="mt-5"
                            onClick={() => {
                                setStatus("loading");
                                setReloadKey((key) => key + 1);
                            }}
                        >
                            다시 시도
                        </Button>
                    </div>
                )}

                {status === "ready" && (
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
                                        {getConsent(term.type)?.agreed
                                            ? "동의 완료"
                                            : "동의 내역 없음"}
                                    </span>
                                </span>
                                <span className="text-text-muted">
                                    <ChevronRightIcon />
                                </span>
                            </button>
                        ))}
                    </div>
                )}

                {status === "ready" && (
                    <label className="border-primary mt-6 flex h-[57px] cursor-pointer items-center justify-between rounded-[15px] border bg-white px-5 text-[16px] font-bold">
                        마케팅 정보 수신 동의
                        <input
                            className="peer sr-only"
                            type="checkbox"
                            checked={marketingAgreed}
                            disabled={marketingSaving}
                            onChange={(event) =>
                                void handleMarketingChange(event.target.checked)
                            }
                        />
                        <span className="bg-disabled peer-checked:bg-primary peer-focus-visible:outline-primary relative h-5 w-[34px] rounded-full transition-colors peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 after:absolute after:top-[2px] after:left-[2px] after:size-4 after:rounded-full after:bg-white after:transition-transform peer-checked:after:translate-x-[14px]" />
                    </label>
                )}
            </MyPageLayout>

            <TermsDetailSheet
                termKey={selectedTerm}
                onClose={() => setSelectedTerm(null)}
            />
            <Toast
                message={toastMessage}
                onDismiss={() => setToastMessage(null)}
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
    const open = termKey !== null;
    const dialogRef = useDialogAccessibility<HTMLElement>(open, onClose);

    if (!termKey) return null;

    const detail = agreementDetails[termKey];
    const title =
        termKey === "service" ? "서비스 이용약관" : "개인정보 처리방침";

    return (
        <div
            className="fixed inset-0 z-50 flex items-end justify-center bg-black/30"
            role="presentation"
            onClick={(event) => {
                if (event.target === event.currentTarget) onClose();
            }}
        >
            <section
                ref={dialogRef}
                tabIndex={-1}
                className="max-h-[86svh] w-full max-w-[390px] overflow-y-auto rounded-t-[28px] bg-white px-6 pt-4 pb-10"
                role="dialog"
                aria-modal="true"
                aria-labelledby="terms-detail-title"
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
                        data-dialog-initial-focus
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
