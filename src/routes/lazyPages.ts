import { lazy } from "react";

export const AuthCallback = lazy(() => import("@/pages/AuthCallback"));
export const AvailablePolicies = lazy(
    () => import("@/pages/AvailablePolicies")
);
export const CalendarPage = lazy(() => import("@/pages/CalendarPage"));
export const Home = lazy(() => import("@/pages/Home"));
export const Login = lazy(() => import("@/pages/Login"));
export const MyPage = lazy(() => import("@/pages/MyPage"));
export const MyPageEdit = lazy(() => import("@/pages/MyPageEdit"));
export const MyPageTerms = lazy(() => import("@/pages/MyPageTerms"));
export const Onboarding = lazy(() => import("@/pages/Onboarding"));
export const PolicyDetail = lazy(() => import("@/pages/PolicyDetail"));
export const Recommendation = lazy(() => import("@/pages/Recommendation"));
export const Terms = lazy(() => import("@/pages/Terms"));
export const Withdrawal = lazy(() => import("@/pages/Withdrawal"));
