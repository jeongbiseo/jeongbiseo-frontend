/*
 * router.tsx는 정비서 웹앱의 라우팅을 총괄하는 라우팅 코드입니다.
 * 여기서 정의된 router는 main.tsx의 RouterProvider의 router로 적용됩니다.
 *
 * 정비서 웹앱의 라우트 url은 다음으로 구성되어 있습니다.
 * - '/': 메인 페이지
 * - '/login': 로그인 페이지
 * - '/terms': 약관동의 페이지
 * - '/onboarding': 온보딩 페이지
 * - '/recommend': 추천 페이지 (ProtectedRoute로 보호)
 * - '/calendar': 마감 캘린더 페이지 (ProtectedRoute로 보호)
 * - '/expected-amount': 예상 수령액 상세 페이지 (ProtectedRoute로 보호)
 * - '/available-policies': 신청 가능한 지원금 목록 페이지 (ProtectedRoute로 보호)
 * - '/policies/:policyId': 지원금 상세 페이지 (ProtectedRoute로 보호)
 *
 * 'ProtectedRoute'는 부팅 중이거나 로그인 상태가 아닌 유저의 접근을 막습니다.
 */

import App from "@/App";
import { ProtectedRoute } from "@/components/route/ProtectedRoute";
import AuthCallback from "@/pages/AuthCallback";
import CalendarPage from "@/pages/CalendarPage";
import AvailablePolicies from "@/pages/AvailablePolicies";
import ExpectedAmount from "@/pages/ExpectedAmount";
import Home from "@/pages/Home";
import FavoriteManagement from "@/pages/FavoriteManagement";
import Login from "@/pages/Login";
import MyPage from "@/pages/MyPage";
import MyPageEdit from "@/pages/MyPageEdit";
import MyPageTerms from "@/pages/MyPageTerms";
import Onboarding from "@/pages/Onboarding";
import PolicyDetail from "@/pages/PolicyDetail";
import Recommendation from "@/pages/Recommendation";
import Terms from "@/pages/Terms";
import Withdrawal from "@/pages/Withdrawal";
import { createBrowserRouter } from "react-router-dom";

// 라우트 정의
export const router = createBrowserRouter([
    {
        path: "/",
        element: <App />, // 공통 레이아웃
        // errorElement: <ErrorPage />, // 에러 페이지
        children: [
            {
                index: true, // path: '/'
                element: <Home />,
            },
            {
                path: "login",
                element: <Login />,
            },
            {
                path: "terms",
                element: <Terms />,
            },
            {
                path: "onboarding",
                element: <Onboarding />,
            },
            {
                path: "auth/callback/:provider",
                element: <AuthCallback />,
            },
            {
                path: "recommend",
                element: (
                    <ProtectedRoute>
                        <Recommendation />
                    </ProtectedRoute>
                ),
            },
            {
                path: "calendar",
                element: (
                    <ProtectedRoute>
                        <CalendarPage />
                    </ProtectedRoute>
                ),
            },
            {
                path: "expected-amount",
                element: (
                    <ProtectedRoute>
                        <ExpectedAmount />
                    </ProtectedRoute>
                ),
            },
            {
                path: "available-policies",
                element: (
                    <ProtectedRoute>
                        <AvailablePolicies />
                    </ProtectedRoute>
                ),
            },
            {
                path: "policies/:policyId",
                element: (
                    <ProtectedRoute>
                        <PolicyDetail />
                    </ProtectedRoute>
                ),
            },
            {
                path: "mypage",
                element: (
                    <ProtectedRoute>
                        <MyPage />
                    </ProtectedRoute>
                ),
            },
            {
                path: "mypage/edit",
                element: (
                    <ProtectedRoute>
                        <MyPageEdit />
                    </ProtectedRoute>
                ),
            },
            {
                path: "mypage/favorites",
                element: (
                    <ProtectedRoute>
                        <FavoriteManagement />
                    </ProtectedRoute>
                ),
            },
            {
                path: "mypage/terms",
                element: (
                    <ProtectedRoute>
                        <MyPageTerms />
                    </ProtectedRoute>
                ),
            },
            {
                path: "mypage/withdraw",
                element: (
                    <ProtectedRoute>
                        <Withdrawal />
                    </ProtectedRoute>
                ),
            },
        ],
    },
]);
