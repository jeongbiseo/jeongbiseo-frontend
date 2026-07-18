import {
    ChevronRightIcon,
    ConfirmDialog,
    MyPageLayout,
} from "@/components/mypage/MyPageUI";
import {
    initialRecommendationPolicies,
    isUrgentRecommendationPolicy,
} from "@/constants/recommendationData";
import {
    getFavoritePolicyIds,
    getMyPageProfile,
    getReceivedBenefits,
} from "@/constants/mypageData";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

type MenuItem = {
    label: string;
    path?: string;
    action?: "logout";
    danger?: boolean;
};

const MyPage = () => {
    const navigate = useNavigate();
    const [logoutDialogOpen, setLogoutDialogOpen] = useState(false);
    const favoriteCount = getFavoritePolicyIds().length;
    const receivedCount = getReceivedBenefits().length;
    const profile = getMyPageProfile();
    const availableCount = initialRecommendationPolicies.filter(
        ({ isRecommended }) => isRecommended
    ).length;
    const urgentCount = initialRecommendationPolicies.filter(
        isUrgentRecommendationPolicy
    ).length;
    const employmentLabel =
        profile.employment === "재직중" ? "재직" : profile.employment;

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
            label: "관심 등록한 지원금",
            path: "/recommend?tab=favorites",
            returnToMyPage: true,
        },
        {
            value: `${urgentCount}건`,
            label: "마감 임박 (D-7 이내)",
            path: "/recommend?tab=all&sort=deadline&filter=urgent",
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
            { label: "내 정보 수정", path: "/mypage/edit" },
            { label: "즐겨찾기 관리", path: "/mypage/favorites" },
        ],
        [
            {
                label: "이용약관 · 개인정보처리방침",
                path: "/mypage/terms",
            },
        ],
        [
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

    const handleLogout = () => {
        setLogoutDialogOpen(false);
        navigate("/login", { replace: true });
    };

    return (
        <>
            <MyPageLayout className="px-[25px]">
                <h1 className="text-[24px] font-bold">마이페이지</h1>

                <button
                    className="mt-7 flex h-[90px] w-full cursor-pointer items-center rounded-[20px] border border-[#2fbf9f] bg-white px-[25px] text-left"
                    type="button"
                    onClick={() => navigate("/mypage/edit")}
                >
                    <span className="size-[46px] shrink-0 rounded-full bg-[#f5a623]" />
                    <span className="ml-[18px] min-w-0 flex-1">
                        <strong className="block text-[16px]">
                            아기삼자 님
                        </strong>
                        <span className="mt-1.5 block truncate text-[13px] font-bold text-[#8e98a8]">
                            카카오 계정 · {profile.city.replace("특별시", "")}{" "}
                            {profile.district} · {employmentLabel}
                        </span>
                    </span>
                    <span className="ml-3 text-[#808080]">
                        <ChevronRightIcon />
                    </span>
                </button>

                <div className="mt-6 grid grid-cols-2 gap-x-[14px] gap-y-[13px]">
                    {summaryItems.map((item) => (
                        <button
                            className="h-[90px] cursor-pointer rounded-[20px] border border-[#2fbf9f] bg-white px-[15px] text-left transition active:scale-[0.99]"
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
                                className={`block text-[28px] leading-none ${item.emphasized ? "text-[#0d9467]" : "text-black"}`}
                            >
                                {item.value}
                            </strong>
                            <span className="mt-2 block text-[13px] font-bold text-[#808080]">
                                {item.label}
                            </span>
                        </button>
                    ))}
                </div>

                <div className="mt-6 flex flex-col gap-6">
                    {menuGroups.map((group, groupIndex) => (
                        <div
                            className="overflow-hidden rounded-[20px] border border-[#2fbf9f] bg-white"
                            key={groupIndex}
                        >
                            {group.map((item, index) => (
                                <button
                                    className={`flex h-[60px] w-full cursor-pointer items-center justify-between px-[29px] text-left text-[20px] font-semibold ${index > 0 ? "border-t border-[#e5e5e5]" : ""} ${item.danger ? "text-[#f03939]" : "text-black"}`}
                                    type="button"
                                    key={item.label}
                                    onClick={() => handleMenuClick(item)}
                                >
                                    {item.label}
                                    <span className="text-[#808080]">
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
