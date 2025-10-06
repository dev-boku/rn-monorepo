# React Native Monorepo

pnpm workspace 기반의 React Native + Expo + TypeScript 모노레포 프로젝트입니다.

## 📁 프로젝트 구조

```
.
├── apps/                          # 애플리케이션들
│   └── example/                   # React Native + Expo 앱
│       ├── app.json              # Expo 앱 설정
│       ├── metro.config.js       # Metro 번들러 설정 (모노레포 지원)
│       ├── package.json          # 앱 의존성
│       └── src/                  # 소스 코드
├── packages/                      # 공유 패키지들
│   ├── eslint-config/            # ESLint 설정 패키지
│   └── typescript-config/        # TypeScript 설정 패키지
├── package.json                  # 루트 패키지 설정
├── pnpm-workspace.yaml          # 워크스페이스 설정
└── turbo.json                   # Turborepo 설정
```

## 🚀 시작하기

### 설치
```bash
# 의존성 설치
pnpm install

# 개발 서버 시작
cd apps/example
pnpm start
```

## 🛠️ 모노레포 구조

### 워크스페이스 설정
- `apps/*`: 실행 가능한 애플리케이션들
- `packages/*`: 공유 라이브러리 및 설정 패키지들

### 현재 패키지들
- **eslint-config**: 공통 ESLint 설정
- **typescript-config**: 공통 TypeScript 설정

# rn-monorepo
