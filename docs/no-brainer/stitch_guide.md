Stitch Prompt Guide: Effective Prompting
This guide provides instructions for crafting effective prompts to design and refine your app with Stitch.

1. Starting Your Project
   Choose to start with a broad concept or specific details. For complex apps, start high-level and then drill down on details screen by screen.

High-Level vs. Detailed Prompts
High-Level (for brainstorming/complex apps): Start with a general idea.

Prompt Example: "An app for marathon runners."
Detailed (for specific results): Describe core functionalities for a better starting point.

Prompt Example: "An app for marathon runners to engage with a community, find partners, get training advice, and find races near them."
Set the Vibe with Adjectives
Use adjectives to define the app’s feel (influences colors, fonts, imagery).

Vibe Prompt Example 1: "A vibrant and encouraging fitness tracking app."

Vibe Prompt Example 2: "A minimalist and focused app for meditation.".

2. Refining Your App by iterating screen by screen
   Refine with Specific, Incremental Changes
   Stitch performs best with clear, specific instructions. Focus on one screen/component and make one or two adjustments per prompt.

Be Specific: Tell Stitch what to change and how.

Prompt Example 1: "On the homepage, add a search bar to the header."

Prompt Example 2: "Change the primary call-to-action button on the login screen to be larger and use the brand's primary blue color."

Focus on Specific Screens/Features:

Example 1 (E-commerce Detail Page): "Product detail page for a Japandi-styled tea store. Sells herbal teas, ceramics. Neutral, minimal colors, black buttons. Soft, elegant font."

Example 2 (E-commerce Detail Page): "Product detail page for Japanese workwear-inspired men's athletic apparel. Dark, minimal design, dark blue primary color. Minimal clothing pictures, natural fabrics, not gaudy."

Describe Desired Imagery
Guide the style or content of images.

Example (Specific Image Style): "Music player page for 'Suburban Legends.' Album art is a macro, zoomed-in photo of ocean water. Page background/imagery should reflect this."

3. Controlling App Theme
   Colors
   Request specific colors or describe a mood for the color palette.

Specific Color Prompt: "Change primary color to forest green."

Mood-Based Color Prompt: "Update theme to a warm, inviting color palette."

Fonts & Borders
Modify typography and element styling (buttons, containers).

Font Style Prompt: "Use a playful sans-serif font." OR "Change headings to a serif font."

Border/Button Style Prompt: "Make all buttons have fully rounded corners." OR "Give input fields a 2px solid black border."

Combined Theme Example : "Book discovery app: serif font for text, light green brand color for accents."

4. How to modify images in your design
   Be Specific When Changing Images
   Clearly identify the image to modify. Use descriptive terms from the app’s content.

Targeting General Images: "Change background of [all] [product] images on [landing page] to light taupe."

Targeting a Specific Image: "On 'Team' page, image of 'Dr. Carter (Lead Dentist)': update her lab coat to black."

Coordinate Images with Theme Changes
If updating theme colors, specify if images should also reflect these changes.

Prompt: "Update theme to light orange. Ensure all images and illustrative icons match this new color scheme."

5. Changing the language of your app’s text.
   Use the following prompt:

Prompt: "Switch all product copy and button text to Spanish." 5. Pro Tips for Stitch
Be Clear & Concise: Avoid ambiguity.
Iterate & Experiment: Refine designs with further prompts.
One Major Change at a Time: Easier to see impact and adjust.
Use UI/UX Keywords: (e.g., “navigation bar,” “call-to-action button,” “card layout”).
Reference Elements Specifically: (e.g., “primary button on sign-up form,” “image in hero section”).
Review & Refine: If a change isn’t right, rephrase or be more targeted.

# NoBrainer - Google Stitch 프롬프트 가이드 (Phase 1)

본 섹션은 `docs/no-brainer/PRD.md`, `docs/no-brainer/화면정의서.phase1.md`를 바탕으로 NoBrainer MVP(Phase 1) 화면을 Google Stitch로 빠르게 생성·개선하기 위한 전용 프롬프트를 제공합니다.

## 1) 프로젝트 브리프(메가 프롬프트) - 한 번에 전체 골격 생성

```text
역할: 당신은 시니어 모바일 UX 디자이너입니다. React Native + Expo 기반의 학습 앱 "NoBrainer"의 Phase 1(MVP) 와이어프레임을 생성하세요.

스코프(Phase 1):
- 수동 카드 생성(Anki Basic/Basic reversed), 덱 관리, 학습/복습, 로컬 알림(1/4/7/14일 규칙), 오프라인-퍼스트
- 제외: 모든 AI 기반 생성, 계정/동기화/백업, FSRS/스마트 알림, 공개 공유

핵심 인터랙션:
- 학습(STUDY-01) 화면은 카드를 좌/우 슬라이드로 전환(수평 이동). [답변 확인] 후 Back(답변)과 평가 [Hard/Good/Easy] 노출
- 프로토타입: 좌/우 스와이프로 이전/다음 카드 이동, 경계에서는 스냅백. [답변 확인] 탭 시 답변영역/평가버튼 페이드-업

제약:
- 디바이스: iPhone 13/15 (390×844). Auto Layout 적용, 간격 8/12/16/24, 버튼 높이 ≥ 48, 터치 타겟 ≥ 44
- 텍스트: 한국어, 타이틀/버튼은 간결하게

지면/프레임(이름 고정): ON-01(온보딩), MAIN-01(홈/덱목록), DECK-01(덱 상세), CR-01(수동 카드 생성), STUDY-01(학습), STUDY-02(결과), SET-01(설정)

산출물:
- 한 페이지 "Phase1 Wireframes" 내에 위 프레임 모두 생성
- 기본 프로토타입 연결 포함(아래 지면별 프롬프트 지시 준수)
```

## 2) 지면별 프롬프트(First Draft로 각 화면 개별 생성/수정)

### ON-01 스플래시/온보딩

```text
Create ON-01 (Splash/Onboarding).
Goal: 앱 핵심 가치 간단 소개, “게스트로 시작” 진입.
Include: 로고, 한 줄 슬로건, 2–3장 온보딩 슬라이드, [게스트로 시작] CTA.
Notes: 심플 히어로, Auto Layout, iOS 390×844, 한국어 카피.
```

### MAIN-01 홈(덱 목록)

```text
Create MAIN-01 (Home - deck list).
Show: 덱 카드 리스트(덱명, 오늘 복습 수, 전체 카드 수), [+ 새 덱], [카드 만들기] FAB.
Top bar: 앱명, 설정 아이콘.
Prototype: 덱 카드 → DECK-01, [+ 새 덱] → 새 덱 모달(placeholder), FAB → CR-01.
```

### DECK-01 덱 상세

```text
Create DECK-01 (Deck detail).
Show: 덱 제목/카드 수, 카드 리스트(Front 미리보기/태그 표시), [학습 시작], [카드 추가], 알림 On/Off + 시간 설정.
Prototype: [학습 시작] → STUDY-01, [카드 추가] → CR-01.
```

### CR-01 수동 카드 생성

```text
Create CR-01 (Manual card creation).
Template toggle: Basic / Basic (reversed).
Fields: Front, Back, Tags(optional), 덱 선택 드롭다운.
Actions: [저장], [계속 추가].
Notes: 입력 영역 넉넉하게, 버튼 높이 ≥48, Auto Layout, 한국어 라벨.
```

### STUDY-01 학습

```text
Create STUDY-01 (Study).
Layout: 상단 덱 제목/남은 N, 중앙 Front(질문) → [답변 확인] → Back(답변) + [Hard][Good][Easy].
Motion/Prototype:
- 좌/우 스와이프 제스처 → 카드 전환(수평 슬라이드). 경계에서는 스냅백.
- [답변 확인] 탭 시 Answer 그룹과 평가 버튼을 페이드/슬라이드 업으로 노출.
```

### STUDY-02 결과 요약

```text
Create STUDY-02 (Result summary).
Show: “오늘 N개 복습 완료!”, Hard/Good/Easy 카운트, [홈으로].
Prototype: [홈으로] → MAIN-01.
```

### SET-01 설정

```text
Create SET-01 (Settings).
Sections: 알림(전체 On/Off, 기본 시간, 덱별 시간 간단 리스트), 앱 정보(버전 등).
Keep minimal for MVP. Prototype back to MAIN-01.
```

## 3) 프로토타이핑/애니메이션 지시(슬라이드 전환 규칙)

```text
STUDY-01 규칙:
- 좌/우 스와이프 → 다음/이전 카드 프레임으로 연결. Smart Animate slide, 240ms ease-out, x-translation.
- 마지막/처음 카드에서 스와이프 시, 같은 프레임 내 스냅백 애니메이션으로 표현(가벼운 x-offset 후 복귀).
- [답변 확인] → Answer 그룹과 [Hard/Good/Easy]를 160ms fade + 8~12px slide-up으로 노출.
```

## 4) UI 시스템 지시(테마/타이포/간격/접근성)

```text
Theme: 라이트 톤, 중립 그레이 + Primary #2563EB.
Typography: SF Pro. H1 24/Bold, H2 20/Semibold, Body 16/Regular, Caption 12.
Spacing scale: 8/12/16/24, 리스트/폼 Auto Layout.
Buttons: 높이 ≥48, 좌우 패딩 16~20, 터치 타겟 ≥44.
Accessibility: 대비 WCAG AA 이상, 아이콘에 레이블, 포커스 순서 자연스럽게.
Copy: 한국어, 버튼/타이틀은 2~3어절로 간결.
Naming: 프레임/컴포넌트에 화면 ID 접두어(MAIN-01, DECK-01 등).
```

## 5) 컴포넌트화 지시

```text
다음 컴포넌트를 추출하고 변형(Variants: default/disabled/pressed)을 만드세요:
- DeckCard, ListRow, PrimaryButton/SecondaryButton, TextField, Toggle, TimePicker(Row)
모든 화면에서 인스턴스로 치환하고 Auto Layout 유지.
```

## 6) 반복 개선 프롬프트(정렬/간격/이름/접근성)

```text
Please apply Auto Layout to all lists/forms, unify spacing to 8/12/16/24, and ensure all buttons are at least 48px height. Rename frames/components with screen IDs (e.g., MAIN-01__DeckCard).
```

```text
On STUDY-01, add swipe left/right prototype with Smart Animate slide (240ms ease-out). Add snap-back at edges. Make “Show Answer” reveal smooth (160ms fade/slide-up).
```

```text
Ensure tap targets ≥44, add accessible labels to icons, and keep all Korean labels concise. Verify contrast ratios (AA+).
```

## 7) 검수 체크리스트

- 프레임 이름이 화면 ID와 일치하는가? (ON-01, MAIN-01, …)
- Auto Layout이 리스트/폼에 모두 적용되어 있는가?
- 버튼 높이/터치 타겟/간격 스케일이 가이드와 일치하는가?
- STUDY-01 좌/우 슬라이드 및 스냅백, [답변 확인] 전환이 동작하는가?
- 한국어 카피가 간결하고 일관적인가?
- 접근성(대비/레이블/포커스)이 충족되는가?

## 8) 변형 프롬프트 템플릿(상황별)

```text
“MAIN-01에서 덱 카드를 2열 그리드로 변경하고, 카드 내에 오늘/전체 수를 배지로 표현하세요. Auto Layout 유지.”
```

```text
“CR-01에서 Basic reversed 선택 시 Front/Back 필드의 플레이스홀더를 서로 교차된 예제로 업데이트하세요.”
```

```text
“SET-01에 덱별 시간 리스트 아이템을 스와이프 삭제 제스처 표현으로 교체(아이콘/텍스트)하고, 접근성 레이블을 추가하세요.”
```

참고 문서: `docs/no-brainer/PRD.md`, `docs/no-brainer/화면정의서.phase1.md`
