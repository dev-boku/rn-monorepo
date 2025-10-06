# CLAUDE.md

이 파일은 이 저장소의 코드 작업 시 Claude Code (claude.ai/code)에 가이드를 제공합니다.

## 저장소 개요

pnpm 워크스페이스와 Turborepo를 사용하는 React Native 모노레포입니다.

## 프로젝트 구조

```
├── apps/
│   ├── lotto/           # 메인 로또 앱 (Expo + React Native)
│   └── no-brainer/      # 테스트 환경 구축된 앱 (Expo + React Native + Jest)
├── packages/
│   ├── eslint-config/   # 공유 ESLint 설정 (@repo/eslint-config)
│   ├── typescript-config/ # 공유 TypeScript 설정
│   └── ui/              # 공유 UI 컴포넌트 (@repo/ui)
└── turbo.json          # Turborepo 파이프라인 설정
```

- **Root**: pnpm workspace 기반 모노레포
- **Workspace 설정**: [pnpm-workspace.yaml](mdc:pnpm-workspace.yaml) - `apps/*`, `packages/*`
- **앱**: [apps/**/](mdc:apps/**) - React Native + Expo + TypeScript
- **공유 패키지**:
  - [packages/eslint-config/](mdc:packages/eslint-config) - ESLint 설정 패키지
  - [packages/typescript-config/](mdc:packages/typescript-config) - TypeScript 설정 패키지

## 현재 패키지들

- **eslint-config**: 공통 ESLint 설정
- **typescript-config**: 공통 TypeScript 설정

## 관련 파일

- [pnpm-workspace.yaml](mdc:pnpm-workspace.yaml) - 워크스페이스 정의
- [packages/eslint-config/package.json](mdc:packages/eslint-config/package.json) - ESLint 설정
- [packages/typescript-config/package.json](mdc:packages/typescript-config/package.json) - TypeScript 설정

## 개발 명령어

### 설치 & 설정

```bash
# 모든 의존성 설치 (pnpm 필요)
pnpm install
```

### 빌드 & 린트

```bash
# 루트 디렉토리에서 (Turborepo 명령어)
pnpm turbo run build  # 모든 패키지 빌드
pnpm turbo run lint   # 모든 패키지 린트
pnpm turbo run dev    # 개발 모드
```

### 워크스페이스 관리

```bash
# 루트에서 새 워크스페이스 생성
pnpm gen  # turbo gen workspace --copy
```

## 프로젝트별 가이드

각 프로젝트의 세부 개발 가이드는 해당 앱의 `CLAUDE.local.md` 파일에서 확인하세요:

- [apps/lotto/CLAUDE.local.md](mdc:apps/lotto/CLAUDE.local.md) - 로또 앱 개발 가이드
- apps/no-brainer/ - React Native 통합 테스트 환경 (FSD 아키텍처 + Jest + React Native Testing Library)

## 테스팅 가이드 (no-brainer 앱)

### 테스트 환경 설정
- **테스트 프레임워크**: Jest + React Native Testing Library
- **아키텍처**: FSD (Feature-Sliced Design)
- **테스트 위치**: 컴포넌트와 동일한 위치에 `*.test.tsx` 파일 배치

### 테스트 명령어
```bash
# no-brainer 앱 디렉토리에서
cd apps/no-brainer

# 테스트 실행
pnpm test

# 테스트 감시 모드
pnpm test:watch

# 커버리지 리포트
pnpm test:coverage

# 스냅샷 업데이트
pnpm test:update
```

### FSD 테스트 구조
```
src/
├── shared/ui/components/Button/
│   ├── Button.tsx          # 컴포넌트
│   ├── Button.test.tsx     # 테스트 (컴포넌트와 동일 위치)
│   └── index.ts
├── entities/todo/
│   ├── model/todo.ts       # 모델
│   ├── lib/useTodos.ts     # 비즈니스 로직
│   └── lib/useTodos.test.ts # 테스트
└── features/todo-list/
    ├── ui/TodoList.tsx
    └── ui/TodoList.test.tsx # 통합 테스트
```

### 테스트 작성 팁
- **컴포넌트 테스트**: rendering, interactions, styles
- **Hook 테스트**: renderHook 사용
- **통합 테스트**: 여러 레이어를 조합한 기능 테스트
- **Mocking**: jest.setup.js에 공통 mock 설정 완료

## 중요한 파일들

- `turbo.json` - Turborepo 파이프라인 설정

# 중요한 지시사항 알림

요청된 것만 수행하세요; 그 이상도 그 이하도 아닙니다.
절대 필요한 경우가 아니면 파일을 생성하지 마세요.
항상 새 파일을 만드는 것보다 기존 파일을 편집하는 것을 선호하세요.
사용자가 명시적으로 요청하지 않는 한 절대 문서 파일(*.md)이나 README 파일을 생성하지 마세요.
