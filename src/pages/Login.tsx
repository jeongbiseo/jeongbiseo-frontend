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
            <section className="bg-ground flex min-h-svh w-full max-w-[390px] flex-col items-center px-6 pt-6 pb-8">
                <header className="text-center">
                    <h1 className="text-[48px] leading-none font-bold tracking-[-2.4px] text-black">
                        정<span className="text-primary">비서</span>
                    </h1>
                    <p className="text-text-muted mt-[22px] text-[16px] leading-[1.35] font-medium tracking-[0.05em]">
                        나에게 꼭 맞는 정부지원금,
                        <br />
                        정비서가 먼저 챙겨드릴게요
                    </p>
                </header>

                <img
                    className="mt-[55px] size-[215px]"
                    src={supportIllustration}
                    alt="정부지원금을 챙겨주는 정비서"
                />

                <div className="mt-[55px] flex w-full flex-col gap-[21px]">
                    <button
                        className="bg-kakao text-text-strong focus-visible:outline-text-strong flex h-[55px] w-full cursor-pointer items-center justify-center gap-[10px] rounded-[15px] text-[20px] font-bold transition-transform hover:brightness-[0.98] focus-visible:outline-3 focus-visible:outline-offset-2 active:scale-[0.99]"
                        type="button"
                        onClick={() => handleSocialLogin("kakao")}
                    >
                        <img
                            className="h-[25px] w-[27px]"
                            src={kakaoSymbol}
                            alt=""
                        />
                        <span>카카오로 계속하기</span>
                    </button>

                    <button
                        className="flex h-[55px] w-full cursor-pointer items-center justify-center gap-[10px] rounded-[15px] bg-[#f2f2f2] text-[20px] font-bold text-black transition-transform hover:brightness-[0.98] focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-[#4285f4] active:scale-[0.99]"
                        type="button"
                        onClick={() => handleSocialLogin("google")}
                    >
                        <img
                            className="h-[25px] w-[25px]"
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
