import Button from "@/components/common/Button";
import ChevronDownIcon from "@/components/common/ChevronDownIcon";
import { StarIcon } from "@/components/mypage/MyPageUI";
import { subsidyCategoryLabelOf } from "@/constants/onboardingOptions";
import { paymentTypeLabels } from "@/constants/paymentType";
import type { SubsidyDetailResult } from "@/types/subsidy";
import { formatDetailedAmountRange, formatWon } from "@/utils/format";
import type { ReactNode } from "react";

export type PolicyDetailSectionId = "eligibility" | "application" | "amount";

const getDeadlineLabel = ({ deadline, dDay }: SubsidyDetailResult) => {
    if (deadline === null) return "마감 없음";
    if (dDay === null) return deadline;
    if (dDay === 0) return "D-Day";
    if (dDay > 0) return `마감 D-${dDay}`;
    return "마감";
};

export const PolicyDetailContent = ({
    subsidy,
    openSections,
    favoriteUpdating,
    onToggleSection,
    onToggleFavorite,
    onOpenApplication,
}: {
    subsidy: SubsidyDetailResult;
    openSections: Set<PolicyDetailSectionId>;
    favoriteUpdating: boolean;
    onToggleSection: (section: PolicyDetailSectionId) => void;
    onToggleFavorite: () => void;
    onOpenApplication: () => void;
}) => {
    const deadlineLabel = getDeadlineLabel(subsidy);
    const categoryLabel = subsidy.category
        ? subsidyCategoryLabelOf(subsidy.category)
        : null;
    const paymentTypeLabel = paymentTypeLabels[subsidy.paymentType];

    return (
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
                        onClick={onToggleFavorite}
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
                        onToggle={() => onToggleSection("eligibility")}
                    >
                        <p className="text-text-muted text-[13px] leading-[1.6] font-medium whitespace-pre-line">
                            {subsidy.eligibilityText ??
                                "자격조건 정보가 없습니다."}
                        </p>
                    </PolicyAccordion>

                    <PolicyAccordion
                        title="마감일 및 담당기관"
                        expanded={openSections.has("application")}
                        onToggle={() => onToggleSection("application")}
                    >
                        <DetailRows
                            rows={[
                                {
                                    label: "신청 마감",
                                    value:
                                        subsidy.deadline ?? "마감일 정보 없음",
                                },
                                {
                                    label: "담당기관",
                                    value:
                                        subsidy.agency ?? "담당기관 정보 없음",
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
                        onToggle={() => onToggleSection("amount")}
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
                        <AiExplanation subsidy={subsidy} />
                    </PolicyAccordion>
                </div>

                <Button
                    className={`${openSections.size > 0 ? "mt-5" : "mt-10"} whitespace-nowrap`}
                    disabled={!subsidy.externalUrl}
                    onClick={onOpenApplication}
                >
                    {subsidy.externalUrl
                        ? "신청하러 가기 (외부 페이지로 이동)"
                        : "신청 링크 정보 없음"}
                </Button>
            </section>
        </main>
    );
};

const AiExplanation = ({ subsidy }: { subsidy: SubsidyDetailResult }) => {
    if (!subsidy.aiExplanation) {
        return (
            <div
                className="bg-surface-soft mt-4 rounded-[10px] p-3"
                role="status"
            >
                <h3 className="text-[12px] font-bold">AI 해석 준비 중</h3>
                <p className="text-text-muted mt-1.5 text-[11px] leading-[1.5] font-medium">
                    검증된 AI 해석이 준비되기 전까지 기존 금액 정보와 공고
                    원문을 제공해드려요.
                </p>
            </div>
        );
    }

    const explanation = subsidy.aiExplanation;
    return (
        <div className="bg-surface-soft mt-4 rounded-[10px] p-3">
            <h3 className="text-[12px] font-bold">AI 금액 해석 근거</h3>
            <DetailRows
                rows={[
                    ...(explanation.amountValue !== null
                        ? [
                              {
                                  label: "1회 지급액",
                                  value: formatWon(explanation.amountValue),
                              },
                          ]
                        : []),
                    ...(explanation.monthlyAmount !== null
                        ? [
                              {
                                  label: "월 지급액",
                                  value: formatWon(explanation.monthlyAmount),
                              },
                          ]
                        : []),
                    ...(explanation.durationMonths !== null
                        ? [
                              {
                                  label: "지급 기간",
                                  value: `${explanation.durationMonths}개월`,
                              },
                          ]
                        : []),
                    ...(explanation.conditionExpression
                        ? [
                              {
                                  label: "산정 조건",
                                  value: explanation.conditionExpression,
                              },
                          ]
                        : []),
                ]}
            />
            {explanation.evidence && (
                <p className="text-text-muted mt-3 text-[11px] leading-[1.5] font-medium whitespace-pre-line">
                    근거: {explanation.evidence}
                </p>
            )}
        </div>
    );
};

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
