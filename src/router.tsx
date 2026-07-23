/*
 * router.tsx는 정비서 웹앱의 라우팅을 총괄하는 라우팅 코드입니다.
 * 여기서 정의된 router는 main.tsx의 RouterProvider의 router로 적용됩니다.
 *
 * 정비서 웹앱의 라우트 url은 다음으로 구성되어 있습니다.
 * - '/': 메인 페이지 (ProtectedRoute로 보호)
 * - '/login': 로그인 페이지
 * - '/terms': 약관동의 페이지
 * - '/onboarding': 온보딩 페이지
 * - '/recommend': 추천 페이지 (ProtectedRoute로 보호)
 * - '/calendar': 마감 캘린더 페이지 (ProtectedRoute로 보호)
 * - '/available-policies': 신청 가능한 지원금 목록 페이지 (ProtectedRoute로 보호)
 * - '/policies/:policyId': 지원금 상세 페이지 (ProtectedRoute로 보호)
 *
 * 'ProtectedRoute'는 부팅 중이거나 로그인 상태가 아닌 유저의 접근을 막습니다.
 */

import App from "@/App";
import { ProtectedRoute } from "@/components/route/ProtectedRoute";
import { RouteLoading } from "@/components/route/RouteLoading";
import ErrorPage from "@/pages/ErrorPage";
import {
    AuthCallback,
    AvailablePolicies,
    CalendarPage,
    Home,
    Login,
    MyPage,
    MyPageEdit,
    MyPageTerms,
    Onboarding,
    PolicyDetail,
    Recommendation,
    Terms,
    Withdrawal,
} from "@/routes/lazyPages";
import { Suspense, type ReactNode } from "react";
import { createBrowserRouter } from "react-router-dom";

const lazyPage = (page: ReactNode) => (
    <Suspense fallback={<RouteLoading />}>{page}</Suspense>
);

const protectedPage = (page: ReactNode) => (
    <ProtectedRoute>{lazyPage(page)}</ProtectedRoute>
);

// 라우트 정의
export const router = createBrowserRouter([
    {
        path: "/",
        element: <App />, // 공통 레이아웃
        errorElement: <ErrorPage />,
        children: [
            {
                index: true, // path: '/'
                element: protectedPage(<Home />),
            },
            {
                path: "login",
                element: lazyPage(<Login />),
            },
            {
                path: "terms",
                element: protectedPage(<Terms />),
            },
            {
                path: "onboarding",
                element: protectedPage(<Onboarding />),
            },
            {
                path: "auth/callback/:provider",
                element: lazyPage(<AuthCallback />),
            },
            {
                path: "recommend",
                element: protectedPage(<Recommendation />),
            },
            {
                path: "calendar",
                element: protectedPage(<CalendarPage />),
            },
            {
                path: "available-policies",
                element: protectedPage(<AvailablePolicies />),
            },
            {
                path: "policies/:policyId",
                element: protectedPage(<PolicyDetail />),
            },
            {
                path: "mypage",
                element: protectedPage(<MyPage />),
            },
            {
                path: "mypage/edit",
                element: protectedPage(<MyPageEdit />),
            },
            {
                path: "mypage/terms",
                element: protectedPage(<MyPageTerms />),
            },
            {
                path: "mypage/withdraw",
                element: protectedPage(<Withdrawal />),
            },
            {
                path: "*",
                element: <ErrorPage notFound />,
            },
        ],
    },
]);
