# 🚀 정비서 웹앱 (React + Vite + TypeScript)

정비서 Front-end 레포지토리입니다. Vite 기반의 React + TypeScript 프로젝트이며, 폼/검증, 라우팅, 스타일링을 위한 최소 스택으로 구성되어 있습니다.

## 📍 라우팅

**다음과 같은 페이지를 제공합니다:**

- `/` — 메인 페이지
- `/login` — 로그인 페이지
- `/auth/callback/:provider` — 소셜 로그인 콜백
- `/terms` — 최초 약관 동의
- `/onboarding` — 회원 온보딩
- `/recommend` — 추천·즐겨찾기·전체 지원금
- `/calendar` — 즐겨찾기 지원금 마감 캘린더
- `/available-policies` — 신청 가능한 지원금 내역
- `/policies/:policyId` — 지원금 상세
- `/mypage` — 마이페이지
- `/mypage/edit` — 회원 정보 및 기수령 지원금 수정
- `/mypage/terms` — 약관 및 마케팅 수신 동의 관리
- `/mypage/withdraw` — 회원 탈퇴

## 🛠️ 기술 스택

- **Main**: React + Vite (TypeScript)
- **State Management**: Zustand
- **Routing**: react-router-dom
- **Styling**: Tailwind CSS
- **Forms**: react-hook-form, Zod, @hookform/resolvers
- **HTTP Client**: axios
- **Auth/Storage**: Zustand 메모리 Access Token + HttpOnly Refresh Token 쿠키
- **UI**: react-calendar
- **Linting & Formatting**: ESLint, Prettier, Husky, lint-staged

## 🏃 빠른 시작

**사전 요구사항**

- Node.js 20.19 이상 (또는 22.12 이상) — Vite 8 최소 요구사항
- npm 설치 및 실행

```bash
# 의존성 설치
npm install

# 개발 서버 실행 (http://localhost:5173)
npm run dev

# TypeScript 타입 체크 + 프로덕션 빌드
npm run build

# ESLint로 코드 검사
npm run lint

# 프로덕션 빌드 미리보기
npm run preview
```

> Husky는 `npm install` 시 `prepare` 스크립트를 통해 자동 설정됩니다.

## 🔐 환경변수 및 소셜 로그인 설정

루트의 `.env.example`을 복사해 `.env`를 만들고 환경별 값을 설정합니다.

| 변수                    | 설명                              | 로컬 예시               |
| ----------------------- | --------------------------------- | ----------------------- |
| `VITE_API_URL`          | 백엔드 서버 Origin                | `https://cartlab.store` |
| `VITE_APP_URL`          | OAuth 콜백 기준 프론트엔드 Origin | `http://localhost:5173` |
| `VITE_KAKAO_CLIENT_ID`  | 카카오 REST API 키                | 팀에서 전달받은 값      |
| `VITE_GOOGLE_CLIENT_ID` | Google OAuth Client ID            | 팀에서 전달받은 값      |

로컬 개발 서버는 OAuth 콜백 주소가 바뀌지 않도록 `localhost:5173`으로 고정합니다. `VITE_APP_URL`에는 경로나 마지막 `/`를 포함하지 않습니다.

소셜 로그인 제공자 콘솔에는 다음 Redirect URI를 등록합니다.

| 환경       | 카카오                                                       | Google                                                        |
| ---------- | ------------------------------------------------------------ | ------------------------------------------------------------- |
| Local      | `http://localhost:5173/auth/callback/kakao`                  | `http://localhost:5173/auth/callback/google`                  |
| Production | `https://jeongbiseo-frontend.vercel.app/auth/callback/kakao` | `https://jeongbiseo-frontend.vercel.app/auth/callback/google` |

Vercel Production 환경의 `VITE_APP_URL`은 `https://jeongbiseo-frontend.vercel.app`으로 설정합니다. Preview 배포에서 소셜 로그인을 사용하려면 해당 Preview Origin도 각 제공자 콘솔에 별도로 등록해야 합니다.

## 💻 개발 환경 설정 (필수!)

프로젝트의 코드 품질과 일관성을 위해 모든 팀원은 아래 개발 환경을 반드시 설정해야 합니다.

1. **VS Code 확장 프로그램 설치**
   VS Code의 'Extensions' 탭에서 아래 두 개의 확장 프로그램을 검색하여 설치합니다.
    - ESLint (게시자: Microsoft)
    - Prettier - Code formatter (게시자: Prettier)

2. **VS Code 설정 적용**
   이 프로젝트에는 `.vscode/settings.json` 파일이 포함되어 있습니다.
   VS Code가 "이 작업 영역의 설정을 신뢰합니까?"라고 물으면 **'예(Yes)'**를 선택하세요. 이 파일을 통해 모든 팀원에게 아래 설정이 자동으로 적용됩니다.
    - 파일 저장 시 Prettier로 자동 포맷 (`editor.formatOnSave`)
    - ESLint/Prettier 규칙 자동 인식

3. **설정 파일 (참고)**
    - `.prettierrc`: 우리 팀의 코드 스타일 규칙 (들여쓰기, 따옴표 등)
    - `eslint.config.js`: 우리 팀의 코드 품질 규칙 (버그 방지, React 훅 규칙 등)

    결론: 팀원은 1번의 확장 프로그램 2개만 설치하면, `.vscode/settings.json`과 프로젝트 설정 파일에 의해 모든 규칙이 자동으로 적용됩니다.

## 📜 프로젝트 규약 (Conventions)

- **Git 협업 전략**

```bash
   main: 배포용 브랜치 (안정 버전)
   dev: 개발 메인 브랜치 (다음 배포 버전)
   feat/[기능이름]: 기능 개발 브랜치 (예: feat/login)
   fix/[수정내용]: 버그 수정 브랜치 (예: fix/button-layout)
   chore/[작업내용]: 설정 및 환경 구성 브랜치 (예: chore/setup-eslint)
```

- **작업 순서:**

1. `dev` 브랜치에서 `feat/[기능이름]` 브랜치를 생성합니다.
2. 기능 개발 완료 후, `dev` 브랜치로 Pull Request (PR)를 생성합니다.
3. 코드 리뷰 후 `dev` 브랜치에 병합(Merge)합니다.

- **배포 및 릴리스 규칙:**

1. 배포할 기능이 `dev`에서 검증되면 `dev`에서 `main`으로 릴리스 PR을 생성합니다.
2. 릴리스 PR 제목은 `chore(release): 정비서 프로토타입 v0.1.0 배포` 형식을 사용합니다.
3. 장기 브랜치의 커밋 관계를 유지하기 위해 `dev`에서 `main`으로 병합할 때는 **Create a merge commit**을 사용합니다.
4. Production 배포가 완료되면 같은 버전으로 Git 태그를 생성합니다. (예: `v0.1.0`)
5. `main`은 Vercel Production 브랜치로 사용하고, 기능 브랜치와 `dev` 배포는 Preview로 취급합니다.

- **버전 규칙:**
    1. [Semantic Versioning](https://semver.org/)의 `MAJOR.MINOR.PATCH` 형식을 사용합니다.
    2. 정식 출시 전 개발 단계는 `0.x.x` 버전을 사용합니다.
    3. 최초 기능 프로토타입은 `v0.1.0`부터 시작합니다.
    4. 하위 호환 기능 추가는 MINOR, 버그 수정은 PATCH 버전을 올립니다.
    5. 시험 배포가 필요하면 `v0.2.0-beta.1`처럼 pre-release 식별자를 사용합니다.

- **커밋 메시지 컨벤션**
    1. 커밋 메시지는 Conventional Commits 규칙을 따릅니다.

```bash
   feat: 새로운 기능 추가
   fix: 버그 수정
   docs: 문서 수정 (README 등)
   style: 코드 스타일 수정 (포맷팅, 세미콜론 등 로직 변경 없음)
   refactor: 코드 리팩토링
   chore: 빌드 설정, 패키지 매니저 설정 등 (코드 로직 변경 없음)
   예시: "feat: 로그인 페이지 UI 구현", "fix: 메인페이지 레이아웃 깨짐 수정"
```

- **디렉토리 구조**

```bash
src/
├── api/          # API 요청 함수 (axios 인스턴스 포함)
├── assets/       # 이미지, 폰트 등 정적 파일
├── components/
│   ├── common/   # 1. 공통 컴포넌트 (Button, Input, Modal...)
│   └── feature/  # 2. 특정 기능(도메인) 컴포넌트
├── constants/    # 공통 상수 (API URL, 키 값 등)
├── hooks/        # 공통 커스텀 훅 (useToggle, useDebounce...)
├── pages/        # 라우팅되는 페이지 컴포넌트 (react-router-dom 연동)
├── stores/       # Zustand 스토어
├── styles/       # 전역 CSS, tailwind.css
└── utils/        # 순수 유틸 함수 (formatDate, validators...)
```

- **네이밍 컨벤션**
    1. 컴포넌트: PascalCase (예: `MyButton.tsx`)
    2. 그 외 (훅, 유틸, 변수): camelCase (예: `useMyHook.ts`, `formatDate.ts`)

- **절대 경로**
    1. '상대경로 중첩'(`../../...`)을 방지하기 위해 절대 경로를 사용합니다.
    2. `@/`는 `src/` 폴더를 가리킵니다.
    3. 예시: `import Button from '@/components/common/Button';`

## 🔒 Git Hooks (자동 코드 검사)

이 프로젝트는 **Husky**와 **lint-staged**를 사용하여 커밋 전 자동으로 코드를 검사합니다.

### 작동 방식

- `git commit` 실행 시 자동으로:
    1. 변경된 파일에 대해 ESLint 자동 수정
    2. Prettier로 코드 포맷팅
    3. 에러가 있으면 커밋 실패

### 만약 커밋이 실패한다면?

1. 에러 메시지를 확인하고 수정
2. 다시 `git add .`
3. 다시 `git commit`

### 주의사항

- 처음 clone 후 `npm install` 실행 시 Husky가 자동 설치됨
- 커밋 전 자동 검사는 코드 품질 유지를 위한 필수 과정
