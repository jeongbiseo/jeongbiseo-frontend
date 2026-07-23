import {
    BackButton,
    CheckIcon,
    ConfirmDialog,
    MyPageLayout,
} from "@/components/mypage/MyPageUI";
import Toast from "@/components/common/Toast";
import { withdrawMemberApi } from "@/api/memberApi";
import { useAuthStore } from "@/stores/authStore";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

const withdrawalReasons = [
    "자주 사용하지 않아요",
    "앱 사용법이 너무 어려워요",
    "원하는 지원금이 없어요",
];

const Withdrawal = () => {
    const navigate = useNavigate();
    const logout = useAuthStore((state) => state.logout);
    const [selectedReasons, setSelectedReasons] = useState<string[]>([]);
    const [noticeAgreed, setNoticeAgreed] = useState(false);
    const [confirmOpen, setConfirmOpen] = useState(false);
    const [withdrawing, setWithdrawing] = useState(false);
    const [toastMessage, setToastMessage] = useState<string | null>(null);

    const handleWithdrawal = async () => {
        if (withdrawing) return;

        setWithdrawing(true);

        try {
            const response = await withdrawMemberApi(
                selectedReasons.join(", ") || undefined
            );

            if (!response.isSuccess) {
                throw new Error(response.message);
            }

            logout();
            setConfirmOpen(false);
            navigate("/login", { replace: true });
        } catch (error) {
            console.error(error);
            setToastMessage("회원 탈퇴에 실패했습니다. 다시 시도해주세요.");
        } finally {
            setWithdrawing(false);
        }
    };

    const toggleReason = (reason: string) => {
        setSelectedReasons((currentReasons) =>
            currentReasons.includes(reason)
                ? currentReasons.filter(
                      (selectedReason) => selectedReason !== reason
                  )
                : [...currentReasons, reason]
        );
    };

    return (
        <>
            <MyPageLayout className="px-[39px] pt-[39px]">
                <BackButton className="-ml-5" />
                <h1 className="mt-0 -ml-[7px] text-[24px] font-bold">
                    회원 탈퇴
                </h1>

                <h2 className="mt-8 text-[16px] font-bold">
                    탈퇴하기 전에 꼭 확인해 주세요
                </h2>
                <ul className="border-green-normal text-text-muted mt-4 flex min-h-[147px] list-disc flex-col justify-center space-y-3 rounded-[20px] border-[0.5px] bg-white px-10 py-4 text-[13px] leading-[1.45] font-semibold">
                    <li>
                        탈퇴 시 기존에 보관했던 즐겨찾기 내역이 모두 삭제되며,
                        복구할 수 없습니다
                    </li>
                    <li>회원탈퇴 후 30일간 재가입이 불가능합니다</li>
                    <li>
                        연동된 SNS 계정이 있는 경우 정비서와 연동이 해제됩니다.
                    </li>
                </ul>

                <h2 className="mt-8 text-[16px] font-bold">
                    탈퇴하시는 이유가 궁금해요(선택)
                </h2>
                <div className="border-green-normal mt-3 flex h-[94px] flex-col justify-center rounded-[20px] border-[0.5px] bg-white px-[30px] py-2">
                    {withdrawalReasons.map((reason) => (
                        <label
                            className={`flex cursor-pointer items-center gap-3 py-1 text-[13px] font-bold ${selectedReasons.includes(reason) ? "text-black" : "text-text-muted"}`}
                            key={reason}
                        >
                            <input
                                className="peer sr-only"
                                type="checkbox"
                                name="withdrawal-reason"
                                checked={selectedReasons.includes(reason)}
                                onChange={() => toggleReason(reason)}
                            />
                            <span
                                className={`peer-focus-visible:outline-primary flex size-5 items-center justify-center rounded-sm peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 ${selectedReasons.includes(reason) ? "text-primary" : "text-disabled"}`}
                            >
                                <CheckIcon className="size-5" />
                            </span>
                            {reason}
                        </label>
                    ))}
                </div>

                <label className="border-green-normal mt-7 flex min-h-[68px] cursor-pointer items-center gap-4 rounded-[15px] border-[0.5px] bg-white px-5 py-4 text-[13px] leading-[1.45] font-bold">
                    <input
                        className="peer sr-only"
                        type="checkbox"
                        checked={noticeAgreed}
                        onChange={(event) =>
                            setNoticeAgreed(event.target.checked)
                        }
                    />
                    <span className="bg-disabled peer-checked:bg-primary peer-focus-visible:outline-primary flex size-[22px] shrink-0 items-center justify-center rounded-[5px] text-white peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2">
                        {noticeAgreed && <CheckIcon className="size-4" />}
                    </span>
                    [필수] 안내사항을 모두 확인했으며,
                    <br />
                    이에 동의합니다
                </label>

                <button
                    className="bg-danger disabled:bg-danger-disabled mt-36 h-[40px] w-full cursor-pointer rounded-[10px] text-[16px] font-bold text-white disabled:cursor-not-allowed"
                    type="button"
                    disabled={!noticeAgreed || withdrawing}
                    onClick={() => setConfirmOpen(true)}
                >
                    {withdrawing ? "탈퇴 처리 중..." : "서비스 탈퇴하기"}
                </button>
            </MyPageLayout>

            <ConfirmDialog
                open={confirmOpen}
                title="회원 탈퇴"
                description="정말 정비서 서비스를 탈퇴하시겠습니까?"
                confirmLabel="탈퇴하기"
                onCancel={() => setConfirmOpen(false)}
                onConfirm={handleWithdrawal}
            />
            <Toast
                message={toastMessage}
                onDismiss={() => setToastMessage(null)}
            />
        </>
    );
};

export default Withdrawal;
