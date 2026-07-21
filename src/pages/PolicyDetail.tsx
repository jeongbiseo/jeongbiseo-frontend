import { addFavoriteApi, removeFavoriteApi } from "@/api/favoriteApi";
import { getSubsidyDetailApi } from "@/api/subsidyApi";
import Button from "@/components/common/Button";
import ChevronDownIcon from "@/components/common/ChevronDownIcon";
import Toast from "@/components/common/Toast";
import { ConfirmDialog, StarIcon } from "@/components/mypage/MyPageUI";
import { subsidyCategoryLabelOf } from "@/constants/onboardingOptions";
import { paymentTypeLabels } from "@/constants/paymentType";
import type { SubsidyDetailResult } from "@/types/subsidy";
import { formatDetailedAmountRange, formatWon } from "@/utils/format";
import axios from "axios";
import { useEffect, useState, type ReactNode } from "react";
import { useNavigate, useParams } from "react-router-dom";

type SectionId = "eligibility" | "application" | "amount";
type ErrorKind = "not-found" | "unknown";

const getDeadlineLabel = ({ deadline, dDay }: SubsidyDetailResult) => {
    if (deadline === null) return "마감 없음";
    if (dDay === null) return deadline;
    if (dDay === 0) return "D-Day";
    if (dDay > 0) return `마감 D-${dDay}`;
    return "마감";
};

const PolicyDetail = () => {
    const navigate = useNavigate();
    const { policyId } = useParams();
    const numericPolicyId = Number(policyId);
    const invalidPolicyId =
        !Number.isInteger(numericPolicyId) || numericPolicyId <= 0;
    const [subsidy, setSubsidy] = useState<SubsidyDetailResult | null>(null);
    const [loading, setLoading] = useState(true);
    const [errorKind, setErrorKind] = useState<ErrorKind | null>(null);
    const [reloadKey, setReloadKey] = useState(0);
    const [openSections, setOpenSections] = useState<Set<SectionId>>(
        () => new Set()
    );
    const [favoriteUpdating, setFavoriteUpdating] = useState(false);
    const [externalDialogOpen, setExternalDialogOpen] = useState(false);
    const [toastMessage, setToastMessage] = useState<string | null>(null);

    useEffect(() => {
        if (invalidPolicyId) return;

        let active = true;

        const loadSubsidy = async () => {
            setLoading(true);
            setErrorKind(null);

            try {
                const response = await getSubsidyDetailApi(numericPolicyId);

                if (!response.isSuccess) {
                    throw new Error(response.message);
                }

                if (active) setSubsidy(response.result);
            } catch (error) {
                if (!active) return;

                setSubsidy(null);
                setErrorKind(
                    axios.isAxiosError(error) && error.response?.status === 404
                        ? "not-found"
                        : "unknown"
                );
            } finally {
                if (active) setLoading(false);
            }
        };

        void loadSubsidy();

        return () => {
            active = false;
        };
    }, [invalidPolicyId, numericPolicyId, reloadKey]);

    const toggleSection = (sectionId: SectionId) => {
        setOpenSections((previous) => {
            const next = new Set(previous);
            if (next.has(sectionId)) next.delete(sectionId);
            else next.add(sectionId);
            return next;
        });
    };

    const toggleFavorite = async () => {
        if (!subsidy || favoriteUpdating) return;

        const nextFavorite = !subsidy.isFavorite;
        setFavoriteUpdating(true);

        try {
            const response = nextFavorite
                ? await addFavoriteApi(subsidy.subsidyId)
                : await removeFavoriteApi(subsidy.subsidyId);

            if (!response.isSuccess) {
                throw new Error(response.message);
            }

            setSubsidy((previous) =>
                previous
                    ? { ...previous, isFavorite: response.result.favorited }
                    : previous
            );
        } catch (error) {
            console.error(error);
            setToastMessage("즐겨찾기를 변경하지 못했습니다.");
        } finally {
            setFavoriteUpdating(false);
        }
    };

    const moveToApplicationPage = () => {
        if (!subsidy?.externalUrl) return;

        window.open(subsidy.externalUrl, "_blank", "noopener,noreferrer");
        setExternalDialogOpen(false);
    };

    if (invalidPolicyId) {
        return (
            <PageMessage
                title="지원금 정보를 찾을 수 없어요"
                description="삭제되었거나 존재하지 않는 지원금입니다."
                actionLabel="이전 화면으로 돌아가기"
                onAction={() => navigate(-1)}
            />
        );
    }

    if (loading) {
        return (
            <PageMessage
                title="지원금 정보를 불러오고 있어요"
                description="잠시만 기다려주세요."
            />
        );
    }

    if (errorKind || !subsidy) {
        const notFound = errorKind === "not-found";
        return (
            <PageMessage
                title={
                    notFound
                        ? "지원금 정보를 찾을 수 없어요"
                        : "지원금 정보를 불러오지 못했어요"
                }
                description={
                    notFound
                        ? "삭제되었거나 존재하지 않는 지원금입니다."
                        : "네트워크 상태를 확인한 뒤 다시 시도해주세요."
                }
                actionLabel={notFound ? "이전 화면으로 돌아가기" : "다시 시도"}
                onAction={() =>
                    notFound
                        ? navigate(-1)
                        : setReloadKey((previous) => previous + 1)
                }
            />
        );
    }

    const deadlineLabel = getDeadlineLabel(subsidy);
    const categoryLabel = subsidy.category
        ? subsidyCategoryLabelOf(subsidy.category)
        : null;
    const paymentTypeLabel = paymentTypeLabels[subsidy.paymentType];

    return (
        <>
            <main className="bg-surface-dim flex min-h-svh justify-center">
                <section className="bg-ground text-text-strong min-h-svh w-full max-w-[390px] px-[39px] pt-20 pb-[104px]">
                    <article className="border-primary bg-green-light relative min-h-[124px] rounded-[10px] border-[0.5px] px-[21px] pt-[18px] pb-[15px]">
                        <div className="pr-8">
                            <h1 className="text-green-darker truncate text-[24px] leading-normal font-bold">
                                {subsidy.name}
                            </h1>
                            <p className="text-text-subtle mt-0.5 text-[13px] leading-normal font-bold">
                                {subsidy.agency ?? "담당기관 정보 없음"}
                                {categoryLabel ? ` / ${categoryLabel}` : ""}
                            </p>
                        </div>

                        <button
                            className="focus-visible:outline-primary absolute top-[14px] right-[13px] flex size-10 cursor-pointer items-center justify-center rounded focus-visible:outline-2 disabled:cursor-wait disabled:opacity-60"
                            type="button"
                            disabled={favoriteUpdating}
                            aria-busy={favoriteUpdating}
                            aria-label={
                                subsidy.isFavorite
                                    ? "즐겨찾기 해제"
                                    : "즐겨찾기 추가"
                            }
                            aria-pressed={subsidy.isFavorite}
                            onClick={toggleFavorite}
                        >
                            <StarIcon filled={subsidy.isFavorite} />
                        </button>

                        <div className="mt-[15px] flex flex-wrap gap-[11px]">
                            {[deadlineLabel, categoryLabel, paymentTypeLabel]
                                .filter((tag): tag is string => Boolean(tag))
                                .map((tag) => (
                                    <span
                                        className="bg-third rounded-full px-[10px] py-[6px] text-[13px] leading-none font-bold text-white"
                                        key={tag}
                                    >
                                        {tag}
                                    </span>
                                ))}
                        </div>
                    </article>

                    <div className="mt-5 flex flex-col gap-5">
                        <PolicyAccordion
                            title="자격조건"
                            expanded={openSections.has("eligibility")}
                            onToggle={() => toggleSection("eligibility")}
                        >
                            <p className="text-text-muted text-[13px] leading-[1.6] font-medium whitespace-pre-line">
                                {subsidy.eligibilityText ??
                                    "자격조건 정보가 없습니다."}
                            </p>
                        </PolicyAccordion>

                        <PolicyAccordion
                            title="마감일 및 담당기관"
                            expanded={openSections.has("application")}
                            onToggle={() => toggleSection("application")}
                        >
                            <DetailRows
                                rows={[
                                    {
                                        label: "신청 마감",
                                        value:
                                            subsidy.deadline ??
                                            "마감일 정보 없음",
                                    },
                                    {
                                        label: "담당기관",
                                        value:
                                            subsidy.agency ??
                                            "담당기관 정보 없음",
                                    },
                                    {
                                        label: "신청 방법",
                                        value: subsidy.externalUrl
                                            ? "온라인 신청"
                                            : "기관 문의",
                                    },
                                ]}
                            />
                        </PolicyAccordion>

                        <PolicyAccordion
                            title="예상 수령액"
                            expanded={openSections.has("amount")}
                            onToggle={() => toggleSection("amount")}
                        >
                            <DetailRows
                                rows={[
                                    {
                                        label: "예상 지원금",
                                        value: formatDetailedAmountRange(
                                            subsidy.estimatedAmountMin,
                                            subsidy.estimatedAmountMax
                                        ),
                                    },
                                    {
                                        label: "지급 유형",
                                        value: paymentTypeLabel,
                                    },
                                ]}
                            />
                            <p className="text-text-muted mt-3 text-[11px] leading-[1.5] font-medium whitespace-pre-line">
                                {subsidy.description ??
                                    "지원 내용은 담당기관에서 확인해주세요."}
                            </p>
                            {subsidy.aiExplanation && (
                                <div className="bg-surface-soft mt-4 rounded-[10px] p-3">
                                    <h3 className="text-[12px] font-bold">
                                        AI 금액 산정 근거
                                    </h3>
                                    <DetailRows
                                        rows={[
                                            ...(subsidy.aiExplanation
                                                .amountValue !== null
                                                ? [
                                                      {
                                                          label: "1회 지급액",
                                                          value: formatWon(
                                                              subsidy
                                                                  .aiExplanation
                                                                  .amountValue
                                                          ),
                                                      },
                                                  ]
                                                : []),
                                            ...(subsidy.aiExplanation
                                                .monthlyAmount !== null
                                                ? [
                                                      {
                                                          label: "월 지급액",
                                                          value: formatWon(
                                                              subsidy
                                                                  .aiExplanation
                                                                  .monthlyAmount
                                                          ),
                                                      },
                                                  ]
                                                : []),
                                            ...(subsidy.aiExplanation
                                                .durationMonths !== null
                                                ? [
                                                      {
                                                          label: "지급 기간",
                                                          value: `${subsidy.aiExplanation.durationMonths}개월`,
                                                      },
                                                  ]
                                                : []),
                                            ...(subsidy.aiExplanation
                                                .conditionExpression
                                                ? [
                                                      {
                                                          label: "산정 조건",
                                                          value: subsidy
                                                              .aiExplanation
                                                              .conditionExpression,
                                                      },
                                                  ]
                                                : []),
                                        ]}
                                    />
                                    {subsidy.aiExplanation.evidence && (
                                        <p className="text-text-muted mt-3 text-[11px] leading-[1.5] font-medium whitespace-pre-line">
                                            근거:{" "}
                                            {subsidy.aiExplanation.evidence}
                                        </p>
                                    )}
                                </div>
                            )}
                        </PolicyAccordion>
                    </div>

                    <Button
                        className={`${openSections.size > 0 ? "mt-5" : "mt-10"} whitespace-nowrap`}
                        disabled={!subsidy.externalUrl}
                        onClick={() => setExternalDialogOpen(true)}
                    >
                        {subsidy.externalUrl
                            ? "신청하러 가기 (외부 페이지로 이동)"
                            : "신청 링크 정보 없음"}
                    </Button>
                </section>
            </main>

            <ConfirmDialog
                open={externalDialogOpen}
                title="외부 페이지로 이동"
                description={`${subsidy.agency ?? "담당기관"} 신청 페이지로 이동합니다. 이동하시겠습니까?`}
                confirmLabel="이동"
                variant="external"
                onCancel={() => setExternalDialogOpen(false)}
                onConfirm={moveToApplicationPage}
            />
            <Toast
                message={toastMessage}
                onDismiss={() => setToastMessage(null)}
            />
        </>
    );
};

const PageMessage = ({
    title,
    description,
    actionLabel,
    onAction,
}: {
    title: string;
    description: string;
    actionLabel?: string;
    onAction?: () => void;
}) => (
    <main className="bg-surface-dim flex min-h-svh justify-center">
        <section className="bg-ground flex min-h-svh w-full max-w-[390px] flex-col items-center justify-center px-10 pb-[57px] text-center">
            <h1 className="text-[20px] font-bold">{title}</h1>
            <p className="text-text-muted mt-2 text-[13px] font-semibold">
                {description}
            </p>
            {actionLabel && onAction && (
                <Button className="mt-7 max-w-[312px]" onClick={onAction}>
                    {actionLabel}
                </Button>
            )}
        </section>
    </main>
);

const PolicyAccordion = ({
    title,
    expanded,
    onToggle,
    children,
}: {
    title: string;
    expanded: boolean;
    onToggle: () => void;
    children: ReactNode;
}) => (
    <article className="border-primary overflow-hidden rounded-[10px] border-[0.5px] bg-white">
        <button
            className="flex h-[61px] w-full cursor-pointer items-center justify-between px-[21px] text-left"
            type="button"
            aria-expanded={expanded}
            onClick={onToggle}
        >
            <span className="text-[20px] leading-normal font-bold">
                {title}
            </span>
            <ChevronDownIcon expanded={expanded} className="h-3 w-[19px]" />
        </button>

        {expanded && <div className="px-[21px] pb-[19px]">{children}</div>}
    </article>
);

const DetailRows = ({
    rows,
}: {
    rows: Array<{ label: string; value: string }>;
}) => (
    <dl className="text-text-muted flex flex-col gap-2 text-[13px] leading-normal font-bold">
        {rows.map(({ label, value }) => (
            <div className="flex items-start justify-between gap-4" key={label}>
                <dt className="shrink-0">{label}</dt>
                <dd className="text-right">{value}</dd>
            </div>
        ))}
    </dl>
);

export default PolicyDetail;
