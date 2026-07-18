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
 *
 * 'ProtectedRoute'는 부팅 중이거나 로그인 상태가 아닌 유저의 접근을 막습니다.
 */

import App from "@/App";
import { ProtectedRoute } from "@/components/route/ProtectedRoute";
import Home from "@/pages/Home";
import Login from "@/pages/Login";
import Onboarding from "@/pages/Onboarding";
import Recommendation from "@/pages/Recommendation";
import Terms from "@/pages/Terms";
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
                path: "recommend",
                element: (
                    <ProtectedRoute>
                        <Recommendation />
                    </ProtectedRoute>
                ),
            },
        ],
    },
]);
