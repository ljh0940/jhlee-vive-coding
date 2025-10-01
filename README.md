# jhlee-vive-coding

로또 번호를 생성하고 당첨 번호를 표시하는 Vite + React 기반 로또 웹사이트 애플리케이션입니다.

## 시작하기

### 의존성 설치

```bash
pnpm install
```

### 개발 서버 실행

```bash
pnpm dev
```

브라우저에서 [http://localhost:3000](http://localhost:3000)을 열어 결과를 확인하세요.

### 프로덕션 빌드

```bash
pnpm build
```

### 빌드 미리보기

```bash
pnpm preview
```

## 기술 스택

- **Vite** - 빠른 개발 서버와 최적화된 빌드
- **React 19** - UI 라이브러리
- **TypeScript** - 타입 안전성
- **React Router** - 클라이언트 사이드 라우팅
- **Tailwind CSS 4** - 유틸리티 우선 CSS 프레임워크
- **pnpm** - 빠르고 효율적인 패키지 매니저

## 주요 기능

- 🎰 로또 번호 생성기 (1-45 사이의 6개 번호 + 보너스)
- 🎯 룰렛 추첨 시스템
- 🏆 최근 당첨 번호 조회 (dhlottery.co.kr API)
- 🔐 사용자 인증 (Mock)
- 📱 반응형 디자인
- 🌙 다크 모드 지원

## 프로젝트 구조

```
src/
├── components/       # Atomic Design 컴포넌트
│   ├── atoms/       # 기본 빌딩 블록
│   ├── molecules/   # 단순한 컴포넌트 조합
│   └── organisms/   # 복잡한 컴포넌트
├── contexts/        # React Context (인증)
├── pages/           # 페이지 컴포넌트
├── services/        # API 서비스
├── lib/             # 유틸리티 함수
└── App.tsx          # 메인 App + Router
```

## 라우트

- `/` - 홈 페이지
- `/login` - 로그인
- `/signup` - 회원가입
- `/lotto` - 로또 번호 생성기
- `/roulette` - 룰렛 추첨

## 라이선스

MIT