import { logoutApi } from "@/api/authApi";
import { getEstimatedTotalApi } from "@/api/estimatedApi";
import { getFavoritesApi } from "@/api/favoriteApi";
import {
    getMyOnboardingApi,
    getReceivedSubsidiesApi,
} from "@/api/onboardingApi";
import { getRecommendationsApi } from "@/api/recommendationApi";
import Header from "@/components/common/Header";
import {
    ChevronRightIcon,
    ConfirmDialog,
    MyPageLayout,
} from "@/components/mypage/MyPageUI";
import { employmentLabelOf } from "@/constants/onboardingOptions";
import { useAuthStore } from "@/stores/authStore";
import type { OnboardingProfile } from "@/types/onboarding";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

type MenuItem = {
    label: string;
    path?: string;
    action?: "logout";
    danger?: boolean;
};

const MyPage = () => {
    const navigate = useNavigate();
    const logout = useAuthStore((state) => state.logout);
    const user = useAuthStore((state) => state.user);
    const [logoutDialogOpen, setLogoutDialogOpen] = useState(false);
    const [profile, setProfile] = useState<OnboardingProfile | null>(null);
    const [receivedCount, setReceivedCount] = useState(0);
    const [availableCount, setAvailableCount] = useState(0);
    const [favoriteCount, setFavoriteCount] = useState(0);
    const [urgentCount, setUrgentCount] = useState(0);
    const employment = profile
        ? employmentLabelOf(profile.employmentStatus)
        : "";
    const employmentLabel = employment === "재직중" ? "재직" : employment;

    useEffect(() => {
        let active = true;

        const loadProfile = async () => {
            try {
                const response = await getMyOnboardingApi();

                if (!response.isSuccess) {
                    throw new Error(response.message);
                }

                if (active) setProfile(response.result);
            } catch (error) {
                console.error(error);
            }
        };

        void loadProfile();

        return () => {
            active = false;
        };
    }, []);

    useEffect(() => {
        let active = true;

        const loadSummaryCounts = async () => {
            const [estimated, favorites, recommendations] = await Promise.all([
                getEstimatedTotalApi().catch((error) => {
                    console.error(error);
                    return null;
                }),
                getFavoritesApi().catch((error) => {
                    console.error(error);
                    return null;
                }),
                getRecommendationsApi(20).catch((error) => {
                    console.error(error);
                    return null;
                }),
            ]);

            if (!active) return;

            if (estimated?.isSuccess) {
                setAvailableCount(estimated.result.totalCount);
            }

            if (favorites?.isSuccess) {
                setFavoriteCount(favorites.result.totalCount);
            }

            if (recommendations?.isSuccess) {
                setUrgentCount(
                    recommendations.result.items.filter(
                        ({ dDay }) => dDay !== null && dDay >= 0 && dDay <= 7
                    ).length
                );
            }
        };

        void loadSummaryCounts();

        return () => {
            active = false;
        };
    }, []);

    useEffect(() => {
        let active = true;

        const loadReceivedCount = async () => {
            try {
                const response = await getReceivedSubsidiesApi();

                if (!response.isSuccess) {
                    throw new Error(response.message);
                }

                if (active) setReceivedCount(response.result.totalCount);
            } catch (error) {
                console.error(error);
            }
        };

        void loadReceivedCount();

        return () => {
            active = false;
        };
    }, []);

    const summaryItems = [
        {
            value: `${availableCount}건`,
            label: "지금 신청 가능",
            emphasized: true,
            path: "/recommend?tab=recommended",
            returnToMyPage: true,
        },
        {
            value: `${favoriteCount}건`,
            label: "즐겨찾기 지원금",
            path: "/recommend?tab=favorites",
            returnToMyPage: true,
        },
        {
            value: `${urgentCount}건`,
            label: "마감 임박 (D-7 이내)",
            path: "/recommend?tab=recommended&sort=deadline&filter=urgent",
            returnToMyPage: true,
        },
        {
            value: `${receivedCount}건`,
            label: "기존 수령 지원금",
            path: "/mypage/edit?section=received",
        },
    ];

    const menuGroups: MenuItem[][] = [
        [
            {
                label: "이용약관 · 개인정보처리방침",
                path: "/mypage/terms",
            },
            { label: "로그아웃", action: "logout" },
            {
                label: "회원 탈퇴",
                path: "/mypage/withdraw",
                danger: true,
            },
        ],
    ];

    const handleMenuClick = (item: MenuItem) => {
        if (item.path) navigate(item.path);
        if (item.action === "logout") setLogoutDialogOpen(true);
    };

    const handleLogout = async () => {
        setLogoutDialogOpen(false);
        // 서버 로그아웃(RT 쿠키 만료)이 실패해도 클라이언트 상태는 초기화합니다.
        try {
            await logoutApi();
        } catch {
            /* 무시 */
        }
        logout();
        navigate("/login", { replace: true });
    };

    return (
        <>
            <MyPageLayout className="px-[25px]">
                <Header title="마이페이지" />

                <button
                    className="border-primary mt-7 flex h-[90px] w-full cursor-pointer items-center rounded-[20px] border bg-white px-[25px] text-left"
                    type="button"
                    onClick={() => navigate("/mypage/edit")}
                >
                    <span className="bg-secondary size-[46px] shrink-0 rounded-full" />
                    <span className="ml-[18px] min-w-0 flex-1">
                        <strong className="block text-[16px]">
                            {user?.name ?? "사용자"} 님
                        </strong>
                        <span className="text-text-subtle mt-1.5 block truncate text-[13px] font-bold">
                            {profile
                                ? `카카오 계정 · ${profile.sido.replace("특별시", "")} ${profile.sigungu} · ${employmentLabel}`
                                : "프로필 정보를 불러오는 중이에요"}
                        </span>
                    </span>
                    <span className="text-text-muted ml-3">
                        <ChevronRightIcon />
                    </span>
                </button>

                <div className="mt-6 grid grid-cols-2 gap-x-[14px] gap-y-[13px]">
                    {summaryItems.map((item) => (
                        <button
                            className="border-primary h-[90px] cursor-pointer rounded-[20px] border bg-white px-[15px] text-left transition active:scale-[0.99]"
                            type="button"
                            key={item.label}
                            onClick={() =>
                                navigate(
                                    item.path,
                                    item.returnToMyPage
                                        ? { state: { from: "mypage" } }
                                        : undefined
                                )
                            }
                        >
                            <strong
                                className={`block text-[28px] leading-none ${item.emphasized ? "text-success" : "text-black"}`}
                            >
                                {item.value}
                            </strong>
                            <span className="text-text-muted mt-2 block text-[13px] font-bold">
                                {item.label}
                            </span>
                        </button>
                    ))}
                </div>

                <div className="mt-6 flex flex-col gap-6">
                    {menuGroups.map((group, groupIndex) => (
                        <div
                            className="border-primary overflow-hidden rounded-[20px] border bg-white"
                            key={groupIndex}
                        >
                            {group.map((item, index) => (
                                <button
                                    className={`flex h-[60px] w-full cursor-pointer items-center justify-between px-[29px] text-left text-[20px] font-semibold ${index > 0 ? "border-line border-t" : ""} ${item.danger ? "text-danger" : "text-black"}`}
                                    type="button"
                                    key={item.label}
                                    onClick={() => handleMenuClick(item)}
                                >
                                    {item.label}
                                    <span className="text-text-muted">
                                        <ChevronRightIcon />
                                    </span>
                                </button>
                            ))}
                        </div>
                    ))}
                </div>
            </MyPageLayout>

            <ConfirmDialog
                open={logoutDialogOpen}
                title="로그아웃"
                description="정말 로그아웃 하시겠습니까?"
                confirmLabel="로그아웃"
                onCancel={() => setLogoutDialogOpen(false)}
                onConfirm={handleLogout}
            />
        </>
    );
};

export default MyPage;
