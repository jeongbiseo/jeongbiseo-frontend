/*
 * 공통 Header 컴포넌트입니다.
 * 화면 상단 바로, 뒤로가기 버튼 / 타이틀 / 오른쪽 슬롯을 옵션으로 조합합니다.
 *
 * - showBack: 뒤로가기 버튼 표시 (기본 동작은 navigate(-1), onBack으로 커스텀 가능)
 * - title: 가운데 타이틀 영역 (문자열 또는 노드)
 * - right: 오른쪽 슬롯 (검색 아이콘, 버튼 등)
 */

import type { ReactNode } from "react";
import { useNavigate } from "react-router-dom";

type HeaderProps = {
    title?: ReactNode;
    showBack?: boolean;
    onBack?: () => void;
    right?: ReactNode;
};

const Header = ({ title, showBack = false, onBack, right }: HeaderProps) => {
    const navigate = useNavigate();

    const handleBack = () => {
        if (onBack) onBack();
        else navigate(-1);
    };

    return (
        <header className="flex min-h-9 w-full items-center justify-between">
            <div className="flex min-w-0 flex-1 items-center gap-2">
                {showBack && (
                    <button
                        className="focus-visible:outline-primary flex size-7 shrink-0 cursor-pointer items-center text-black focus-visible:rounded focus-visible:outline-2"
                        type="button"
                        aria-label="이전 화면으로 돌아가기"
                        onClick={handleBack}
                    >
                        <svg
                            className="size-icon-md"
                            viewBox="0 0 20 20"
                            fill="none"
                            aria-hidden="true"
                        >
                            <path
                                d="M18 10H2m0 0 7-7m-7 7 7 7"
                                stroke="currentColor"
                                strokeWidth="1.8"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                            />
                        </svg>
                    </button>
                )}
                {title && (
                    <h1 className="text-heading-page truncate">{title}</h1>
                )}
            </div>

            {right && <div className="shrink-0">{right}</div>}
        </header>
    );
};

export default Header;
