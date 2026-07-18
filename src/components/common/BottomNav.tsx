/*
 * 공통 하단 네비게이션 컴포넌트입니다.
 * 홈 / 추천 / 캘린더 / MY 4개 탭을 제공하며, 메인 화면 하단에 고정됩니다.
 * 현재 경로에 해당하는 탭이 활성 상태(네이비)로 표시됩니다.
 *
 * NOTE: /calendar, /mypage 라우트는 아직 없어 클릭 시 빈 화면이 보일 수 있습니다.
 *       해당 페이지 이슈에서 라우트를 채울 예정입니다.
 */

import type { ComponentType } from "react";
import { NavLink } from "react-router-dom";

type NavItem = {
    to: string;
    label: string;
    Icon: ComponentType<{ className?: string }>;
    end?: boolean;
};

const navItems: NavItem[] = [
    { to: "/", label: "홈", Icon: HomeIcon, end: true },
    { to: "/recommend", label: "추천", Icon: StarIcon },
    { to: "/calendar", label: "캘린더", Icon: CalendarIcon },
    { to: "/mypage", label: "MY", Icon: PersonIcon },
];

const BottomNav = () => (
    <nav className="fixed bottom-0 left-1/2 z-40 w-full max-w-[390px] -translate-x-1/2 border-t border-[#eee] bg-white">
        <ul className="flex h-[68px] items-center justify-around px-2">
            {navItems.map(({ to, label, Icon, end }) => (
                <li key={to}>
                    <NavLink
                        to={to}
                        end={end}
                        className={({ isActive }) =>
                            `flex w-16 flex-col items-center gap-1 ${isActive ? "text-third" : "text-text-faint"}`
                        }
                    >
                        <Icon className="size-6" />
                        <span className="text-[11px] font-semibold">
                            {label}
                        </span>
                    </NavLink>
                </li>
            ))}
        </ul>
    </nav>
);

function HomeIcon({ className }: { className?: string }) {
    return (
        <svg
            className={className}
            viewBox="0 0 24 24"
            fill="currentColor"
            aria-hidden="true"
        >
            <path d="M12 3 3 10.5V21h6v-6h6v6h6V10.5L12 3Z" />
        </svg>
    );
}

function StarIcon({ className }: { className?: string }) {
    return (
        <svg
            className={className}
            viewBox="0 0 24 24"
            fill="currentColor"
            aria-hidden="true"
        >
            <path d="M12 2c.4 4.5 3.5 7.6 8 8-4.5.4-7.6 3.5-8 8-.4-4.5-3.5-7.6-8-8 4.5-.4 7.6-3.5 8-8Z" />
        </svg>
    );
}

function CalendarIcon({ className }: { className?: string }) {
    return (
        <svg
            className={className}
            viewBox="0 0 24 24"
            fill="currentColor"
            aria-hidden="true"
        >
            <path d="M7 2v2H5a2 2 0 0 0-2 2v13a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6a2 2 0 0 0-2-2h-2V2h-2v2H9V2H7Zm12 7v10H5V9h14Z" />
        </svg>
    );
}

function PersonIcon({ className }: { className?: string }) {
    return (
        <svg
            className={className}
            viewBox="0 0 24 24"
            fill="currentColor"
            aria-hidden="true"
        >
            <path d="M12 12a4 4 0 1 0 0-8 4 4 0 0 0 0 8Zm0 2c-4 0-8 2-8 5v1h16v-1c0-3-4-5-8-5Z" />
        </svg>
    );
}

export default BottomNav;
