# NoBrainer - Phase 1 Figma First Draft Prompts

## Mega Prompt (Project Brief)

```text
Act as a senior mobile UX designer. Create Phase 1 (MVP) wireframes for a React Native + Expo app named "NoBrainer".
Scope:
- Manual card creation only (Anki Basic / Basic reversed), Deck management, Study, Local notifications.
- No AI features, no accounts/sync.
Interaction:
- Study screen uses horizontal slide transitions between cards (left/right), to mirror React Native Reanimated swipe. Show Answer reveals back side + evaluation buttons (Hard / Good / Easy).
- Prototype: swipe left/right to go next/prev card; if no prev/next, snap back. Tap "Show Answer" to reveal answer section; then show evaluation buttons.
Constraints:
- Mobile frame iPhone 13/15 (390x844). Use Auto Layout, semantic text styles, spacing 8/12/16/24. Buttons min height 48. Tap targets >= 44.
- Keep copy in Korean. Titles short, buttons concise.
- Pages/Frames: ON-01 Splash/Onboarding, MAIN-01 Home (Deck list), DECK-01 Deck detail, CR-01 Manual card creation, STUDY-01 Study, STUDY-02 Result, SET-01 Settings.
Deliverables:
- One page "Phase1 Wireframes" containing all frames named by screen IDs above.
- Basic prototype connections matching the interaction spec.
```

## Screen Prompts

### ON-01 Splash/Onboarding

```text
Create ON-01 Splash/Onboarding.
Goal: 앱 핵심 가치 간단 소개, "게스트로 시작" 진입 제공.
Include: 로고, 한 줄 슬로건, 2-3장 Onboarding 슬라이드, [게스트로 시작] 주요 CTA.
Notes: 심플한 히어로, Auto Layout, iOS 390x844.
```

### MAIN-01 Home (deck list)

```text
Create MAIN-01 Home (deck list).
Show: 덱 카드 리스트(덱명, 오늘 복습 수, 전체 카드 수), [+ 새 덱], [카드 만들기] FAB.
Top bar: 앱명, 설정 아이콘.
Prototype: 덱 카드 -> DECK-01, [+ 새 덱] -> 새 덱 모달(placeholder), FAB -> CR-01.
```

### DECK-01 Deck detail

```text
Create DECK-01 Deck detail.
Show: 덱 제목/카드 수, 카드 리스트(Front 미리보기/태그), [학습 시작], [카드 추가], 알림 On/Off + 시간.
Prototype: [학습 시작] -> STUDY-01, [카드 추가] -> CR-01.
```

### CR-01 Manual card creation

```text
Create CR-01 Manual card creation.
Template toggle: Basic / Basic (reversed).
Fields: Front, Back, Tags(optional), 덱 선택 드롭다운.
Actions: [저장], [계속 추가].
Notes: 입력 영역은 넉넉하게, 버튼 높이 48+, Auto Layout.
```

### STUDY-01 Study

```text
Create STUDY-01 Study screen.
Layout: 상단 덱 제목/남은 N, 중앙 Front(질문) -> [답변 확인] -> Back(답변) + 평가 버튼 [Hard][Good][Easy].
Motion/Prototype:
- 좌/우 스와이프 제스처로 카드 전환(수평 슬라이드). 좌/우 스와이프 시 next/prev 프레임으로 Navigate + Smart Animate (slide) 적용. 경계 시 스냅백 표기.
- [답변 확인] 탭 시 answer 영역과 평가 버튼이 아래에서 페이드 인.
```

### STUDY-02 Result summary

```text
Create STUDY-02 Result summary.
Show: "오늘 N개 복습 완료!", Hard/Good/Easy 카운트, [홈으로].
Prototype: [홈으로] -> MAIN-01.
```

### SET-01 Settings

```text
Create SET-01 Settings.
Sections: 알림(전체 On/Off, 기본 시간, 덱별 시간 간단 리스트), 앱 정보(버전 등).
Keep minimal for MVP. Prototype back to MAIN-01.
```

## Improve/Iterate Prompts

### Auto Layout / Spacing / Naming

```text
Please apply Auto Layout to lists and forms, unify spacing to 8/12/16/24, and ensure all buttons are at least 48px height. Rename frames and components with screen IDs (e.g., MAIN-01, DECK-01).
```

### Typography / Color

```text
Apply a neutral light theme. Use SF Pro. Headings: 20/24 bold, Body: 16 regular, Caption: 12. Primary color: #2563EB. Maintain WCAG AA contrast.
```

### Slide Prototype

```text
On STUDY-01, add prototype: swipe left/right for next/prev. Use Smart Animate with 240ms ease-out and x-translation. If edge, snap back animation. "Show Answer" -> reveal Answer group with 160ms fade/slide-up.
```

### Componentization

```text
Extract deck card, list row, button, and text-field into components with variants (default/disabled/pressed). Replace instances across frames.
```

### Accessibility / Copy

```text
Ensure tap targets >=44, attach accessible labels to icons, and keep Korean labels concise (2-3 syllables when possible).
```

## References

- 화면 정의: docs/no-brainer/화면정의서.phase1.md
- PRD: docs/no-brainer/PRD.md
- Prompting guide: docs/no-brainer/5_ways_improve_figma_ai.md
