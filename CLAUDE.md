# CLAUDE.md

이 파일은 이 저장소에서 작업할 때 Claude Code (claude.ai/code)에 대한 가이드를 제공합니다.

## 프로젝트 개요

로또 번호를 생성하고 당첨 번호를 표시하는 Vite + React 기반 로또 웹사이트 애플리케이션입니다. 사용자 인증, 로또 번호 생성, 룰렛 기능, 그리고 한국 로또 API(dhlottery.co.kr)에서 실제 로또 데이터를 가져오는 기능을 제공합니다.

## 명령어

이 프로젝트는 pnpm을 패키지 매니저로 사용합니다.

### 의존성 설치
```bash
pnpm install         # 의존성 설치
```

### 개발
```bash
pnpm dev             # Vite 개발 서버 시작 (http://localhost:3000)
```

### 빌드
```bash
pnpm build           # TypeScript 체크 후 Vite로 프로덕션 빌드
```

### 프리뷰
```bash
pnpm preview         # 프로덕션 빌드 미리보기
```

## 아키텍처

### 프로젝트 구조
```
src/
├── components/       # Atomic Design 컴포넌트
│   ├── atoms/       # 기본 빌딩 블록
│   ├── molecules/   # 단순한 컴포넌트 조합
│   └── organisms/   # 복잡한 컴포넌트
├── contexts/        # React Context (AuthContext)
├── pages/           # 페이지 컴포넌트 (React Router)
├── services/        # API 서비스 (lotteryService)
├── lib/             # 유틸리티 함수
├── App.tsx          # 메인 App 컴포넌트 with Router
├── main.tsx         # 애플리케이션 엔트리 포인트
└── index.css        # 글로벌 스타일 (Tailwind)
```

### 컴포넌트 구조
Atomic Design 원칙을 따릅니다:
- **Atoms** (`src/components/atoms/`): 기본 빌딩 블록 (Button, Input, Card, LottoBall, Logo)
- **Molecules** (`src/components/molecules/`): 단순한 컴포넌트 조합 (SocialLoginButton, UserProfile, LottoNumberSet)
- **Organisms** (`src/components/organisms/`): 복잡한 컴포넌트 (SocialLoginSection, LottoGenerator, WinningNumbers)

### 라우팅
React Router를 사용한 클라이언트 사이드 라우팅:
- `/`: 홈 페이지 (인증 상태에 따른 조건부 렌더링)
- `/login`: 로그인 페이지
- `/signup`: 회원가입 페이지
- `/oauth2/redirect`: OAuth2 리다이렉트 핸들러
- `/lotto`: 로또 번호 생성기 페이지 (보호된 라우트)
- `/roulette`: 룰렛 추첨 페이지 (보호된 라우트)

### 인증 시스템
- React Context를 사용한 클라이언트 사이드 인증 (`src/contexts/AuthContext.tsx`)
- JWT 토큰 기반 인증 (백엔드 연동)
- OAuth2 소셜 로그인 지원 (Kakao)
- localStorage를 사용한 토큰 영속성
- `useAuth()` 훅을 통한 전역 사용자 상태 관리
- `App.tsx`에서 AuthProvider가 전체 애플리케이션을 감싸고 있음
- **ProtectedRoute** 컴포넌트로 인증이 필요한 페이지 보호
- **로그인 후 리다이렉트**: 로그인/회원가입 성공 시 원래 이동하려던 페이지로 자동 리다이렉트
  - `ProtectedRoute`에서 현재 위치를 state로 전달
  - OAuth2 로그인은 localStorage에 경로 저장 후 리다이렉트

### API 서비스
- **lotteryService** (`src/services/lotteryService.ts`): dhlottery.co.kr API 직접 호출
  - `getRecentLotteryNumbers()`: 최근 5개의 당첨 번호 가져오기
  - 날짜 계산을 통해 현재 회차 자동 추정
  - API 실패 시 fallback 데이터 반환
  - CORS 처리를 위한 적절한 헤더 설정

- **authService** (`src/services/authService.ts`): 백엔드 인증 API 연동
  - `signUp()`: 회원가입
  - `signIn()`: 로그인
  - `getCurrentUser()`: 현재 사용자 정보 조회
  - `initiateOAuth2Login()`: OAuth2 소셜 로그인 시작 (Kakao)
  - `saveTokens()`, `clearTokens()`: JWT 토큰 관리
  - `getOAuth2RedirectPath()`: OAuth2 리다이렉트 경로 관리

### Path Aliases
- `@/*`는 `src/` 디렉토리를 매핑 (tsconfig.json 및 vite.config.ts에 설정됨)

### 스타일링
- `src/index.css`에 커스텀 유틸리티 클래스를 포함한 Tailwind CSS 4
- 버튼, 카드, 레이아웃을 위한 사전 정의된 클래스가 있는 커스텀 디자인 시스템
- 모바일 우선 접근 방식의 반응형 디자인
- 다크 모드 지원 (prefers-color-scheme)

### 로또 번호 생성
로또 생성기(`src/components/organisms/LottoGenerator/LottoGenerator.tsx`)는 다음을 생성합니다:
- 1-45 사이의 중복되지 않는 6개 번호 (오름차순 정렬)
- 메인 6개 번호와 다른 1개의 보너스 번호
- 더 나은 UX를 위한 1초 애니메이션 딜레이 구현

### 로또 히스토리 관리
생성된 로또 번호는 localStorage에 자동 저장됩니다 (`src/pages/Lotto.tsx`):
- **자동 저장**: 번호 생성 시 localStorage에 저장
- **30일 보관**: 30일이 지난 번호는 자동으로 삭제
- **페이지네이션**: 페이지당 5개씩 표시
- **삭제 기능**: 개별 삭제 및 전체 삭제 지원
- **영구 보관**: 페이지 새로고침 시에도 유지

### 유틸리티
- `src/lib/utils.ts`: clsx와 tailwind-merge를 사용하여 Tailwind 클래스를 병합하는 `cn()` 헬퍼 포함

### 빌드 도구
- **Vite**: 빠른 개발 서버와 최적화된 프로덕션 빌드
- **@vitejs/plugin-react**: React Fast Refresh 지원
- **TypeScript**: 타입 안정성과 개발자 경험 향상