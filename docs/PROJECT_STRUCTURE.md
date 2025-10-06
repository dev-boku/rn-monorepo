# 프로젝트 구조 상세 가이드

## 📁 디렉토리 구조

### `/apps/` - 애플리케이션
실행 가능한 애플리케이션들이 위치합니다.

- **`example/`**: React Native + Expo 앱
  - `metro.config.js`: 모노레포 패키지 해결 설정
  - `src/app/`: Expo Router 기반 라우팅
  - `src/components/`: 재사용 가능한 컴포넌트들

### `/packages/` - 공유 패키지
팀에서 공유하는 설정과 라이브러리들이 위치합니다.

- **`eslint-config/`**: 공통 ESLint 설정
  - `expo.js`: Expo 프로젝트용 ESLint 설정
- **`typescript-config/`**: 공통 TypeScript 설정

### 루트 파일들
- `pnpm-workspace.yaml`: 워크스페이스 정의
- `turbo.json`: Turborepo 빌드 설정
- `package.json`: 루트 패키지 설정

## 🔧 개발 워크플로우

### 새 패키지 추가
1. `packages/` 디렉토리에 새 폴더 생성
2. `package.json` 초기화
3. `pnpm-workspace.yaml` 자동 인식

### 앱에서 패키지 사용
```json
// apps/example/package.json
{
  "dependencies": {
    "@repo/eslint-config": "workspace:*"
  }
}
```

