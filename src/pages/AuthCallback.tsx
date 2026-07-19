/*
 * 소셜 로그인 콜백 페이지 ('/auth/callback/:provider')입니다.
 * 카카오/구글이 되돌려보낸 code로 백엔드에 Access Token을 교환하고,
 * 사용자 정보를 조회한 뒤 온보딩 완료 여부에 따라 이동합니다.
 */

import { socialLoginApi } from "@/api/authApi";
import { getMyInfoApi } from "@/api/memberApi";
import Button from "@/components/common/Button";
import { useAuthStore } from "@/stores/authStore";
import type { SocialProvider } from "@/types/auth";
import { buildRedirectUri, consumePendingOAuth } from "@/utils/oauth";
import { useEffect, useRef, useState } from "react";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";

const isSocialProvider = (value?: string): value is SocialProvider =>
    value === "kakao" || value === "google";

const AuthCallback = () => {
    const { provider } = useParams();
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const [error, setError] = useState<string | null>(null);
    // StrictMode 이중 실행 및 code 재사용 방지
    const startedRef = useRef(false);

    useEffect(() => {
        if (startedRef.current) return;
        startedRef.current = true;

        const run = async () => {
            const code = searchParams.get("code");
            const state = searchParams.get("state");
            const canceled = searchParams.get("error");

            if (!isSocialProvider(provider)) {
                setError("지원하지 않는 로그인 방식이에요.");
                return;
            }
            if (canceled || !code) {
                setError("로그인이 취소되었어요.");
                return;
            }

            const pending = consumePendingOAuth(provider, state);
            if (!pending) {
                setError("로그인 정보가 유효하지 않아요. 다시 시도해주세요.");
                return;
            }

            try {
                const login = await socialLoginApi(provider, {
                    code,
                    codeVerifier: pending.codeVerifier,
                    redirectUri: buildRedirectUri(provider),
                });
                if (!login.isSuccess) throw new Error(login.message);

                useAuthStore
                    .getState()
                    .setAccessToken(login.result.accessToken);

                const me = await getMyInfoApi();
                if (!me.isSuccess) throw new Error(me.message);

                useAuthStore.getState().login(me.result);
                useAuthStore.getState().setAuthInitialized(true);

                // 온보딩 완료 → 홈 / 미완료 → 약관동의부터 시작
                navigate(login.result.onboardingCompleted ? "/" : "/terms", {
                    replace: true,
                });
            } catch {
                setError("로그인에 실패했어요. 다시 시도해주세요.");
            }
        };

        void run();
    }, [provider, searchParams, navigate]);

    return (
        <main className="bg-surface-dim flex min-h-svh justify-center">
            <section className="bg-ground flex min-h-svh w-full max-w-[390px] flex-col items-center justify-center px-6">
                {error ? (
                    <>
                        <p className="text-text-muted text-center text-[16px] font-medium">
                            {error}
                        </p>
                        <Button
                            className="mt-6 max-w-[280px]"
                            onClick={() =>
                                navigate("/login", { replace: true })
                            }
                        >
                            로그인으로 돌아가기
                        </Button>
                    </>
                ) : (
                    <p className="text-text-muted text-[16px] font-medium">
                        로그인 중이에요...
                    </p>
                )}
            </section>
        </main>
    );
};

export default AuthCallback;
