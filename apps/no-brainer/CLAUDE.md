# no-brainer CLAUDE 개발 가이드

이 파일은 no-brainer 앱 개발 시 Claude Code에 대한 상세 지침을 제공합니다.

## 프로젝트 개요

**React Native + React Native Reusables 기반 템플릿 프로젝트** - 최소 구성으로 빠르게 시작할 수 있는 스타터 템플릿

## 기술 스택

- **프레임워크**: React Native (0.81.4) + Expo (54.0.12)
- **React**: React 19.1.0 (최신 버전)
- **라우팅**: Expo Router (6.0.10) - file-based routing
- **언어**: TypeScript (5.9.2)
- **스타일링**: NativeWind v4 (Tailwind CSS for React Native)
- **UI 라이브러리**: React Native Reusables
- **아키텍처**: New Architecture 활성화
- **디자인 시스템**: shadcn/ui inspired (new-york style)

## 프로젝트 구조

```
apps/no-brainer/
├── app/                    # Expo Router 화면 (Pages)
│   ├── _layout.tsx        # 루트 레이아웃 (ThemeProvider, Stack)
│   ├── index.tsx          # 홈 화면
│   ├── +html.tsx          # HTML 템플릿 (웹 전용)
│   └── +not-found.tsx     # 404 페이지
├── components/            # UI 컴포넌트
│   └── ui/               # React Native Reusables UI 컴포넌트
│       ├── button.tsx    # Button 컴포넌트 (CVA variants)
│       ├── icon.tsx      # Icon 래퍼
│       └── text.tsx      # Text 컴포넌트
├── lib/                  # 유틸리티 & 설정
│   ├── utils.ts          # cn 함수 (tailwind-merge + clsx)
│   └── theme.ts          # 테마 설정 (NAV_THEME)
├── assets/               # 정적 에셋
│   └── images/           # 이미지 파일
├── global.css            # Tailwind CSS 글로벌 스타일
├── components.json       # shadcn/ui CLI 설정
├── tailwind.config.js    # Tailwind 설정
├── babel.config.js       # Babel 설정 (nativewind)
├── metro.config.js       # Metro bundler 설정
└── tsconfig.json         # TypeScript 설정
```

## 디자인 시스템

### 색상 시스템

shadcn/ui CSS 변수 기반 색상 시스템 사용 (global.css):

- **Primary**: 주요 액션 버튼, 강조 요소
- **Secondary**: 보조 버튼
- **Destructive**: 삭제, 경고 액션
- **Muted**: 비활성 상태, 보조 텍스트
- **Accent**: 선택된 항목, 호버 상태
- **Card/Popover**: 카드, 팝오버 컨테이너

```css
--background: 0 0% 100%;
--foreground: 0 0% 3.9%;
--primary: 0 0% 9%;
--primary-foreground: 0 0% 98%;
/* ... 기타 색상 변수 */
```

### 컴포넌트 Variants (CVA)

Class Variance Authority (CVA)를 사용한 variant 시스템:

```tsx
// Button variants 예시
variant: {
  default: 'bg-primary shadow-sm',
  destructive: 'bg-destructive shadow-sm',
  outline: 'border border-border bg-background',
  secondary: 'bg-secondary shadow-sm',
  ghost: 'active:bg-accent',
  link: '',
}

size: {
  default: 'h-10 px-4 py-2',
  sm: 'h-9 px-3',
  lg: 'h-11 px-6',
  icon: 'h-10 w-10',
}
```

## 개발 명령어

```bash
# 개발 서버 시작
pnpm dev      # Expo Dev Server 시작

# 플랫폼별 실행
pnpm ios      # iOS 시뮬레이터
pnpm android  # Android 에뮬레이터
pnpm web      # 웹 브라우저

# 클린 빌드
pnpm clean    # .expo, node_modules 제거

# 테스트 (Jest 29 + React Native Testing Library 13)
pnpm test             # 테스트 실행
pnpm test:watch       # 감시 모드
pnpm test:coverage    # 커버리지 리포트
```

## 핵심 컴포넌트 가이드

### UI 컴포넌트

**Button** (`components/ui/button.tsx`)
- CVA variants: default, destructive, outline, secondary, ghost, link
- Sizes: default, sm, lg, icon
- Platform-specific styles (웹: hover, focus-visible)

```tsx
<Button variant="default" size="default">
  <Text>Click me</Text>
</Button>
```

**Text** (`components/ui/text.tsx`)
- Context-aware styling (TextClassContext)
- Variants 지원

**Icon** (`components/ui/icon.tsx`)
- lucide-react-native 래퍼
- className 지원

### 유틸리티

**cn 함수** (`lib/utils.ts`)
- tailwind-merge + clsx 조합
- 조건부 클래스 병합

```tsx
cn('px-2', 'py-4', condition && 'bg-primary')
```

**Theme** (`lib/theme.ts`)
- Light/Dark 테마 설정
- React Navigation 테마

## 개발 규칙

### NativeWind v4 스타일링

1. **className 우선**: 모든 스타일링은 className prop 사용
2. **CSS 변수 활용**: global.css의 CSS 변수 사용 (`hsl(var(--primary))`)
3. **Platform.select**: 플랫폼별 스타일은 CVA 내에서 처리
4. **Responsive**: sm: md: lg: prefix 사용 가능

```tsx
<View className="flex-1 items-center justify-center gap-8 p-4">
  <Text className="font-mono text-sm text-muted-foreground">
    Hello World
  </Text>
</View>
```

### TypeScript 코딩 스타일

- **Import 경로**: 절대 경로 사용 (`@/components/ui/button`)
- **타입 정의**: 모든 props에 타입 명시
- **CVA VariantProps**: `VariantProps<typeof xxxVariants>` 타입 활용
- **React.ComponentProps**: 네이티브 컴포넌트 props 확장 시 사용

```tsx
type ButtonProps = React.ComponentProps<typeof Pressable> &
  React.RefAttributes<typeof Pressable> &
  VariantProps<typeof buttonVariants>;
```

### 컴포넌트 추가

React Native Reusables CLI 사용:

```bash
npx react-native-reusables/cli@latest add [...components]

# 예시
npx react-native-reusables/cli@latest add input textarea
npx react-native-reusables/cli@latest add --all  # 모든 컴포넌트
```

## 테스트 가이드

### 테스트 환경

- **프레임워크**: Jest 29 + React Native Testing Library 13
- **Preset**: jest-expo (Expo 최적화)
- **React**: React 19.1.0 + react-test-renderer 19.1.0

### 테스트 파일 작성

```typescript
// lib/utils.test.ts
import { cn } from './utils';

describe('cn utility', () => {
  it('should merge class names', () => {
    const result = cn('px-2', 'py-4');
    expect(result).toContain('px-2');
  });
});
```

### 컴포넌트 Variant 테스트

```typescript
import { buttonVariants } from '@/components/ui/button';

describe('Button Variants', () => {
  it('should generate correct classes for default variant', () => {
    const classes = buttonVariants({ variant: 'default' });
    expect(classes).toContain('bg-primary');
  });
});
```

### 테스트 주의사항

- ✅ 유틸리티 함수 및 CVA variant 테스트 위주
- ⚠️ React 19 + react-test-renderer 호환성 이슈로 인한 렌더링 테스트 제한
- ⚠️ "Can't access .root on unmounted test renderer" 에러 발생 가능

## 파일명 & 경로 규칙

### 컴포넌트

- **UI 컴포넌트**: `components/ui/[component-name].tsx` (kebab-case)
- **화면**: `app/[screen-name].tsx` (kebab-case)
- **레이아웃**: `app/_layout.tsx`, `app/(group)/_layout.tsx`

### 유틸리티

- **라이브러리**: `lib/[util-name].ts` (kebab-case)
- **설정**: `lib/[config-name].ts` (kebab-case)

### 테스트

- **Unit Test**: `[file-name].test.ts(x)` (동일 디렉토리)

## Expo Router 가이드

### 파일 기반 라우팅

```
app/
├── _layout.tsx       → Root layout
├── index.tsx         → / (홈 화면)
├── about.tsx         → /about
├── (tabs)/           → Tab navigation group
│   ├── _layout.tsx   → Tab layout
│   ├── index.tsx     → /(tabs)/
│   └── profile.tsx   → /(tabs)/profile
└── +not-found.tsx    → 404 fallback
```

### 네비게이션

```tsx
import { Link, Stack, useRouter } from 'expo-router';

// Link 컴포넌트
<Link href="/about">About</Link>

// Stack.Screen options
<Stack.Screen options={{ title: 'Home' }} />

// Programmatic navigation
const router = useRouter();
router.push('/about');
```

## 다크모드 지원

### 테마 토글

```tsx
import { useColorScheme } from 'nativewind';

function ThemeToggle() {
  const { colorScheme, toggleColorScheme } = useColorScheme();

  return (
    <Button onPress={toggleColorScheme}>
      <Text>{colorScheme === 'dark' ? '🌙' : '☀️'}</Text>
    </Button>
  );
}
```

### 조건부 스타일

```tsx
<View className="bg-background dark:bg-background">
  <Text className="text-foreground dark:text-foreground">
    Hello
  </Text>
</View>
```

## 문제 해결 가이드

### NativeWind 관련

- NativeWind v4는 CSS 변수 기반이므로 global.css 필수
- Babel 설정에 nativewind/babel 프리셋 필요
- Metro config에 NativeWind transformer 추가 필요

### Expo Router 관련

- 화면이 표시되지 않으면 `app.json`의 `expo-router` 플러그인 확인
- 라우팅 오류 시 `.expo` 폴더 삭제 후 재시작
- TypeScript 타입 오류 시 `expo-env.d.ts` 확인

### 빌드 관련

- New Architecture 활성화 상태 확인 (`app.json`)
- Metro 캐시 클리어: `pnpm dev -c`
- Clean build: `pnpm clean && pnpm install`

## 참고 문서

- **React Native Reusables**: https://reactnativereusables.com
- **NativeWind v4**: https://www.nativewind.dev/
- **Expo Router**: https://docs.expo.dev/router/introduction/
- **shadcn/ui**: https://ui.shadcn.com/ (디자인 시스템 참고)
- **CVA**: https://cva.style/docs (Class Variance Authority)

## Alias 경로

components.json에 정의된 경로 alias:

```json
{
  "@/components": "./components",
  "@/lib": "./lib",
  "@/utils": "./lib/utils",
  "@/ui": "./components/ui",
  "@/hooks": "./hooks"
}
```

## 중요 알림

⚠️ **개발 시 주의사항**:

- **NativeWind v4**: CSS 변수 기반이므로 global.css 수정 필요 시 앱 재시작
- **New Architecture**: 활성화 상태이므로 일부 구형 라이브러리 호환성 문제 가능
- **React 19**: 최신 버전이므로 일부 라이브러리가 미지원할 수 있음
- **Expo Router**: 파일 기반 라우팅이므로 파일명/구조 변경 시 주의
- **CVA Variants**: 재사용 가능한 variant 시스템 활용
- **Platform-specific**: 웹/네이티브 차이점 고려 (Platform.select)

### 스타일링 가이드라인

- **CSS 변수 우선**: Tailwind 직접 색상보다 CSS 변수 사용
- **Semantic Colors**: `primary`, `secondary`, `muted` 등 의미론적 색상 사용
- **Responsive**: 모바일 우선, sm/md/lg breakpoint 활용
- **Dark Mode**: 모든 컴포넌트에 dark: variant 고려
