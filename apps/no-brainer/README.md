# NoBrainer - 스마트 학습 카드 앱

AI 기반 스마트 카드 생성과 과학적 복습 시스템을 제공하는 학습 앱

## 🚀 시작하기

### 개발 환경 실행
```bash
# 의존성 설치
pnpm install

# 개발 서버 시작
pnpm start

# iOS 실행
pnpm ios

# Android 실행
pnpm android
```

## 📱 주요 기능

### Phase 0 (완료) ✅
- Expo + TypeScript 프로젝트 초기화
- Bottom Tab + Stack 네비게이션 구조
- 블루/화이트 테마 시스템 (이미지 디자인 참고)
- SQLite 데이터베이스 및 스키마 설계
- Zustand 상태 관리 설정

### Phase 1 MVP (진행 예정) 🚧
- 게스트 모드 시작
- 덱 CRUD 기능
- 수동 카드 생성 (Basic, Basic reversed)
- 학습 화면 (Hard/Good/Easy)
- 1/4/7/14일 고정 간격 SRS 알고리즘
- 로컬 알림 시스템
- React Native Reanimated 카드 애니메이션

## 🏗 프로젝트 구조

```
src/
├── components/         # 재사용 가능한 UI 컴포넌트
├── navigation/        # 네비게이션 구조
│   ├── RootNavigator.tsx
│   └── TabNavigator.tsx
├── screens/          # 화면 컴포넌트
│   ├── HomeScreen.tsx
│   ├── DecksScreen.tsx
│   ├── StudyScreen.tsx
│   ├── StatsScreen.tsx
│   └── SettingsScreen.tsx
├── services/         # 비즈니스 로직
│   └── database.ts   # SQLite 데이터베이스
├── store/           # Zustand 상태 관리
│   ├── deckStore.ts
│   ├── cardStore.ts
│   └── studyStore.ts
├── theme/           # 디자인 시스템
│   ├── colors.ts
│   ├── typography.ts
│   └── spacing.ts
└── types/           # TypeScript 타입 정의
    ├── navigation.ts
    └── database.ts
```

## 🎨 디자인 시스템

### 색상 팔레트
- **Primary**: #5B6CF3 (메인 블루)
- **Background**: #FFFFFF (화이트)
- **Secondary**: #F3F4F6 (연한 회색)

### 카드 난이도 색상
- **Hard**: #EF4444 (빨강)
- **Good**: #10B981 (초록)
- **Easy**: #3B82F6 (파랑)

## 📊 데이터베이스 스키마

### 테이블 구조
- `decks`: 덱 정보
- `cards`: 카드 데이터
- `review_logs`: 학습 기록
- `study_sessions`: 세션 통계

## 🛠 기술 스택

- **Frontend**: React Native + Expo
- **Navigation**: React Navigation v7
- **State**: Zustand
- **Database**: SQLite (expo-sqlite)
- **Animation**: React Native Reanimated
- **UI**: Custom theme system
- **TypeScript**: Strict mode

## 📝 개발 로드맵

자세한 로드맵은 [docs/no-brainer/roadmap-detail.md](../../docs/no-brainer/roadmap-detail.md) 참조

## 🤝 기여하기

이 프로젝트는 모노레포 구조로 관리됩니다.
기여 전 루트 디렉토리의 가이드라인을 확인해주세요.