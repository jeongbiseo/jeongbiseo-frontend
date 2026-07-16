import googleSymbol from "@/assets/login/google-symbol.png";
import kakaoSymbol from "@/assets/login/kakao-symbol.svg";
import supportIllustration from "@/assets/login/support-illustration.svg";

// 로그인 페이지 ('/login')
const Login = () => {
    return (
        <main className="flex min-h-svh justify-center bg-[#ededed]">
            <section className="flex min-h-svh w-full max-w-[390px] flex-col items-center bg-[#f9f9f9] px-6 pt-[clamp(48px,11svh,104px)] pb-8">
                <header className="text-center">
                    <h1 className="text-[48px] leading-none font-bold tracking-[-2.4px] text-black">
                        정<span className="text-[#10b981]">비서</span>
                    </h1>
                    <p className="mt-[22px] text-[16px] leading-[1.35] font-medium tracking-[0.05em] text-[#808080]">
                        나에게 꼭 맞는 정부지원금,
                        <br />
                        정비서가 먼저 챙겨드릴게요
                    </p>
                </header>

                <img
                    className="mt-[clamp(36px,6.4svh,60px)] aspect-square w-[clamp(220px,66.67vw,260px)]"
                    src={supportIllustration}
                    alt="정부지원금을 챙겨주는 정비서"
                />

                <div className="mt-[clamp(36px,6.4svh,60px)] flex w-full flex-col gap-[21px]">
                    <button
                        className="flex h-[70px] w-full cursor-pointer items-center justify-center gap-[10px] rounded-[15px] bg-[#fee500] text-[20px] font-bold text-[#191919] transition-transform hover:brightness-[0.98] focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-[#191919] active:scale-[0.99]"
                        type="button"
                    >
                        <img
                            className="h-[25px] w-[27px]"
                            src={kakaoSymbol}
                            alt=""
                        />
                        <span>카카오로 계속하기</span>
                    </button>

                    <button
                        className="flex h-[70px] w-full cursor-pointer items-center justify-center gap-[10px] rounded-[15px] bg-[#f2f2f2] text-[20px] font-bold text-black transition-transform hover:brightness-[0.98] focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-[#4285f4] active:scale-[0.99]"
                        type="button"
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
        </main>
    );
};

export default Login;
