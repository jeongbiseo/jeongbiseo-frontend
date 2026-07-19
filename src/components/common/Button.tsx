/*
 * 공통 Button 컴포넌트입니다.
 * 디자인 시스템의 버튼 스타일을 variant로 제공하며, 페이지 전반의 CTA에 사용합니다.
 *
 * - primary: 초록 CTA (기본)
 * - kakao: 카카오 로그인
 * - google: 구글 로그인
 * - dark: 네이비 보조 버튼 (예: 내 정보 수정)
 *
 * size로 높이를 조절하고, disabled 상태는 disabled prop으로 처리합니다.
 * 일회성 조정이 필요하면 className으로 덮어쓸 수 있습니다.
 */

import type { ButtonHTMLAttributes, ReactNode } from "react";

type ButtonVariant = "primary" | "kakao" | "google" | "dark";
type ButtonSize = "md" | "lg";

const variantStyles: Record<ButtonVariant, string> = {
    primary:
        "bg-primary text-white shadow-[3px_11px_16.3px_var(--color-green-light-active)]",
    kakao: "bg-kakao text-text-strong",
    google: "bg-[#f2f2f2] text-black",
    dark: "bg-third text-white",
};

const sizeStyles: Record<ButtonSize, string> = {
    md: "h-[52px] text-[18px]",
    lg: "h-[55px] text-[20px]",
};

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
    variant?: ButtonVariant;
    size?: ButtonSize;
    children: ReactNode;
};

const Button = ({
    variant = "primary",
    size = "lg",
    type = "button",
    className = "",
    children,
    ...rest
}: ButtonProps) => (
    <button
        type={type}
        className={`focus-visible:outline-third disabled:bg-disabled w-full cursor-pointer rounded-[15px] font-bold transition-transform hover:brightness-[0.98] focus-visible:outline-3 focus-visible:outline-offset-2 active:scale-[0.99] disabled:cursor-not-allowed disabled:shadow-none disabled:hover:brightness-100 ${variantStyles[variant]} ${sizeStyles[size]} ${className}`}
        {...rest}
    >
        {children}
    </button>
);

export default Button;
