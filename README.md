# VoteUP

**VoteUP | 누구나 쉽게 만드는 실시간 투표 서비스**

## 서비스 소개

스트리밍 이벤트, 세미나, 온라인 모임에서 사용할 수 있는 실시간 투표 플랫폼입니다.

호스트는 투표를 생성하고 관리할 수 있으며, 참가자는 익명으로 투표에 참여할 수 있습니다.

### 주요 기능

- **호스트 기능**: 투표 생성/관리, 실시간 결과 확인, 투표 시작/종료
- **참가자 기능**: 익명 투표 참여, 실시간 결과 확인
- **실시간 동기화**: 투표 결과 즉시 업데이트
- **1회 투표 제한**: LocalStorage 기반 중복 투표 방지

## 기술 스택

### Frontend

- **Framework**: Next.js 15 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **UI Components**: shadcn/ui + Radix UI
- **Icons**: Lucide React
- **Animation**: Framer Motion
- **State Management**: Zustand

### Backend

- **BaaS**: Supabase
- **Database**: PostgreSQL (Supabase)
- **Authentication**: Supabase Auth
- **Real-time**: Supabase Realtime

### Tools

- **Package Manager**: Yarn Berry
- **Linting**: ESLint
- **Type Checking**: TypeScript

## 프로젝트 구조

```
src/
├── app/                     # Next.js App Router
│   ├── page.tsx            # 메인 랜딩 페이지
│   ├── layout.tsx          # 전역 레이아웃
│   ├── auth/               # 인증 페이지
│   │   ├── login/page.tsx  # 로그인
│   │   └── signup/page.tsx # 회원가입
│   ├── dashboard/page.tsx  # 호스트 대시보드
│   └── vote/
│       ├── create/page.tsx # 투표 생성
│       └── [id]/page.tsx   # 투표 참여
├── components/
│   ├── ui/                 # shadcn/ui 컴포넌트들 모음
│   │   └── index.ts        # UI 컴포넌트 통합 export
│   └── providers/          # Context Providers
├── lib/
│   ├── supabase.ts         # Supabase 클라이언트
│   ├── utils.ts            # 유틸리티 함수
│   └── vote-utils.ts       # 투표 관련 유틸리티
└── store/
    └── index.ts            # Zustand 상태 관리
```

## 주요 아키텍처

- **Frontend**: React Server Components + Client Components 하이브리드
- **State Management**: Zustand로 클라이언트 상태 관리
- **Real-time**: Supabase Realtime으로 WebSocket 기반 실시간 업데이트
- **Authentication**: Supabase Auth로 JWT 기반 인증
- **Database**: PostgreSQL + RLS로 보안 강화

## 보안

- Row Level Security (RLS)로 데이터베이스 보안
- JWT 토큰 기반 인증
- LocalStorage 기반 1회 투표 제한
- CSRF 보호 및 입력 검증
