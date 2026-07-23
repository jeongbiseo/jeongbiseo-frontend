import { addFavoriteApi, removeFavoriteApi } from "@/api/favoriteApi";
import { getSubsidyDetailApi } from "@/api/subsidyApi";
import Toast from "@/components/common/Toast";
import { ConfirmDialog } from "@/components/mypage/MyPageUI";
import {
    PolicyDetailContent,
    type PolicyDetailSectionId,
} from "@/components/policy/PolicyDetailContent";
import { PolicyDetailState } from "@/components/policy/PolicyDetailState";
import type { SubsidyDetailResult } from "@/types/subsidy";
import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

type ErrorKind = "not-found" | "unknown";

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
    const [openSections, setOpenSections] = useState<
        Set<PolicyDetailSectionId>
    >(() => new Set());
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

    const toggleSection = (sectionId: PolicyDetailSectionId) => {
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
            <PolicyDetailState
                title="지원금 정보를 찾을 수 없어요"
                description="삭제되었거나 존재하지 않는 지원금입니다."
                actionLabel="이전 화면으로 돌아가기"
                onAction={() => navigate(-1)}
            />
        );
    }

    if (loading) {
        return (
            <PolicyDetailState
                title="지원금 정보를 불러오고 있어요"
                description="잠시만 기다려주세요."
            />
        );
    }

    if (errorKind || !subsidy) {
        const notFound = errorKind === "not-found";
        return (
            <PolicyDetailState
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

    return (
        <>
            <PolicyDetailContent
                subsidy={subsidy}
                openSections={openSections}
                favoriteUpdating={favoriteUpdating}
                onToggleSection={toggleSection}
                onToggleFavorite={() => void toggleFavorite()}
                onOpenApplication={() => setExternalDialogOpen(true)}
            />
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

export default PolicyDetail;
