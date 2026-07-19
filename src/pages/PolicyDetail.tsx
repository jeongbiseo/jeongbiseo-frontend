import Button from "@/components/common/Button";
import ChevronDownIcon from "@/components/common/ChevronDownIcon";
import { ConfirmDialog, StarIcon } from "@/components/mypage/MyPageUI";
import {
    policyDetailData,
    type PolicyDetailSection,
} from "@/constants/policyDetailData";
import {
    getFavoritePolicyIds,
    saveFavoritePolicyIds,
} from "@/constants/mypageData";
import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

type SectionId = PolicyDetailSection["id"];

const PolicyDetail = () => {
    const navigate = useNavigate();
    const { policyId } = useParams();
    const numericPolicyId = Number(policyId);
    const policy = policyDetailData[numericPolicyId];
    const [openSections, setOpenSections] = useState<Set<SectionId>>(
        () => new Set()
    );
    const [favorite, setFavorite] = useState(() =>
        getFavoritePolicyIds().includes(numericPolicyId)
    );
    const [externalDialogOpen, setExternalDialogOpen] = useState(false);

    if (!policy) {
        return (
            <main className="bg-surface-dim flex min-h-svh justify-center">
                <section className="bg-ground flex min-h-svh w-full max-w-[390px] flex-col items-center justify-center px-10 pb-[57px] text-center">
                    <h1 className="text-[20px] font-bold">
                        지원금 정보를 찾을 수 없어요
                    </h1>
                    <p className="text-text-muted mt-2 text-[13px] font-semibold">
                        삭제되었거나 존재하지 않는 지원금입니다
                    </p>
                    <Button
                        className="mt-7 max-w-[312px]"
                        onClick={() => navigate(-1)}
                    >
                        이전 화면으로 돌아가기
                    </Button>
                </section>
            </main>
        );
    }

    const toggleSection = (sectionId: SectionId) => {
        setOpenSections((previous) => {
            const next = new Set(previous);
            if (next.has(sectionId)) next.delete(sectionId);
            else next.add(sectionId);
            return next;
        });
    };

    const toggleFavorite = () => {
        const favoriteIds = getFavoritePolicyIds();
        const nextFavorite = !favorite;
        const nextIds = nextFavorite
            ? [...new Set([...favoriteIds, policy.id])]
            : favoriteIds.filter((id) => id !== policy.id);

        saveFavoritePolicyIds(nextIds);
        setFavorite(nextFavorite);
    };

    const moveToApplicationPage = () => {
        window.open(policy.applicationUrl, "_blank", "noopener,noreferrer");
        setExternalDialogOpen(false);
    };

    return (
        <>
            <main className="bg-surface-dim flex min-h-svh justify-center">
                <section className="bg-ground text-text-strong min-h-svh w-full max-w-[390px] px-[39px] pt-20 pb-[104px]">
                    <article className="border-primary bg-green-light relative h-[124px] rounded-[10px] border-[0.5px] px-[21px] pt-[18px]">
                        <div className="pr-8">
                            <h1 className="text-green-darker truncate text-[24px] leading-normal font-bold">
                                {policy.title}
                            </h1>
                            <p className="text-text-subtle mt-0.5 text-[13px] leading-normal font-bold">
                                {policy.organization} / {policy.category}
                            </p>
                        </div>

                        <button
                            className="focus-visible:outline-primary absolute top-[14px] right-[13px] flex size-10 cursor-pointer items-center justify-center rounded focus-visible:outline-2"
                            type="button"
                            aria-label={
                                favorite ? "즐겨찾기 해제" : "즐겨찾기 추가"
                            }
                            aria-pressed={favorite}
                            onClick={toggleFavorite}
                        >
                            <StarIcon filled={favorite} />
                        </button>

                        <div className="mt-[15px] flex gap-[11px]">
                            {[policy.deadlineLabel, ...policy.tags].map(
                                (tag) => (
                                    <span
                                        className="bg-third rounded-full px-[10px] py-[6px] text-[13px] leading-none font-bold text-white"
                                        key={tag}
                                    >
                                        {tag}
                                    </span>
                                )
                            )}
                        </div>
                    </article>

                    <div className="mt-5 flex flex-col gap-5">
                        {policy.sections.map((section) => (
                            <PolicyAccordion
                                key={section.id}
                                section={section}
                                expanded={openSections.has(section.id)}
                                onToggle={() => toggleSection(section.id)}
                            />
                        ))}
                    </div>

                    <Button
                        className={`${openSections.size > 0 ? "mt-5" : "mt-10"} whitespace-nowrap`}
                        onClick={() => setExternalDialogOpen(true)}
                    >
                        신청하러 가기 (외부 페이지로 이동)
                    </Button>
                </section>
            </main>

            <ConfirmDialog
                open={externalDialogOpen}
                title="외부 페이지로 이동"
                description={`${policy.applicationProvider} 신청 페이지로 이동합니다. 이동하시겠습니까?`}
                confirmLabel="이동"
                variant="external"
                onCancel={() => setExternalDialogOpen(false)}
                onConfirm={moveToApplicationPage}
            />
        </>
    );
};

const PolicyAccordion = ({
    section,
    expanded,
    onToggle,
}: {
    section: PolicyDetailSection;
    expanded: boolean;
    onToggle: () => void;
}) => (
    <article className="border-primary overflow-hidden rounded-[10px] border-[0.5px] bg-white">
        <button
            className="flex h-[61px] w-full cursor-pointer items-center justify-between px-[21px] text-left"
            type="button"
            aria-expanded={expanded}
            onClick={onToggle}
        >
            <span className="text-[20px] leading-normal font-bold">
                {section.title}
            </span>
            <ChevronDownIcon expanded={expanded} className="h-3 w-[19px]" />
        </button>

        {expanded && (
            <div className="px-[21px] pb-[19px]">
                <dl className="text-text-muted flex flex-col gap-2 text-[13px] leading-normal font-bold">
                    {section.rows.map(({ label, value }) => (
                        <div
                            className="flex items-center justify-between gap-4"
                            key={label}
                        >
                            <dt className="shrink-0">{label}</dt>
                            <dd className="text-right">{value}</dd>
                        </div>
                    ))}
                </dl>
                {section.note && (
                    <p className="text-text-muted mt-2 text-[10px] leading-normal font-bold">
                        {section.note}
                    </p>
                )}
            </div>
        )}
    </article>
);

export default PolicyDetail;
