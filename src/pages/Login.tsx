import googleSymbol from "@/assets/login/google-symbol.png";
import kakaoSymbol from "@/assets/login/kakao-symbol.svg";
import supportIllustration from "@/assets/login/support-illustration.svg";
import Toast from "@/components/common/Toast";
import type { SocialProvider } from "@/types/auth";
import { startSocialLogin } from "@/utils/oauth";
import { useState } from "react";

// 로그인 페이지 ('/login')
const Login = () => {
    const [toastMessage, setToastMessage] = useState<string | null>(null);

    const handleSocialLogin = (provider: SocialProvider) => {
        startSocialLogin(provider).catch((error) => {
            console.error(error);
            setToastMessage(
                "로그인을 시작하지 못했어요. 잠시 후 다시 시도해주세요."
            );
        });
    };

    return (
        <main className="bg-surface-dim flex min-h-svh justify-center">
            <section className="bg-ground px-page-inline flex min-h-svh w-full max-w-[390px] flex-col items-center justify-center py-6">
                <header className="text-center">
                    <h1 className="text-display-brand text-black">
                        정<span className="text-primary">비서</span>
                    </h1>
                    <p className="text-text-muted text-body-sm mt-4 tracking-[0.05em]">
                        나에게 꼭 맞는 정부지원금,
                        <br />
                        정비서가 먼저 챙겨드릴게요
                    </p>
                </header>

                <img
                    className="mt-8 size-[215px]"
                    src={supportIllustration}
                    alt="정부지원금을 챙겨주는 정비서"
                />

                <div className="gap-layout-related mt-8 flex w-full flex-col">
                    <button
                        className="bg-kakao text-text-strong focus-visible:outline-text-strong text-body-strong rounded-control gap-layout-inline flex h-[55px] w-full cursor-pointer items-center justify-center transition-transform hover:brightness-[0.98] focus-visible:outline-3 focus-visible:outline-offset-2 active:scale-[0.99]"
                        type="button"
                        onClick={() => handleSocialLogin("kakao")}
                    >
                        <img
                            className="size-icon-lg object-contain"
                            src={kakaoSymbol}
                            alt=""
                        />
                        <span>카카오로 계속하기</span>
                    </button>

                    <button
                        className="text-body-strong rounded-control gap-layout-inline flex h-[55px] w-full cursor-pointer items-center justify-center bg-[#f2f2f2] text-black transition-transform hover:brightness-[0.98] focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-[#4285f4] active:scale-[0.99]"
                        type="button"
                        onClick={() => handleSocialLogin("google")}
                    >
                        <img
                            className="size-icon-lg object-contain"
                            src={googleSymbol}
                            alt=""
                        />
                        <span>Google로 계속하기</span>
                    </button>
                </div>
            </section>
            <Toast
                message={toastMessage}
                onDismiss={() => setToastMessage(null)}
            />
        </main>
    );
};

export default Login;
