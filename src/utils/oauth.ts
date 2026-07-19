/*
 * 소셜 로그인(OAuth 2.0 Authorization Code + PKCE) 유틸입니다.
 *
 * 흐름:
 * 1) startSocialLogin(provider): codeVerifier/state를 만들어 sessionStorage에 저장하고
 *    카카오/구글 인가 URL로 리다이렉트합니다.
 * 2) 제공자가 /auth/callback/{provider}?code=...&state=... 로 되돌려보냅니다.
 * 3) 콜백 페이지가 consumePendingOAuth로 저장해둔 codeVerifier를 꺼내 state를 검증한 뒤
 *    code/codeVerifier/redirectUri를 백엔드 POST /auth/{provider} 로 전달합니다.
 */

import type { SocialProvider } from "@/types/auth";

type ProviderConfig = {
    authorizeUrl: string;
    clientId: string;
    scope: string;
};

const providerConfigs: Record<SocialProvider, ProviderConfig> = {
    kakao: {
        authorizeUrl: "https://kauth.kakao.com/oauth/authorize",
        clientId: import.meta.env.VITE_KAKAO_CLIENT_ID ?? "",
        // 카카오는 콘솔 동의항목 설정을 따르며, 이메일은 요청하지 않습니다.
        scope: "",
    },
    google: {
        authorizeUrl: "https://accounts.google.com/o/oauth2/v2/auth",
        clientId: import.meta.env.VITE_GOOGLE_CLIENT_ID ?? "",
        scope: "openid email profile",
    },
};

const STORAGE_PREFIX = "oauth:";

type PendingOAuth = { codeVerifier: string; state: string };

// 콜백에서 사용할 redirectUri. 인가 요청과 토큰 교환에 반드시 동일한 값을 사용합니다.
export const buildRedirectUri = (provider: SocialProvider) =>
    `${window.location.origin}/auth/callback/${provider}`;

const base64UrlEncode = (bytes: Uint8Array) => {
    let binary = "";
    for (const byte of bytes) binary += String.fromCharCode(byte);
    return btoa(binary)
        .replace(/\+/g, "-")
        .replace(/\//g, "_")
        .replace(/=+$/, "");
};

const randomBase64Url = (byteLength: number) => {
    const bytes = new Uint8Array(byteLength);
    crypto.getRandomValues(bytes);
    return base64UrlEncode(bytes);
};

const createCodeChallenge = async (codeVerifier: string) => {
    const data = new TextEncoder().encode(codeVerifier);
    const digest = await crypto.subtle.digest("SHA-256", data);
    return base64UrlEncode(new Uint8Array(digest));
};

/**
 * 소셜 로그인을 시작합니다. codeVerifier/state를 저장하고 제공자 인가 URL로 이동합니다.
 * client id가 비어 있으면(값 미전달) 에러를 던집니다.
 */
export const startSocialLogin = async (provider: SocialProvider) => {
    const config = providerConfigs[provider];

    if (!config.clientId) {
        throw new Error(
            `${provider} client id가 설정되지 않았습니다. .env를 확인하세요.`
        );
    }

    const codeVerifier = randomBase64Url(32);
    const state = randomBase64Url(16);
    const codeChallenge = await createCodeChallenge(codeVerifier);

    const pending: PendingOAuth = { codeVerifier, state };
    sessionStorage.setItem(
        `${STORAGE_PREFIX}${provider}`,
        JSON.stringify(pending)
    );

    const params = new URLSearchParams({
        client_id: config.clientId,
        redirect_uri: buildRedirectUri(provider),
        response_type: "code",
        state,
        code_challenge: codeChallenge,
        code_challenge_method: "S256",
    });
    if (config.scope) params.set("scope", config.scope);

    window.location.assign(`${config.authorizeUrl}?${params.toString()}`);
};

/**
 * 콜백에서 저장해둔 codeVerifier를 꺼내고 state를 검증한 뒤 저장소를 비웁니다.
 * state 불일치(CSRF 의심)나 저장값 부재 시 null을 반환합니다.
 */
export const consumePendingOAuth = (
    provider: SocialProvider,
    returnedState: string | null
): PendingOAuth | null => {
    const key = `${STORAGE_PREFIX}${provider}`;
    const raw = sessionStorage.getItem(key);
    sessionStorage.removeItem(key);

    if (!raw) return null;

    try {
        const pending = JSON.parse(raw) as PendingOAuth;
        if (!returnedState || pending.state !== returnedState) return null;
        return pending;
    } catch {
        return null;
    }
};
